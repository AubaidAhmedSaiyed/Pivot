from typing import List


from typing import List


def build_schema(
    table_count: int,
    columns_per_table: int,
    foreign_keys: int = 0,
    indexes: int = 0,
    triggers: int = 0,
    unsupported: bool = False,
    unsigned: int = 0,
    auto_increment: int = 0,
    defaults: int = 0,
    checks: int = 0,
    uniques: int = 0,
) -> str:
    statements: List[str] = []

    # Track remaining requested features
    unsigned_remaining = unsigned
    auto_increment_remaining = auto_increment
    defaults_remaining = defaults
    checks_remaining = checks
    uniques_remaining = uniques

    # --------------------------------
    # CREATE TABLE statements
    # --------------------------------
    for table_index in range(1, table_count + 1):

        table_name = f"table_{table_index}"

        columns = [
            "id INT PRIMARY KEY"
        ]

        for column_index in range(
            2,
            columns_per_table + 1
        ):

            column_name = f"column_{column_index}"

            # --------------------------------
            # Base datatype
            # --------------------------------
            if column_index % 3 == 0:
                column_type = "VARCHAR(100)"

            elif column_index % 3 == 1:
                column_type = "DECIMAL(10,2)"

            else:
                column_type = "DATETIME"

            # --------------------------------
            # Feature allocation
            # --------------------------------
            needs_integer = False
            needs_auto_increment = False
            needs_unsigned = False

            # AUTO_INCREMENT
            if auto_increment_remaining > 0:
                needs_integer = True
                needs_auto_increment = True
                auto_increment_remaining -= 1

            # UNSIGNED
            if unsigned_remaining > 0:
                needs_integer = True
                needs_unsigned = True
                unsigned_remaining -= 1

            # --------------------------------
            # Build numeric datatype
            # --------------------------------
            if needs_integer:
                column_type = "INT"

            if needs_unsigned:
                column_type += " UNSIGNED"

            if needs_auto_increment:
                column_type += " AUTO_INCREMENT"

            column = f"{column_name} {column_type}"

            # --------------------------------
            # DEFAULT
            # --------------------------------
            if defaults_remaining > 0:

                if "VARCHAR" in column_type:
                    column += " DEFAULT 'active'"

                elif "DATETIME" in column_type:
                    column += " DEFAULT CURRENT_TIMESTAMP"

                else:
                    column += " DEFAULT 0"

                defaults_remaining -= 1

            columns.append(column)

        # --------------------------------
        # CHECK constraints
        # --------------------------------
        if checks_remaining > 0:

            columns.append(
                f"CONSTRAINT chk_{table_name} "
                f"CHECK (column_2 IS NOT NULL)"
            )

            checks_remaining -= 1

        # --------------------------------
        # UNIQUE constraints
        # --------------------------------
        if uniques_remaining > 0:

            columns.append(
                "UNIQUE (column_2)"
            )

            uniques_remaining -= 1

        # --------------------------------
        # Build CREATE TABLE
        # --------------------------------
        statements.append(
            f"CREATE TABLE {table_name} (\n"
            + ",\n".join(
                f"    {column}"
                for column in columns
            )
            + "\n);"
        )

    # --------------------------------
    # FOREIGN KEYS
    # --------------------------------
    for index in range(
        1,
        foreign_keys + 1
    ):

        source_table = (
            f"table_{(index % table_count) + 1}"
        )

        target_table = (
            f"table_{((index - 1) % table_count) + 1}"
        )

        statements.append(
            f"ALTER TABLE {source_table} "
            f"ADD CONSTRAINT fk_{index} "
            f"FOREIGN KEY (column_2) "
            f"REFERENCES {target_table}(id);"
        )

    # --------------------------------
    # INDEXES
    # --------------------------------
    for index in range(
        1,
        indexes + 1
    ):

        table_name = (
            f"table_{((index - 1) % table_count) + 1}"
        )

        statements.append(
            f"CREATE INDEX idx_{index} "
            f"ON {table_name}(column_2);"
        )

    # --------------------------------
    # TRIGGERS
    # --------------------------------
    for index in range(
        1,
        triggers + 1
    ):

        table_name = (
            f"table_{((index - 1) % table_count) + 1}"
        )

        statements.append(
            f"""
CREATE TRIGGER trigger_{index}
BEFORE INSERT ON {table_name}
FOR EACH ROW
SET NEW.column_2 = NEW.column_2;
""".strip()
        )

    # --------------------------------
    # UNSUPPORTED FEATURE
    # --------------------------------
    if unsupported:

        statements.append(
            f"CREATE FULLTEXT INDEX "
            f"idx_fulltext_{table_count} "
            f"ON table_1(column_2);"
        )

    return "\n\n".join(statements)

import pandas as pd

from ml.feature_extractor import extract_features
from services.schema_parser import parse_schema


SCENARIOS = [
    # --------------------------------
    # LOW complexity scenarios
    # --------------------------------
    {
        "label": "LOW",
        "table_count": 1,
        "columns_per_table": 3,
    },
    {
        "label": "LOW",
        "table_count": 1,
        "columns_per_table": 5,
    },
    {
        "label": "LOW",
        "table_count": 2,
        "columns_per_table": 4,
        "foreign_keys": 1,
    },
    {
        "label": "LOW",
        "table_count": 2,
        "columns_per_table": 5,
        "indexes": 1,
    },
    {
        "label": "LOW",
        "table_count": 2,
        "columns_per_table": 5,
        "foreign_keys": 1,
        "uniques": 1,
    },

    # --------------------------------
    # MEDIUM complexity scenarios
    # --------------------------------
    {
        "label": "MEDIUM",
        "table_count": 2,
        "columns_per_table": 5,
        "foreign_keys": 2,
        "indexes": 2,
    },
    {
        "label": "MEDIUM",
        "table_count": 3,
        "columns_per_table": 5,
        "foreign_keys": 2,
        "checks": 1,
    },
    {
        "label": "MEDIUM",
        "table_count": 3,
        "columns_per_table": 6,
        "foreign_keys": 2,
        "indexes": 2,
        "uniques": 1,
    },
    {
        "label": "MEDIUM",
        "table_count": 2,
        "columns_per_table": 5,
        "unsigned": 2,
        "defaults": 2,
    },
    {
        "label": "MEDIUM",
        "table_count": 2,
        "columns_per_table": 5,
        "auto_increment": 1,
        "defaults": 2,
        "indexes": 2,
    },
    {
        "label": "MEDIUM",
        "table_count": 3,
        "columns_per_table": 5,
        "triggers": 1,
        "checks": 1,
        "uniques": 1,
    },

    # --------------------------------
    # HIGH complexity scenarios
    # --------------------------------
    {
        "label": "HIGH",
        "table_count": 4,
        "columns_per_table": 7,
        "foreign_keys": 4,
        "indexes": 4,
        "checks": 2,
        "uniques": 2,
    },
    {
        "label": "HIGH",
        "table_count": 4,
        "columns_per_table": 7,
        "foreign_keys": 3,
        "indexes": 3,
        "triggers": 2,
        "unsigned": 3,
        "defaults": 4,
    },
    {
        "label": "HIGH",
        "table_count": 5,
        "columns_per_table": 8,
        "foreign_keys": 4,
        "indexes": 5,
        "triggers": 2,
        "checks": 2,
        "uniques": 2,
        "unsigned": 4,
        "defaults": 5,
    },
    {
        "label": "HIGH",
        "table_count": 3,
        "columns_per_table": 7,
        "foreign_keys": 3,
        "indexes": 3,
        "triggers": 1,
        "unsupported": True,
        "unsigned": 3,
        "defaults": 3,
    },
        # --------------------------------
    # Additional LOW scenarios
    # --------------------------------
    {
        "label": "LOW",
        "table_count": 1,
        "columns_per_table": 4,
        "auto_increment": 1,
    },
    {
        "label": "LOW",
        "table_count": 1,
        "columns_per_table": 5,
        "defaults": 2,
    },
    {
        "label": "LOW",
        "table_count": 2,
        "columns_per_table": 4,
        "indexes": 1,
        "defaults": 1,
    },
    {
        "label": "LOW",
        "table_count": 2,
        "columns_per_table": 4,
        "foreign_keys": 1,
        "auto_increment": 1,
    },
    {
        "label": "LOW",
        "table_count": 2,
        "columns_per_table": 5,
        "uniques": 1,
        "defaults": 2,
    },

    # --------------------------------
    # Additional MEDIUM scenarios
    # --------------------------------
    {
        "label": "MEDIUM",
        "table_count": 2,
        "columns_per_table": 6,
        "foreign_keys": 1,
        "indexes": 2,
        "defaults": 2,
        "auto_increment": 1,
    },
    {
        "label": "MEDIUM",
        "table_count": 3,
        "columns_per_table": 5,
        "foreign_keys": 2,
        "unsigned": 2,
        "defaults": 2,
    },
    {
        "label": "MEDIUM",
        "table_count": 3,
        "columns_per_table": 6,
        "indexes": 2,
        "checks": 1,
        "uniques": 1,
    },
    {
        "label": "MEDIUM",
        "table_count": 3,
        "columns_per_table": 5,
        "foreign_keys": 2,
        "auto_increment": 2,
        "defaults": 3,
    },
    {
        "label": "MEDIUM",
        "table_count": 3,
        "columns_per_table": 6,
        "foreign_keys": 2,
        "indexes": 2,
        "unsigned": 2,
        "checks": 1,
    },

    # --------------------------------
    # Additional HIGH scenarios
    # --------------------------------
    {
        "label": "HIGH",
        "table_count": 4,
        "columns_per_table": 8,
        "foreign_keys": 4,
        "indexes": 4,
        "triggers": 1,
        "unsigned": 3,
        "defaults": 4,
        "checks": 2,
        "uniques": 2,
    },
    {
        "label": "HIGH",
        "table_count": 5,
        "columns_per_table": 7,
        "foreign_keys": 4,
        "indexes": 5,
        "triggers": 2,
        "unsigned": 4,
        "defaults": 5,
    },
    {
        "label": "HIGH",
        "table_count": 5,
        "columns_per_table": 8,
        "foreign_keys": 5,
        "indexes": 5,
        "triggers": 2,
        "checks": 2,
        "uniques": 2,
    },
    {
        "label": "HIGH",
        "table_count": 4,
        "columns_per_table": 7,
        "foreign_keys": 3,
        "indexes": 4,
        "triggers": 1,
        "unsupported": True,
        "unsigned": 4,
        "defaults": 4,
        "checks": 1,
    },
    {
        "label": "HIGH",
        "table_count": 6,
        "columns_per_table": 8,
        "foreign_keys": 5,
        "indexes": 6,
        "triggers": 2,
        "unsupported": True,
        "unsigned": 5,
        "defaults": 6,
        "checks": 2,
        "uniques": 2,
    },
]


def generate_synthetic_dataset() -> pd.DataFrame:
    rows = []

    for scenario in SCENARIOS:

        scenario_config = {
            key: value
            for key, value in scenario.items()
            if key != "label"
        }

        sql = build_schema(
            **scenario_config
        )

        schema = parse_schema(sql)

        features = extract_features(
            schema
        )

        features["complexity"] = scenario["label"]

        rows.append(features)

    return pd.DataFrame(rows)

def get_combined_dataset() -> pd.DataFrame:
    from ml.schema_samples import SCHEMAS

    synthetic_df = generate_synthetic_dataset()

    original_rows = []

    for sample in SCHEMAS:
        schema = parse_schema(sample["sql"])
        features = extract_features(schema)
        features["complexity"] = sample["complexity"]
        original_rows.append(features)

    original_df = pd.DataFrame(original_rows)

    combined_df = pd.concat(
        [
            original_df,
            synthetic_df
        ],
        ignore_index=True
    )

    return combined_df

def get_combined_dataset() -> pd.DataFrame:
    from ml.schema_samples import SCHEMA_SAMPLES

    synthetic_df = generate_synthetic_dataset()

    original_rows = []

    for sample in SCHEMA_SAMPLES:
        schema = parse_schema(sample["sql"])

        features = extract_features(schema)

        features["complexity"] = sample["complexity"]

        original_rows.append(features)

    original_df = pd.DataFrame(
        original_rows
    )

    combined_df = pd.concat(
        [
            original_df,
            synthetic_df
        ],
        ignore_index=True
    )

    return combined_df
