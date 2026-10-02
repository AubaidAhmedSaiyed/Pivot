import re
import sqlglot
from sqlglot import exp


def parse_schema(sql_script: str) -> dict:
    """
    Parse a MySQL schema and convert it into
    PIVOT's canonical schema representation.
    """

    statements = sqlglot.parse(
        sql_script,
        read="mysql",
        error_level="ignore"
    )

    schema = {
        "database": "mysql",
        "tables": []
    }

    def _extract_command_text(statement):
        expression = statement.args.get("expression", "")

        return (
            f"{statement.args.get('this', '')}"
            f"{expression}"
        ).strip()

    def _is_create_table_command(statement):
        if not isinstance(statement, exp.Command):
            return False

        command_text = _extract_command_text(statement)

        return command_text.upper().startswith("CREATE TABLE")

    def _extract_command_table_name(statement):
        command_text = _extract_command_text(statement)

        match = re.search(
            r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`\"]?([A-Za-z_][A-Za-z0-9_]*)[`\"]?",
            command_text,
            re.IGNORECASE
        )

        if not match:
            return None

        return match.group(1)

    def _split_create_table_definitions(command_text):
        open_index = command_text.find("(")
        close_index = command_text.rfind(")")

        if open_index == -1 or close_index == -1:
            return []

        body = command_text[open_index + 1:close_index]

        definitions = []
        current = []
        depth = 0
        quote = None

        for char in body:
            if quote:
                current.append(char)

                if char == quote:
                    quote = None

                continue

            if char in ("'", '"', "`"):
                quote = char
                current.append(char)
                continue

            if char == "(":
                depth += 1
                current.append(char)
                continue

            if char == ")":
                depth -= 1
                current.append(char)
                continue

            if char == "," and depth == 0:
                definition = "".join(current).strip()

                if definition:
                    definitions.append(definition)

                current = []
                continue

            current.append(char)

        definition = "".join(current).strip()

        if definition:
            definitions.append(definition)

        return definitions

    for statement in statements:

        if _is_create_table_command(statement):
            command_text = _extract_command_text(statement)
            table_name = _extract_command_table_name(statement)

            if not table_name:
                continue

            table_data = {
                "name": table_name,
                "columns": [],
                "primary_keys": [],
                "foreign_keys": [],
                "constraints": [],
                "indexes": [],
                "triggers": [],
                "unsupported_features": []
            }

            for definition in _split_create_table_definitions(
                command_text
            ):
                primary_key = re.search(
                    r"PRIMARY\s+KEY\s*\(([^)]*)\)",
                    definition,
                    re.IGNORECASE
                )

                if primary_key:
                    table_data["primary_keys"].extend(
                        re.findall(
                            r"[`\"]?([A-Za-z_][A-Za-z0-9_]*)[`\"]?",
                            primary_key.group(1)
                        )
                    )
                    continue

                index_match = re.match(
                    r"(?:UNIQUE\s+)?(?:KEY|INDEX)"
                    r"\s+[`\"]?([A-Za-z_][A-Za-z0-9_]*)[`\"]?"
                    r"\s*\(([^)]*)\)",
                    definition,
                    re.IGNORECASE
                )

                if index_match:
                    index_name = index_match.group(1)
                    index_columns = re.findall(
                        r"[`\"]?([A-Za-z_][A-Za-z0-9_]*)[`\"]?",
                        index_match.group(2)
                    )

                    table_data["indexes"].append({
                        "name": index_name,
                        "columns": index_columns,
                        "unique": bool(
                            re.match(
                                r"UNIQUE\s+(?:KEY|INDEX)",
                                definition,
                                re.IGNORECASE
                            )
                        ),
                        "primary": False
                    })

                    continue

                if re.match(
                    r"(?:CONSTRAINT|PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE|CHECK|KEY|INDEX)\b",
                    definition,
                    re.IGNORECASE
                ):
                    continue

                column_match = re.match(
                    r"[`\"]?([A-Za-z_][A-Za-z0-9_]*)[`\"]?\s+(.+)",
                    definition
                )

                if not column_match:
                    continue

                column_name = column_match.group(1)
                type_and_constraints = column_match.group(2)
                constraint_match = re.search(
                    r"\s+(?=(?:NOT\s+NULL\b|NULL\b|DEFAULT\b|PRIMARY\s+KEY\b|UNIQUE\b|REFERENCES\b|CHECK\s*\(|AUTO_INCREMENT\b|ON\s+UPDATE\b|COMMENT\b|COLLATE\b))",
                    type_and_constraints,
                    re.IGNORECASE
                )
                column_type = (
                    type_and_constraints[:constraint_match.start()].strip()
                    if constraint_match
                    else type_and_constraints.strip()
                )

                if not column_type:
                    continue

                table_data["columns"].append({
                    "name": column_name,
                    "data_type": column_type,
                    "unsigned": column_type.upper().startswith("U"),
                    "nullable": not bool(re.search(
                        r"\bNOT\s+NULL\b",
                        definition,
                        re.IGNORECASE
                    )),
                    "default": None,
                    "auto_increment": bool(re.search(
                        r"\bAUTO_INCREMENT\b",
                        definition,
                        re.IGNORECASE
                    )),
                    "on_update": None
                })

                if re.search(
                    r"\bPRIMARY\s+KEY\b",
                    definition,
                    re.IGNORECASE
                ):
                    table_data["primary_keys"].append(column_name)

            table_data["primary_keys"] = list(
                dict.fromkeys(table_data["primary_keys"])
            )
            schema["tables"].append(table_data)
            continue

        # -----------------------------
        # ALTER TABLE
        # -----------------------------
        if isinstance(
            statement,
            exp.Alter
        ):

            table_name = statement.this.name

            for action in statement.args.get(
                "actions",
                []
            ):

                if not isinstance(
                    action,
                    exp.AddConstraint
                ):
                    continue

                for constraint in action.expressions:

                    if not isinstance(
                        constraint,
                        exp.Constraint
                    ):
                        continue

                    for foreign_key in constraint.expressions:

                        if not isinstance(
                            foreign_key,
                            exp.ForeignKey
                        ):
                            continue

                        local_columns = [
                            column.name
                            for column in foreign_key.expressions
                        ]

                        reference = foreign_key.args.get(
                            "reference"
                        )

                        if not reference:
                            continue

                        reference_schema = reference.this

                        referenced_table = (
                            reference_schema.this.name
                        )

                        referenced_columns = [
                            column.name
                            for column in reference_schema.expressions
                        ]

                        schema_table = next(
                            (
                                table
                                for table in schema["tables"]
                                if table["name"] == table_name
                            ),
                            None
                        )

                        if not schema_table:
                            continue

                        for (
                            local_column,
                            referenced_column
                        ) in zip(
                            local_columns,
                            referenced_columns
                        ):

                            schema_table[
                                "foreign_keys"
                            ].append({
                                "column": local_column,
                                "references_table": referenced_table,
                                "references_column": referenced_column
                            })

            continue

        if not isinstance(statement, exp.Create):
            continue

        # -----------------------------
        # CREATE TABLE
        # -----------------------------
        if isinstance(statement.this, exp.Schema):

            table = statement.this.this

            if not isinstance(table, exp.Table):
                continue

            table_data = {
                "name": table.name,
                "columns": [],
                "primary_keys": [],
                "foreign_keys": [],
                "constraints": [],
                "indexes": [],
                "triggers": [],
                "unsupported_features": []
            }

            # -----------------------------
            # Extract columns
            # -----------------------------
            for column in statement.find_all(exp.ColumnDef):

                column_type = column.kind.sql()

                nullable = True
                default = None
                auto_increment = False
                on_update = None

                for constraint in column.args.get("constraints", []):

                    if isinstance(
                        constraint.kind,
                        exp.NotNullColumnConstraint
                     ):
                        nullable = False

                    elif isinstance(
                        constraint.kind,
                        exp.DefaultColumnConstraint
                    ):
                        default_expression = constraint.kind.this

                        if default_expression is not None:
                             default = default_expression.sql(
                                  dialect="mysql"
                            )

                    elif isinstance(
                        constraint.kind,
                        exp.OnUpdateColumnConstraint
                    ):
                        on_update_expression = constraint.kind.this

                        if on_update_expression is not None:
                            on_update = on_update_expression.sql(
                                dialect="mysql"
                            )

                    elif isinstance(
                        constraint.kind,
                        exp.AutoIncrementColumnConstraint
                    ):
                         auto_increment = True

                table_data["columns"].append({
                    "name": column.name,
                    "data_type": column_type,
                    "unsigned": column_type.upper().startswith("U"),
                    "nullable": nullable,
                    "default":  default,
                    "auto_increment": auto_increment,
                    "on_update": on_update
                })

            # -----------------------------
            # Extract primary keys
            # Handles:
            # 1. Column-level PRIMARY KEY
            # 2. Table-level PRIMARY KEY
            # 3. Composite PRIMARY KEY
            # -----------------------------

            # Column-level PRIMARY KEY
            for column in statement.find_all(exp.ColumnDef):

                for constraint in column.args.get(
                    "constraints",
                    []
                ):

                    if isinstance(
                        constraint.kind,
                        exp.PrimaryKeyColumnConstraint
                    ):
                        table_data["primary_keys"].append(
                            column.name
                        )

            # Table-level PRIMARY KEY
            for primary_key in statement.find_all(
                exp.PrimaryKey
            ):

                for column in primary_key.expressions:

                    table_data["primary_keys"].append(
                        column.name
                    )

            # Remove duplicate primary keys
            table_data["primary_keys"] = list(
                dict.fromkeys(
                    table_data["primary_keys"]
                )
            )

            # -----------------------------
            # Extract column-level constraints
            # -----------------------------
            for column in statement.find_all(
                exp.ColumnDef
            ):

                for constraint in column.args.get(
                    "constraints",
                    []
                ):

                    # UNIQUE
                    if isinstance(
                        constraint.kind,
                        exp.UniqueColumnConstraint
                    ):

                        table_data["constraints"].append({
                            "type": "UNIQUE",
                            "column": column.name
                        })

                    # CHECK
                    elif isinstance(
                        constraint.kind,
                        exp.CheckColumnConstraint
                    ):

                        table_data["constraints"].append({
                            "type": "CHECK",
                            "column": column.name,
                            "condition": constraint.kind.this.sql()
                        })

            # -----------------------------
            # Extract table-level UNIQUE
            # Handles:
            # 1. UNIQUE (column)
            # 2. UNIQUE KEY (column)
            # 3. Composite UNIQUE
            # -----------------------------

            # -----------------------------
            # Extract table-level INDEXES
            # -----------------------------
            for expression in statement.this.expressions:

                if isinstance(
                    expression,
                    exp.IndexColumnConstraint
                ):
                    index_name = expression.this.name

                    index_columns = [
                        ordered_column.this.name
                        for ordered_column in expression.expressions
                        if ordered_column.this
                    ]

                    table_data["indexes"].append({
                        "name": index_name,
                        "columns": index_columns,
                        "unique": False,
                        "primary": False
                    })



            # -----------------------------
            # Extract table-level constraints
            # -----------------------------
            for expression in statement.this.expressions:
               # UNIQUE
                if isinstance(
                    expression,
                    exp.UniqueColumnConstraint
                  ):

                   unique_schema = expression.args.get(
                       "this"
                   )

                   if not unique_schema:
                       continue

                   for column in unique_schema.expressions:

                        table_data["constraints"].append({
                            "type": "UNIQUE",
                            "column": column.name
                        })

                # Named CHECK constraint
                elif isinstance(
                    expression,
                    exp.Constraint
                ):

                 check_constraint = expression.find(
                     exp.CheckColumnConstraint
                 )

                 if check_constraint:

                     table_data["constraints"].append({
                         "type": "CHECK",
                         "name": expression.this.name,
                         "condition": check_constraint.this.sql()
                     })




            # -----------------------------
            # Extract foreign keys
            # -----------------------------
            for foreign_key in statement.find_all(
                exp.ForeignKey
            ):

                local_columns = [
                    column.name
                    for column in foreign_key.expressions
                ]

                reference = foreign_key.args.get(
                    "reference"
                )

                if reference:

                    reference_schema = reference.this

                    referenced_table = (
                        reference_schema.this.name
                    )

                    referenced_columns = [
                        column.name
                        for column in reference_schema.expressions
                    ]

                    for (
                        local_column,
                        referenced_column
                    ) in zip(
                        local_columns,
                        referenced_columns
                    ):

                        table_data["foreign_keys"].append({
                            "column": local_column,
                            "references_table": referenced_table,
                            "references_column": referenced_column
                        })

            # -----------------------------
            # Add table to schema
            # -----------------------------
            schema["tables"].append(
                table_data
            )
        # -----------------------------
        # CREATE INDEX
        # -----------------------------
        elif isinstance(
            statement.this,
            exp.Index
        ):

            index = statement.this

            index_table = index.args.get(
                "table"
            )

            if not index_table:
                continue

            table_name = index_table.name

            index_data = {
                "name": index.this.name,
                "columns": [],
                "unique": bool(
                    statement.args.get("unique")
                ),
                "primary": bool(
                    statement.args.get("primary")
                )
            }

            index_params = index.args.get(
                "params"
            )

            if index_params:

                for ordered_column in index_params.args.get(
                    "columns",
                    []
                ):

                    index_data["columns"].append(
                        ordered_column.this.name
                    )

            # Find corresponding table
            for table_data in schema["tables"]:

                if table_data["name"] == table_name:

                    table_data["indexes"].append(
                        index_data
                    )

                    break

    # -----------------------------
    # CREATE FULLTEXT INDEX
    # Second pass
    # -----------------------------
    for statement in statements:

        if not isinstance(
            statement,
            exp.Command
        ):
            continue

        expression = statement.args.get(
            "expression",
            ""
        )

        command_text = (
            f"{statement.args.get('this', '')}"
            f"{expression}"
        ).strip()

        if not command_text.upper().startswith(
            "CREATE FULLTEXT INDEX"
        ):
            continue

        # Normalize whitespace
        command_text = " ".join(
            command_text.split()
        )

        parts = command_text.split()

        if len(parts) < 6:
            continue

        index_name = parts[3]

        # Find table name after ON
        upper_parts = [
            part.upper()
            for part in parts
        ]

        if "ON" not in upper_parts:
            continue

        on_index = upper_parts.index(
            "ON"
        )

        if on_index + 1 >= len(parts):
            continue

        table_name = (
            parts[on_index + 1]
            .split("(")[0]
            .strip("`")
        )

        for table_data in schema["tables"]:

            if table_data["name"] == table_name:

                table_data[
                    "unsupported_features"
                ].append({
                    "type": "FULLTEXT_INDEX",
                    "name": index_name.strip("`")
                })

                break

    # -----------------------------
    # CREATE TRIGGER
    # Second pass
    # -----------------------------
    for statement in statements:

        if not isinstance(
            statement,
            exp.Command
        ):
            continue

        expression = statement.args.get(
            "expression",
            ""
        )

        command_text = _extract_command_text(statement)

        if not command_text.upper().startswith(
            "CREATE TRIGGER"
        ):
            continue

        # Normalize whitespace
        command_text = " ".join(
            command_text.split()
        )

        parts = command_text.split()

        if len(parts) < 6:
            continue

        trigger_name = parts[2]

        # Find table name after ON
        upper_parts = [
            part.upper()
            for part in parts
        ]

        if "ON" not in upper_parts:
            continue

        on_index = upper_parts.index(
            "ON"
        )

        if on_index + 1 >= len(parts):
            continue

        table_name = (
            parts[on_index + 1]
            .strip("`")
        )

        for table_data in schema["tables"]:

            if table_data["name"] == table_name:

                table_data["triggers"].append({
                    "name": trigger_name
                })

                break

    return schema
