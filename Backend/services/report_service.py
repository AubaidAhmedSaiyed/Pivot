from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Preformatted,
)


def generate_migration_report(migration_run) -> bytes:
    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        spaceAfter=12,
    )

    heading_style = ParagraphStyle(
        "ReportHeading",
        parent=styles["Heading2"],
        spaceBefore=10,
        spaceAfter=6,
    )

    body_style = styles["BodyText"]

    story = []

    # Title
    story.append(
        Paragraph(
            "Pivot Migration Report",
            title_style,
        )
    )

    story.append(
        Paragraph(
            "MySQL → PostgreSQL Schema Migration",
            body_style,
        )
    )

    story.append(Spacer(1, 10))

    # Migration information
    story.append(
        Paragraph(
            "Migration Information",
            heading_style,
        )
    )

    migration_info = [
        ["Migration ID", str(migration_run.id)],
        ["Project ID", str(migration_run.project_id)],
        ["Status", migration_run.status],
        ["Created At", str(migration_run.created_at)],
    ]

    info_table = Table(
        migration_info,
        colWidths=[45 * mm, 115 * mm],
    )

    info_table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("PADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )

    story.append(info_table)

    # Analysis summary
    analysis = migration_run.analysis_result or {}
    summary = analysis.get("summary", {})
    risk = analysis.get("risk", {})

    story.append(
        Paragraph(
            "Schema Analysis Summary",
            heading_style,
        )
    )

    summary_data = [
        ["Metric", "Value"],
        ["Tables", str(summary.get("table_count", 0))],
        ["Columns", str(summary.get("column_count", 0))],
        ["Primary Keys", str(summary.get("primary_key_count", 0))],
        ["Foreign Keys", str(summary.get("foreign_key_count", 0))],
        ["Constraints", str(summary.get("constraint_count", 0))],
        ["Indexes", str(summary.get("index_count", 0))],
        ["Unsupported Features", str(summary.get("unsupported_feature_count", 0))],
    ]

    summary_table = Table(
        summary_data,
        colWidths=[90 * mm, 70 * mm],
    )

    summary_table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                ("PADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )

    story.append(summary_table)

    # Risk / ML
    story.append(
        Paragraph(
            "Migration Risk & Complexity",
            heading_style,
        )
    )

    ml_prediction = migration_run.ml_prediction or {}

    story.append(
        Paragraph(
            f"Rule-based Risk Level: {risk.get('risk_level', 'UNKNOWN')}",
            body_style,
        )
    )

    story.append(
        Paragraph(
            f"ML Complexity: {ml_prediction.get('complexity', 'UNKNOWN')}",
            body_style,
        )
    )

    # Transformations
    story.append(
        Paragraph(
            "Migration Transformations",
            heading_style,
        )
    )

    migration_result = migration_run.migration_result or {}
    transformations = migration_result.get("transformations", [])

    if transformations:
        transformation_data = [
            ["Type", "Table", "Column", "Target / Action"]
        ]

        for transformation in transformations:
            transformation_data.append(
                [
                    str(transformation.get("type", "")),
                    str(transformation.get("table", "")),
                    str(transformation.get("column", "")),
                    str(
                        transformation.get("target")
                        or transformation.get("action")
                        or ""
                    ),
                ]
            )

        transformation_table = Table(
            transformation_data,
            colWidths=[35 * mm, 35 * mm, 40 * mm, 50 * mm],
            repeatRows=1,
        )

        transformation_table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                    ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                    ("FONTSIZE", (0, 0), (-1, -1), 8),
                    ("PADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )

        story.append(transformation_table)
    else:
        story.append(
            Paragraph(
                "No transformation records available.",
                body_style,
            )
        )

    # Warnings
    story.append(
        Paragraph(
            "Migration Warnings",
            heading_style,
        )
    )

    warnings = migration_result.get("warnings", [])

    if warnings:
        for warning in warnings:
            story.append(
                Paragraph(
                    f"• {warning}",
                    body_style,
                )
            )
    else:
        story.append(
            Paragraph(
                "No migration warnings reported.",
                body_style,
            )
        )

    # AI Review
    story.append(
        Paragraph(
            "AI Migration Review",
            heading_style,
        )
    )

    ai_review = migration_run.ai_review or {}

    story.append(
        Paragraph(
            str(ai_review.get("summary", "No AI review available.")),
            body_style,
        )
    )

    recommendations = ai_review.get("recommendations", [])

    if recommendations:
        story.append(
            Spacer(1, 5)
        )

        story.append(
            Paragraph(
                "<b>Recommendations</b>",
                body_style,
            )
        )

        for recommendation in recommendations:
            story.append(
                Paragraph(
                    f"• {recommendation}",
                    body_style,
                )
            )

    # Generated SQL
    story.append(
        Paragraph(
            "Generated PostgreSQL SQL",
            heading_style,
        )
    )

    generated_sql = migration_result.get(
        "sql",
        "-- No generated SQL available.",
    )

    story.append(
        Preformatted(
            generated_sql,
            styles["Code"],
        )
    )

    document.build(story)

    return buffer.getvalue()