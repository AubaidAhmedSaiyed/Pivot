from services.schema_parser import parse_schema
from services.type_mapper import map_data_type
from services.migration_rules import get_migration_rules


def _build_summary(
    schema: dict,
    mapped_column_count: int,
    unsupported_column_count: int
) -> dict:
    """
    Build summary statistics for the analyzed schema.
    """

    tables = schema.get("tables", [])

    return {
        "table_count": len(tables),

        "column_count": sum(
            len(table.get("columns", []))
            for table in tables
        ),

        "primary_key_count": sum(
            len(table.get("primary_keys", []))
            for table in tables
        ),

        "foreign_key_count": sum(
            len(table.get("foreign_keys", []))
            for table in tables
        ),

        "constraint_count": sum(
            len(table.get("constraints", []))
            for table in tables
        ),

        "index_count": sum(
            len(table.get("indexes", []))
            for table in tables
        ),

        "trigger_count": sum(
            len(table.get("triggers", []))
            for table in tables
        ),

        "unsupported_feature_count": sum(
            len(table.get("unsupported_features", []))
            for table in tables
        ),

        "mapped_column_count": mapped_column_count,

        "unsupported_column_count": unsupported_column_count
    }


def analyze_schema(sql_script: str) -> dict:
    """
    Perform complete schema analysis.

    Flow:
        SQL
        -> Schema Parser
        -> Datatype Mapping
        -> Migration Rules
        -> Analysis Summary
    """

    schema = parse_schema(sql_script)

    mapped_column_count = 0
    unsupported_column_count = 0
    issues = []

    for table in schema.get("tables", []):
        for column in table.get("columns", []):
            source_type = column.get("data_type")

            if not source_type:
                continue

            try:
                target_type = map_data_type(source_type)
                migration_rule = get_migration_rules(source_type)

                column["source_type"] = source_type
                column["target_type"] = target_type
                column["migration_rule"] = migration_rule["rules"]

                mapped_column_count += 1

                if column.get("unsigned"):
                    issues.append({
                        "type": "UNSIGNED_TYPE",
                        "severity": "warning",
                        "table": table.get("name"),
                        "column": column.get("name"),
                        "message": (
                            f"MySQL UNSIGNED type '{source_type}' is mapped to "
                            f"'{target_type}' in PostgreSQL. PostgreSQL does not "
                            "provide an equivalent unsigned numeric type, so the "
                            "original unsigned range semantics are not fully preserved."
                        )
                    })


            except ValueError as exc:
                column["source_type"] = source_type
                column["target_type"] = None
                column["migration_rule"] = "UNSUPPORTED_TYPE"
                column["mapping_error"] = str(exc)

                issues.append({
                    "type": "UNSUPPORTED_DATATYPE",
                    "severity": "error",
                    "table": table.get("name"),
                    "column": column.get("name"),
                    "message": (
                        f"Unsupported MySQL datatype: {source_type}"
                    )
                })

                unsupported_column_count += 1

    schema["summary"] = _build_summary(
        schema,
        mapped_column_count,
        unsupported_column_count
    )

    schema["issues"] = issues

    return schema