def extract_features(schema: dict) -> dict:
    """
    Extract schema-derived features for the ML model.

    Features are based on the PIVOT project definition:
    - table count
    - foreign key count
    - constraint count
    - trigger count
    - unsupported feature count
    """

    tables = schema.get("tables", [])

    table_count = len(tables)

    foreign_key_count = 0
    constraint_count = 0
    trigger_count = 0
    unsupported_feature_count = 0
    unsigned_type_count = 0

    for table in tables:
        foreign_key_count += len(
            table.get("foreign_keys", [])
        )

        constraint_count += len(
            table.get("constraints", [])
        )

        trigger_count += len(
            table.get("triggers", [])
        )

        unsupported_feature_count += len(
            table.get("unsupported_features", [])
        )

        for column in table.get("columns", []):
          if column.get("unsigned", False):
             unsigned_type_count += 1

    return {
        "table_count": table_count,
        "foreign_key_count": foreign_key_count,
        "constraint_count": constraint_count,
        "trigger_count": trigger_count,
        "unsupported_feature_count": unsupported_feature_count,
        "unsigned_type_count": unsigned_type_count
    }