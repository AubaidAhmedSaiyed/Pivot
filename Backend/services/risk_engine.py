def assess_migration_risk(schema: dict) -> dict:
    """
    Assess migration risk from analyzed schema features.

    This is a rule-based risk assessment layer.
    ML complexity prediction remains separate.
    """

    risks = []

    summary = schema.get("summary", {})

    if summary.get("unsupported_column_count", 0) > 0:
        risks.append({
            "type": "UNSUPPORTED_DATATYPE",
            "severity": "high",
            "message": "Schema contains unsupported datatypes."
        })

    if summary.get("unsupported_feature_count", 0) > 0:
        risks.append({
            "type": "UNSUPPORTED_FEATURE",
            "severity": "high",
            "message": "Schema contains unsupported migration features."
        })

    if summary.get("trigger_count", 0) > 0:
        risks.append({
            "type": "TRIGGER",
            "severity": "medium",
            "message": "Schema contains triggers that may require manual migration review."
        })

    if summary.get("foreign_key_count", 0) > 0:
        risks.append({
            "type": "FOREIGN_KEYS",
            "severity": "medium",
            "message": "Schema contains foreign-key relationships that require dependency-aware migration."
        })

    if summary.get("unsigned_type_count", 0) > 0:
        risks.append({
            "type": "UNSIGNED_TYPES",
            "severity": "medium",
            "message": "Schema contains MySQL UNSIGNED types whose range semantics are not directly preserved in PostgreSQL."
        })

    high_risks = sum(
        1 for risk in risks
        if risk["severity"] == "high"
    )

    medium_risks = sum(
        1 for risk in risks
        if risk["severity"] == "medium"
    )

    if high_risks > 0:
        risk_level = "HIGH"
    elif medium_risks > 0:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        "risk_level": risk_level,
        "risk_count": len(risks),
        "risks": risks
    }