def get_migration_rules(source_type: str) -> dict:
    """
    Return the migration rule for a MySQL data type.
    """

    mysql_type = source_type.upper().strip()

    rules = {

        # -----------------------------
        # Numeric Types
        # -----------------------------

        "TINYINT": {
            "target_type": "SMALLINT",
            "rules": "MYSQL_TINYINT_TO_POSTGRES_SMALLINT"
        },

        "SMALLINT": {
            "target_type": "SMALLINT",
            "rules": "MYSQL_SMALLINT_TO_POSTGRES_SMALLINT"
        },

        "MEDIUMINT": {
            "target_type": "INTEGER",
            "rules": "MYSQL_MEDIUMINT_TO_POSTGRES_INTEGER"
        },

        "INT": {
            "target_type": "INTEGER",
            "rules": "MYSQL_INT_TO_POSTGRES_INTEGER"
        },

        "INTEGER": {
            "target_type": "INTEGER",
            "rules": "MYSQL_INTEGER_TO_POSTGRES_INTEGER"
        },

        "BIGINT": {
            "target_type": "BIGINT",
            "rules": "MYSQL_BIGINT_TO_POSTGRES_BIGINT"
        },

        "DECIMAL": {
            "target_type": "DECIMAL",
            "rules": "MYSQL_DECIMAL_TO_POSTGRES_DECIMAL"
        },

        "NUMERIC": {
            "target_type": "NUMERIC",
            "rules": "MYSQL_NUMERIC_TO_POSTGRES_NUMERIC"
        },

        "FLOAT": {
            "target_type": "REAL",
            "rules": "MYSQL_FLOAT_TO_POSTGRES_REAL"
        },

        "DOUBLE": {
            "target_type": "DOUBLE PRECISION",
            "rules": "MYSQL_DOUBLE_TO_POSTGRES_DOUBLE_PRECISION"
        },

        "REAL": {
            "target_type": "DOUBLE PRECISION",
            "rules": "MYSQL_REAL_TO_POSTGRES_DOUBLE_PRECISION"
        },

        "BIT": {
            "target_type": "BIT",
            "rules": "MYSQL_BIT_TO_POSTGRES_BIT"
        },

        "BOOLEAN": {
            "target_type": "BOOLEAN",
            "rules": "MYSQL_BOOLEAN_TO_POSTGRES_BOOLEAN"
        },

        # -----------------------------
        # Character / Text Types
        # -----------------------------

        "CHAR": {
            "target_type": "CHAR",
            "rules": "MYSQL_CHAR_TO_POSTGRES_CHAR"
        },

        "VARCHAR": {
            "target_type": "VARCHAR",
            "rules": "MYSQL_VARCHAR_TO_POSTGRES_VARCHAR"
        },

        "TINYTEXT": {
            "target_type": "TEXT",
            "rules": "MYSQL_TINYTEXT_TO_POSTGRES_TEXT"
        },

        "TEXT": {
            "target_type": "TEXT",
            "rules": "MYSQL_TEXT_TO_POSTGRES_TEXT"
        },

        "MEDIUMTEXT": {
            "target_type": "TEXT",
            "rules": "MYSQL_MEDIUMTEXT_TO_POSTGRES_TEXT"
        },

        "LONGTEXT": {
            "target_type": "TEXT",
            "rules": "MYSQL_LONGTEXT_TO_POSTGRES_TEXT"
        },

        # -----------------------------
        # Date / Time Types
        # -----------------------------

        "DATE": {
            "target_type": "DATE",
            "rules": "MYSQL_DATE_TO_POSTGRES_DATE"
        },

        "DATETIME": {
            "target_type": "TIMESTAMP",
            "rules": "MYSQL_DATETIME_TO_POSTGRES_TIMESTAMP"
        },

        "TIMESTAMP": {
            "target_type": "TIMESTAMP",
            "rules": "MYSQL_TIMESTAMP_TO_POSTGRES_TIMESTAMP"
        },

        "TIME": {
            "target_type": "TIME",
            "rules": "MYSQL_TIME_TO_POSTGRES_TIME"
        },

        "YEAR": {
            "target_type": "INTEGER",
            "rules": "MYSQL_YEAR_TO_POSTGRES_INTEGER"
        },

        # -----------------------------
        # Binary Types
        # -----------------------------

        "BINARY": {
            "target_type": "BYTEA",
            "rules": "MYSQL_BINARY_TO_POSTGRES_BYTEA"
        },

        "VARBINARY": {
            "target_type": "BYTEA",
            "rules": "MYSQL_VARBINARY_TO_POSTGRES_BYTEA"
        },

        "BLOB": {
            "target_type": "BYTEA",
            "rules": "MYSQL_BLOB_TO_POSTGRES_BYTEA"
        },

        "TINYBLOB": {
            "target_type": "BYTEA",
            "rules": "MYSQL_TINYBLOB_TO_POSTGRES_BYTEA"
        },

        "MEDIUMBLOB": {
            "target_type": "BYTEA",
            "rules": "MYSQL_MEDIUMBLOB_TO_POSTGRES_BYTEA"
        },

        "LONGBLOB": {
            "target_type": "BYTEA",
            "rules": "MYSQL_LONGBLOB_TO_POSTGRES_BYTEA"
        },

        # -----------------------------
        # JSON
        # -----------------------------

        "JSON": {
            "target_type": "JSONB",
            "rules": "MYSQL_JSON_TO_POSTGRES_JSONB"
        },

        # -----------------------------
        # Special Types
        # -----------------------------

        "ENUM": {
            "target_type": "VARCHAR",
            "rules": "MYSQL_ENUM_TO_POSTGRES_VARCHAR"
        },

        "SET": {
            "target_type": "TEXT",
            "rules": "MYSQL_SET_TO_POSTGRES_TEXT"
        }
    }

    return rules.get(
        mysql_type,
        {
            "target_type": None,
            "rules": "UNSUPPORTED_TYPE"
        }
    )