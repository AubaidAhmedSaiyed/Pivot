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

    for statement in statements:

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

                table_data["columns"].append({
                    "name": column.name,
                    "data_type": column_type,
                    "unsigned": column_type.upper() == "UINT"
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
            for expression in statement.this.expressions:

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

        command_text = (
            f"{statement.args.get('this', '')}"
            f"{expression}"
        ).strip()

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