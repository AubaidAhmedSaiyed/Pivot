from services.type_mapper import map_data_type


test_types = [
    "INT",
    "TINYINT(1)",
    "BIGINT",
    "MEDIUMINT",
    "FLOAT",
    "DOUBLE",
    "DECIMAL(10,2)",
    "VARCHAR(255)",
    "CHAR(20)",
    "TEXT",
    "LONGTEXT",
    "BLOB",
    "DATE",
    "DATETIME",
    "TIMESTAMP",
    "TIME",
    "YEAR",
    "JSON",
    "ENUM('A','B')",
    "SET('A','B')",
    "BIT(8)",
    "INT UNSIGNED"
]


for mysql_type in test_types:
    try:
        postgres_type = map_data_type(mysql_type)
        print(f"{mysql_type:<25} -> {postgres_type}")
    except ValueError as e:
        print(f"{mysql_type:<25} -> ERROR: {e}")