import sqlglot
from sqlglot import exp


def parse_schema(sql_script: str) -> dict:
    """
    Parse a MySQL schema and convert it into
    PIVOT's canonical schema representation.
    """

    statements = sqlglot.parse(sql_script, read="mysql")

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
                "triggers": []
            }

            # Extract columns
            for column in statement.find_all(exp.ColumnDef):
                table_data["columns"].append({
                    "name": column.name,
                    "data_type": column.kind.sql()
                })

            # Extract primary keys
            for column in statement.find_all(exp.ColumnDef):
                for constraint in column.args.get("constraints", []):
                    if isinstance(
                        constraint.kind,
                        exp.PrimaryKeyColumnConstraint
                    ):
                        table_data["primary_keys"].append(column.name)

            table_data["primary_keys"] = list(
                dict.fromkeys(table_data["primary_keys"])
            )

            # Extract constraints
            for column in statement.find_all(exp.ColumnDef):
                for constraint in column.args.get("constraints", []):

                    if isinstance(
                        constraint.kind,
                        exp.UniqueColumnConstraint
                    ):
                        table_data["constraints"].append({
                            "type": "UNIQUE",
                            "column": column.name
                        })

                    elif isinstance(
                        constraint.kind,
                        exp.CheckColumnConstraint
                    ):
                        table_data["constraints"].append({
                            "type": "CHECK",
                            "column": column.name,
                            "condition": constraint.kind.this.sql()
                        })

            # Extract foreign keys
            for foreign_key in statement.find_all(exp.ForeignKey):

                local_columns = [
                    column.name
                    for column in foreign_key.expressions
                ]

                reference = foreign_key.args.get("reference")

                if reference:
                    reference_schema = reference.this

                    referenced_table = reference_schema.this.name

                    referenced_columns = [
                        column.name
                        for column in reference_schema.expressions
                    ]

                    for local_column, referenced_column in zip(
                        local_columns,
                        referenced_columns
                    ):
                        table_data["foreign_keys"].append({
                            "column": local_column,
                            "references_table": referenced_table,
                            "references_column": referenced_column
                        })

            schema["tables"].append(table_data)

        # -----------------------------
        # CREATE INDEX
        # -----------------------------
        elif isinstance(statement.this, exp.Index):

            index = statement.this

            index_table = index.args.get("table")

            if not index_table:
                continue

            table_name = index_table.name

            index_data = {
                "name": index.this.name,
                "columns": [],
                "unique": bool(statement.args.get("unique")),
                "primary": bool(statement.args.get("primary"))
            }

            index_params = index.args.get("params")

            if index_params:
                for ordered_column in index_params.args.get(
                    "columns", []
                ):
                    index_data["columns"].append(
                        ordered_column.this.name
                    )

            # Find corresponding table
            for table_data in schema["tables"]:
                if table_data["name"] == table_name:
                    table_data["indexes"].append(index_data)
                    break

    return schema