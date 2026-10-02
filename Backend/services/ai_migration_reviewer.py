import json
import os
from typing import Any

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

AI_MODEL = os.getenv("OPENAI_MODEL", "gpt-6-luna")


def _generate_ai_review(
    analysis: dict[str, Any],
    migration: dict[str, Any],
) -> dict[str, Any]:
    client = OpenAI()

    prompt = f"""
You are an AI migration review assistant for Pivot.

Pivot migrates MySQL database schemas to PostgreSQL.

Your job is to REVIEW the deterministic migration analysis.
Do not invent schema facts.
Do not change or rewrite the generated SQL.
Do not make migration decisions that contradict the provided
analysis or migration output.

Explain:
1. Important migration risks.
2. Unsupported or potentially incompatible MySQL features.
3. Why important datatype or schema transformations were made.
4. What a developer should manually review before deployment.

Return ONLY valid JSON in this structure:

{{
  "summary": "short overall explanation",
  "issues": [
    {{
      "type": "issue type",
      "severity": "low|medium|high",
      "explanation": "plain-language explanation",
      "recommendation": "recommended manual action"
    }}
  ],
  "recommendations": [
    "recommendation 1"
  ]
}}

Deterministic schema analysis:
{json.dumps(analysis, indent=2)}

Generated PostgreSQL migration:
{json.dumps(migration, indent=2)}
"""

    try:
        response = client.responses.create(
            model=AI_MODEL,
            input=prompt,
        )

        return json.loads(response.output_text)

    except Exception as exc:
        return {
            "summary": "AI review was unavailable. Deterministic migration review is still available.",
            "issues": [],
            "recommendations": [
                "Review the deterministic migration analysis and generated PostgreSQL SQL manually."
            ],
            "error": "AI review service is currently unavailable.",
        }


def review_migration(
    analysis: dict[str, Any],
    migration: dict[str, Any],
) -> dict[str, Any]:
    """
    Review an analyzed schema and generated PostgreSQL migration.

    This layer converts deterministic migration findings
    into a structured review and supplements them with
    AI-generated explanations and recommendations.
    """

    issues: list[dict[str, Any]] = []
    recommendations: list[str] = []
    migration_decisions: list[dict[str, Any]] = []

    analysis_issues = analysis.get("issues", [])
    risk = analysis.get("risk", {})

    warnings = migration.get("warnings", [])
    transformations = migration.get("transformations", [])

    # -------------------------------------------------
    # Analysis issues
    # -------------------------------------------------

    for issue in analysis_issues:
        issue_type = issue.get("type")
        severity = issue.get("severity", "info")

        review_issue = {
            "type": issue_type,
            "severity": severity,
            "table": issue.get("table"),
            "column": issue.get("column"),
            "explanation": issue.get("message", ""),
            "recommendation": (
                "Review this migration item before production deployment."
            ),
        }

        issues.append(review_issue)

    # -------------------------------------------------
    # Migration warnings
    # -------------------------------------------------

    for warning in warnings:
        warning_type = warning.get("type")

        issues.append(
            {
                "type": warning_type,
                "severity": "warning",
                "table": warning.get("table"),
                "column": warning.get("column"),
                "explanation": warning.get("message", ""),
                "recommendation": (
                    "Review the generated migration and determine whether "
                    "manual PostgreSQL changes are required."
                ),
            }
        )

    # -------------------------------------------------
    # Migration transformations
    # -------------------------------------------------

    for transformation in transformations:
        migration_decisions.append(
            {
                "type": transformation.get("type"),
                "table": transformation.get("table"),
                "column": transformation.get("column"),
                "source": transformation.get("source"),
                "target": transformation.get("target"),
                "rule": transformation.get("rule"),
                "action": transformation.get("action"),
            }
        )

    # -------------------------------------------------
    # Risk-based recommendations
    # -------------------------------------------------

    risk_level = risk.get("risk_level", "LOW")

    if risk_level == "HIGH":
        recommendations.append(
            "Manual review is required before executing the migration."
        )
    elif risk_level == "MEDIUM":
        recommendations.append(
            "Review the identified migration risks before deployment."
        )
    else:
        recommendations.append(
            "No high-risk migration issues were identified by the "
            "current rule-based analysis."
        )

    if warnings:
        recommendations.append(
            "Review all migration warnings because some source features "
            "were not directly generated in PostgreSQL."
        )

    manual_review_required = risk_level in {"HIGH", "MEDIUM"} or len(warnings) > 0

    # -------------------------------------------------
    # Summary
    # -------------------------------------------------

    summary = (
        f"Migration review completed with {len(issues)} identified "
        f"review item(s). Overall migration risk is {risk_level}."
    )

    ai_review = _generate_ai_review(
        analysis,
        migration,
    )

    return {
        "summary": summary,
        "overall_assessment": risk_level,
        "issues": issues,
        "migration_decisions": migration_decisions,
        "manual_review_required": manual_review_required,
        "recommendations": recommendations,
        "ai_review": ai_review,
    }
