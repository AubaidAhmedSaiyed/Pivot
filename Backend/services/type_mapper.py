import re


def map_data_type(mysql_type):
    """
    Convert MySQL data types to PostgreSQL data types.
    Handles parameters such as VARCHAR(255) and DECIMAL(10,2).
    """

    if not mysql_type:
        raise ValueError("MySQL datatype cannot be empty")

    original_type = mysql_type.strip()
    mysql_type = original_type.upper().strip()

    # ---------------------------------------------------------
    # Remove MySQL attributes such as UNSIGNED and ZEROFILL
    # ---------------------------------------------------------
    unsigned = "UNSIGNED" in mysql_type

    mysql_type = re.sub(r"\s+UNSIGNED\b", "", mysql_type)
    mysql_type = re.sub(r"\s+ZEROFILL\b", "", mysql_type)
    mysql_type = mysql_type.strip()

    # ---------------------------------------------------------
    # Extract datatype name and parameters
    # Example:
    # VARCHAR(255) -> VARCHAR + (255)
    # DECIMAL(10,2) -> DECIMAL + (10,2)
    # ---------------------------------------------------------
    match = re.match(r"^([A-Z]+)\s*(\(.*\))?$", mysql_type)

    if not match:
        raise ValueError(f"Invalid MySQL datatype: {original_type}")

    data_type = match.group(1)
    parameters = match.group(2) or ""

    # ---------------------------------------------------------
    # Integer types
    # ---------------------------------------------------------
    integer_mapping = {
        "TINYINT": "SMALLINT",
        "SMALLINT": "SMALLINT",
        "MEDIUMINT": "INTEGER",
        "INT": "INTEGER",
        "INTEGER": "INTEGER",
        "BIGINT": "BIGINT",
        "UINT": "INTEGER",
        "UBIGINT": "BIGINT",
    }

    if data_type in integer_mapping:
        # MySQL TINYINT(1) is commonly used as BOOLEAN
        if data_type == "TINYINT":
            if parameters == "(1)":
                return "BOOLEAN"

        return integer_mapping[data_type]

    # ---------------------------------------------------------
    # Exact MySQL aliases
    # ---------------------------------------------------------
    if data_type == "BOOL" or data_type == "BOOLEAN":
        return "BOOLEAN"

    # ---------------------------------------------------------
    # Floating point types
    # ---------------------------------------------------------
    if data_type == "FLOAT":
        return "REAL"

    if data_type == "DOUBLE":
        return "DOUBLE PRECISION"

    if data_type == "REAL":
        return "DOUBLE PRECISION"

    # ---------------------------------------------------------
    # Fixed precision numbers
    # ---------------------------------------------------------
    if data_type in ("DECIMAL", "NUMERIC" , "UDECIMAL"):
        return f"NUMERIC{parameters}"

    # ---------------------------------------------------------
    # Character / string types
    # ---------------------------------------------------------
    if data_type in ("CHAR", "NCHAR"):
        return f"CHAR{parameters}"

    if data_type in ("VARCHAR", "NVARCHAR"):
        return f"VARCHAR{parameters}"

    if data_type in ("TINYTEXT", "TEXT", "MEDIUMTEXT", "LONGTEXT"):
        return "TEXT"

    # ---------------------------------------------------------
    # Binary types
    # ---------------------------------------------------------
    if data_type in ("BINARY", "VARBINARY"):
        return "BYTEA"

    if data_type in (
        "TINYBLOB",
        "BLOB",
        "MEDIUMBLOB",
        "LONGBLOB",
    ):
        return "BYTEA"

    # ---------------------------------------------------------
    # Date and time
    # ---------------------------------------------------------
    if data_type == "DATE":
        return "DATE"

    if data_type == "DATETIME":
        return "TIMESTAMP"

    if data_type == "TIMESTAMP":
        return "TIMESTAMP"

    if data_type == "TIMESTAMPTZ":
      return "TIMESTAMPTZ"

    if data_type == "TIME":
        return "TIME"

    if data_type == "YEAR":
        return "SMALLINT"

    # ---------------------------------------------------------
    # JSON
    # ---------------------------------------------------------
    if data_type == "JSON":
        return "JSONB"

    # ---------------------------------------------------------
    # ENUM
    # PostgreSQL has ENUM, but creating it requires additional
    # schema-level handling. TEXT is safer for this mapper.
    # ---------------------------------------------------------
    if data_type == "ENUM":
        return "TEXT"

    # ---------------------------------------------------------
    # SET
    # PostgreSQL has no direct equivalent to MySQL SET.
    # TEXT is used as a general-purpose representation.
    # ---------------------------------------------------------
    if data_type == "SET":
        return "TEXT"

    # ---------------------------------------------------------
    # BIT
    # ---------------------------------------------------------
    if data_type == "BIT":
        return f"BIT{parameters}"

    # ---------------------------------------------------------
    # Spatial types
    # PostgreSQL requires PostGIS for equivalent spatial types.
    # We represent them as TEXT unless PostGIS support is added.
    # ---------------------------------------------------------
    spatial_types = {
        "GEOMETRY",
        "POINT",
        "LINESTRING",
        "POLYGON",
        "MULTIPOINT",
        "MULTILINESTRING",
        "MULTIPOLYGON",
        "GEOMETRYCOLLECTION",
    }

    if data_type in spatial_types:
        return "TEXT"

    # ---------------------------------------------------------
    # Unknown datatype
    # ---------------------------------------------------------
    raise ValueError(
        f"Unsupported MySQL datatype: {original_type}"
    )