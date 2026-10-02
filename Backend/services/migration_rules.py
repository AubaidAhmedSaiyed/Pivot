import re


def _normalize_type(source_type: str) -> tuple[str, str]:
    """
    Normalize a MySQL datatype for rule lookup.

    Examples:
        VARCHAR(255)  -> ("VARCHAR", "(255)")
        DECIMAL(10,2) -> ("DECIMAL", "(10,2)")
        TINYINT(1)    -> ("TINYINT", "(1)")
        INT           -> ("INT", "")
    """

    if not source_type:
        raise ValueError("MySQL datatype cannot be empty")

    mysql_type = source_type.strip().upper()

    # Remove MySQL attributes that are not part of the datatype name.
    mysql_type = re.sub(r"\s+UNSIGNED\b", "", mysql_type)
    mysql_type = re.sub(r"\s+ZEROFILL\b", "", mysql_type)
    mysql_type = mysql_type.strip()

    match = re.match(r"^([A-Z]+)\s*(\([^)]*\))?$", mysql_type)

    if not match:
        raise ValueError(f"Invalid MySQL datatype: {source_type}")

    data_type = match.group(1)
    parameters = match.group(2) or ""

    return data_type, parameters


def get_migration_rules(source_type: str) -> dict:
    """
    Return the migration rule for a MySQL data type.

    The lookup supports parameterized MySQL types such as:
        VARCHAR(255)
        DECIMAL(10,2)
        TINYINT(1)

    The returned target type follows the same mapping
    used by type_mapper.py.
    """

    data_type, parameters = _normalize_type(source_type)

    # ---------------------------------------------------------
    # Special case: TINYINT(1) -> BOOLEAN
    # ---------------------------------------------------------

    if data_type == "TINYINT" and parameters == "(1)":
        return {
            "source_type": source_type,
            "target_type": "BOOLEAN",
            "rules": "MYSQL_TINYINT_1_TO_POSTGRES_BOOLEAN",
        }

    # ---------------------------------------------------------
    # MySQL datatype migration rules
    # ---------------------------------------------------------

    rules = {
        # Numeric
        "TINYINT": {
            "target_type": "SMALLINT",
            "rules": "MYSQL_TINYINT_TO_POSTGRES_SMALLINT",
        },
        "SMALLINT": {
            "target_type": "SMALLINT",
            "rules": "MYSQL_SMALLINT_TO_POSTGRES_SMALLINT",
        },
        "MEDIUMINT": {
            "target_type": "INTEGER",
            "rules": "MYSQL_MEDIUMINT_TO_POSTGRES_INTEGER",
        },
        "INT": {
            "target_type": "INTEGER",
            "rules": "MYSQL_INT_TO_POSTGRES_INTEGER",
        },
        "INTEGER": {
            "target_type": "INTEGER",
            "rules": "MYSQL_INTEGER_TO_POSTGRES_INTEGER",
        },
        "UINT": {
            "target_type": "INTEGER",
            "rules": "MYSQL_UNSIGNED_INT_TO_POSTGRES_INTEGER",
        },
        "BIGINT": {
            "target_type": "BIGINT",
            "rules": "MYSQL_BIGINT_TO_POSTGRES_BIGINT",
        },
        "DECIMAL": {
            "target_type": "NUMERIC",
            "rules": "MYSQL_DECIMAL_TO_POSTGRES_NUMERIC",
        },
        "NUMERIC": {
            "target_type": "NUMERIC",
            "rules": "MYSQL_NUMERIC_TO_POSTGRES_NUMERIC",
        },
        "FLOAT": {
            "target_type": "REAL",
            "rules": "MYSQL_FLOAT_TO_POSTGRES_REAL",
        },
        "DOUBLE": {
            "target_type": "DOUBLE PRECISION",
            "rules": "MYSQL_DOUBLE_TO_POSTGRES_DOUBLE_PRECISION",
        },
        "REAL": {
            "target_type": "DOUBLE PRECISION",
            "rules": "MYSQL_REAL_TO_POSTGRES_DOUBLE_PRECISION",
        },
        "BIT": {
            "target_type": "BIT",
            "rules": "MYSQL_BIT_TO_POSTGRES_BIT",
        },
        "BOOL": {
            "target_type": "BOOLEAN",
            "rules": "MYSQL_BOOL_TO_POSTGRES_BOOLEAN",
        },
        "BOOLEAN": {
            "target_type": "BOOLEAN",
            "rules": "MYSQL_BOOLEAN_TO_POSTGRES_BOOLEAN",
        },

        # Character / text
        "CHAR": {
            "target_type": "CHAR",
            "rules": "MYSQL_CHAR_TO_POSTGRES_CHAR",
        },
        "NCHAR": {
            "target_type": "CHAR",
            "rules": "MYSQL_NCHAR_TO_POSTGRES_CHAR",
        },
        "VARCHAR": {
            "target_type": "VARCHAR",
            "rules": "MYSQL_VARCHAR_TO_POSTGRES_VARCHAR",
        },
        "NVARCHAR": {
            "target_type": "VARCHAR",
            "rules": "MYSQL_NVARCHAR_TO_POSTGRES_VARCHAR",
        },
        "TINYTEXT": {
            "target_type": "TEXT",
            "rules": "MYSQL_TINYTEXT_TO_POSTGRES_TEXT",
        },
        "TEXT": {
            "target_type": "TEXT",
            "rules": "MYSQL_TEXT_TO_POSTGRES_TEXT",
        },
        "MEDIUMTEXT": {
            "target_type": "TEXT",
            "rules": "MYSQL_MEDIUMTEXT_TO_POSTGRES_TEXT",
        },
        "LONGTEXT": {
            "target_type": "TEXT",
            "rules": "MYSQL_LONGTEXT_TO_POSTGRES_TEXT",
        },

        # Binary
        "BINARY": {
            "target_type": "BYTEA",
            "rules": "MYSQL_BINARY_TO_POSTGRES_BYTEA",
        },
        "VARBINARY": {
            "target_type": "BYTEA",
            "rules": "MYSQL_VARBINARY_TO_POSTGRES_BYTEA",
        },
        "TINYBLOB": {
            "target_type": "BYTEA",
            "rules": "MYSQL_TINYBLOB_TO_POSTGRES_BYTEA",
        },
        "BLOB": {
            "target_type": "BYTEA",
            "rules": "MYSQL_BLOB_TO_POSTGRES_BYTEA",
        },
        "MEDIUMBLOB": {
            "target_type": "BYTEA",
            "rules": "MYSQL_MEDIUMBLOB_TO_POSTGRES_BYTEA",
        },
        "LONGBLOB": {
            "target_type": "BYTEA",
            "rules": "MYSQL_LONGBLOB_TO_POSTGRES_BYTEA",
        },

        # Date / time
        "DATE": {
            "target_type": "DATE",
            "rules": "MYSQL_DATE_TO_POSTGRES_DATE",
        },
        "DATETIME": {
            "target_type": "TIMESTAMP",
            "rules": "MYSQL_DATETIME_TO_POSTGRES_TIMESTAMP",
        },
        "TIMESTAMP": {
            "target_type": "TIMESTAMP",
            "rules": "MYSQL_TIMESTAMP_TO_POSTGRES_TIMESTAMP",
        },
        "TIME": {
            "target_type": "TIME",
            "rules": "MYSQL_TIME_TO_POSTGRES_TIME",
        },
        "YEAR": {
            "target_type": "SMALLINT",
            "rules": "MYSQL_YEAR_TO_POSTGRES_SMALLINT",
        },

        # JSON
        "JSON": {
            "target_type": "JSONB",
            "rules": "MYSQL_JSON_TO_POSTGRES_JSONB",
        },

        # Special
        "ENUM": {
            "target_type": "TEXT",
            "rules": "MYSQL_ENUM_TO_POSTGRES_TEXT",
        },
        "SET": {
            "target_type": "TEXT",
            "rules": "MYSQL_SET_TO_POSTGRES_TEXT",
        },
    }

    rule = rules.get(data_type)

    if rule is None:
        return {
            "source_type": source_type,
            "target_type": None,
            "rules": "UNSUPPORTED_TYPE",
        }

    return {
        "source_type": source_type,
        "target_type": (
            f"{rule['target_type']}{parameters}"
            if parameters and data_type in {
                "CHAR",
                "NCHAR",
                "VARCHAR",
                "NVARCHAR",
                "DECIMAL",
                "NUMERIC",
                "BIT",
            }
            else rule["target_type"]
        ),
        "rules": rule["rules"],
    }