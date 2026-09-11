def calculate_complexity(
    table_count: int,
    foreign_key_count: int,
    constraint_count: int,
    trigger_count: int,
    unsupported_feature_count: int
) -> str:
    """
    Calculate migration complexity based on
    schema-derived features.
    """

    score = (
        table_count
        + (foreign_key_count * 2)
        + constraint_count
        + (trigger_count * 3)
        + (unsupported_feature_count * 4)
    )

    if score <= 5:
        return "LOW"

    elif score <= 15:
        return "MEDIUM"

    return "HIGH"