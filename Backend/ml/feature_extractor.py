def extract_features(schema: dict) -> dict:
    """
    Extract schema-derived features for the ML model.

    Features represent schema complexity relevant to
    MySQL -> PostgreSQL migration.
    """

    tables = schema.get("tables", [])

    table_count = len(tables)

    column_count = 0
    foreign_key_count = 0
    constraint_count = 0
    trigger_count = 0
    unsupported_feature_count = 0
    unsigned_type_count = 0
    index_count = 0
    auto_increment_count = 0
    default_value_count = 0
    check_constraint_count = 0
    unique_constraint_count = 0

    for table in tables:

        columns = table.get("columns", [])
        constraints = table.get("constraints", [])
        foreign_keys = table.get("foreign_keys", [])
        indexes = table.get("indexes", [])
        triggers = table.get("triggers", [])
        unsupported_features = table.get("unsupported_features", [])

        column_count += len(columns)
        foreign_key_count += len(foreign_keys)
        constraint_count += len(constraints)
        index_count += len(indexes)
        trigger_count += len(triggers)
        unsupported_feature_count += len(unsupported_features)

        for column in columns:

            if column.get("unsigned", False):
                unsigned_type_count += 1

            if column.get("auto_increment", False):
                auto_increment_count += 1

            if column.get("default") is not None:
                default_value_count += 1

        for constraint in constraints:

            constraint_type = constraint.get("type", "").upper()

            if constraint_type == "CHECK":
                check_constraint_count += 1

            elif constraint_type == "UNIQUE":
                unique_constraint_count += 1

    return {
        "table_count": table_count,
        "column_count": column_count,
        "foreign_key_count": foreign_key_count,
        "constraint_count": constraint_count,
        "index_count": index_count,
        "trigger_count": trigger_count,
        "unsupported_feature_count": unsupported_feature_count,
        "unsigned_type_count": unsigned_type_count,
        "auto_increment_count": auto_increment_count,
        "default_value_count": default_value_count,
        "check_constraint_count": check_constraint_count,
        "unique_constraint_count": unique_constraint_count,
    }