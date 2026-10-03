def diff_schemas(source_schema: dict, target_schema: dict) -> dict:
    changes = []

    source_tables = {table["name"]: table for table in source_schema.get("tables", [])}

    target_tables = {table["name"]: table for table in target_schema.get("tables", [])}

    added_tables = 0
    removed_tables = 0
    added_columns = 0
    removed_columns = 0
    changed_columns = 0
    changed_primary_keys = 0
    added_primary_keys = 0
    removed_primary_keys = 0
    changed_foreign_keys = 0
    changed_unique_constraints = 0
    added_unique_constraints = 0
    removed_unique_constraints = 0
    changed_checks = 0
    added_checks = 0
    removed_checks = 0
    changed_indexes = 0
    added_indexes = 0
    removed_indexes = 0
    added_foreign_keys = 0
    removed_foreign_keys = 0

    # Detect added tables
    for table_name in target_tables.keys() - source_tables.keys():
        changes.append(
            {
                "type": "ADDED_TABLE",
                "table": table_name,
            }
        )
        added_tables += 1

    # Detect removed tables
    for table_name in source_tables.keys() - target_tables.keys():
        changes.append(
            {
                "type": "REMOVED_TABLE",
                "table": table_name,
            }
        )
        removed_tables += 1

    # Compare tables existing in both schemas
    for table_name in source_tables.keys() & target_tables.keys():
        source_table = source_tables[table_name]
        target_table = target_tables[table_name]

        # ---------------------------------------------------------
        # Columns
        # ---------------------------------------------------------

        source_columns = {
            column["name"]: column for column in source_table.get("columns", [])
        }

        target_columns = {
            column["name"]: column for column in target_table.get("columns", [])
        }

        # Added columns
        for column_name in target_columns.keys() - source_columns.keys():
            changes.append(
                {
                    "type": "ADDED_COLUMN",
                    "table": table_name,
                    "column": column_name,
                }
            )
            added_columns += 1

        # Removed columns
        for column_name in source_columns.keys() - target_columns.keys():
            changes.append(
                {
                    "type": "REMOVED_COLUMN",
                    "table": table_name,
                    "column": column_name,
                }
            )
            removed_columns += 1

        # Changed column types
        for column_name in source_columns.keys() & target_columns.keys():
            source_column = source_columns[column_name]
            target_column = target_columns[column_name]

            source_type = source_column.get(
                "data_type",
                source_column.get("type"),
            )
            target_type = target_column.get(
                "data_type",
                target_column.get("type"),    
            )

            if source_type != target_type:
                changes.append(
                    {
                        "type": "COLUMN_TYPE_CHANGED",
                        "table": table_name,
                        "column": column_name,
                        "source_type": source_type,
                        "target_type": target_type,
                    }
                )
                changed_columns += 1

        # ---------------------------------------------------------
        # Primary Key
        # ---------------------------------------------------------

        source_primary_key = source_table.get(
           "primary_keys",
            source_table.get("primary_key", []),
        ) 

        target_primary_key = target_table.get(
          "primary_keys",
           target_table.get("primary_key", []),
        )

        # Added primary key
        if not source_primary_key and target_primary_key:
            changes.append(
                {
                    "type": "PRIMARY_KEY_ADDED",
                    "table": table_name,
                    "columns": target_primary_key,
                }
            )
            added_primary_keys += 1

        # Removed primary key
        elif source_primary_key and not target_primary_key:
            changes.append(
                {
                    "type": "PRIMARY_KEY_REMOVED",
                    "table": table_name,
                    "columns": source_primary_key,
                }
            )
            removed_primary_keys += 1

        # Changed primary key
        elif (
            source_primary_key
            and target_primary_key
            and source_primary_key != target_primary_key
        ):
            changes.append(
                {
                    "type": "PRIMARY_KEY_CHANGED",
                    "table": table_name,
                    "source_columns": source_primary_key,
                    "target_columns": target_primary_key,
                }
            )
            changed_primary_keys += 1

        # ---------------------------------------------------------
        # Foreign Keys
        # ---------------------------------------------------------

        source_foreign_keys = source_table.get("foreign_keys", [])
        target_foreign_keys = target_table.get("foreign_keys", [])

        source_fk_set = {
            (
                tuple(foreign_key.get("columns", [])),
                foreign_key.get("referenced_table"),
                tuple(foreign_key.get("referenced_columns", [])),
            )
            for foreign_key in source_foreign_keys
        }

        target_fk_set = {
            (
                tuple(foreign_key.get("columns", [])),
                foreign_key.get("referenced_table"),
                tuple(foreign_key.get("referenced_columns", [])),
            )
            for foreign_key in target_foreign_keys
        }

        # Added foreign keys
        for foreign_key in target_foreign_keys:
            key = (
                tuple(foreign_key.get("columns", [])),
                foreign_key.get("referenced_table"),
                tuple(foreign_key.get("referenced_columns", [])),
            )

            if key not in source_fk_set:
                changes.append(
                    {
                        "type": "FOREIGN_KEY_ADDED",
                        "table": table_name,
                        "foreign_key": foreign_key,
                    }
                )
                added_foreign_keys += 1

        # Removed foreign keys
        for foreign_key in source_foreign_keys:
            key = (
                tuple(foreign_key.get("columns", [])),
                foreign_key.get("referenced_table"),
                tuple(foreign_key.get("referenced_columns", [])),
            )

            if key not in target_fk_set:
                changes.append(
                    {
                        "type": "FOREIGN_KEY_REMOVED",
                        "table": table_name,
                        "foreign_key": foreign_key,
                    }
                )
                removed_foreign_keys += 1

        # Changed foreign keys
        if (
            source_foreign_keys
            and target_foreign_keys
            and source_fk_set != target_fk_set
        ):
            changes.append(
                {
                    "type": "FOREIGN_KEY_CHANGED",
                    "table": table_name,
                    "source": source_foreign_keys[0],
                    "target": target_foreign_keys[0],
                }
            )
            changed_foreign_keys += 1

        # ---------------------------------------------------------
        # UNIQUE Constraints
        # ---------------------------------------------------------

        source_unique_constraints = source_table.get(
            "unique_constraints",
            [],
        )

        target_unique_constraints = target_table.get(
            "unique_constraints",
            [],
        )

        source_unique_set = {
            tuple(constraint)
            for constraint in source_unique_constraints
        }

        target_unique_set = {
            tuple(constraint)
            for constraint in target_unique_constraints
        }

        # Added unique constraints
        for constraint in target_unique_constraints:
            constraint_key = tuple(constraint)

            if constraint_key not in source_unique_set:
                changes.append(
                    {
                        "type": "UNIQUE_CONSTRAINT_ADDED",
                        "table": table_name,
                        "constraint": constraint,
                    }
                )
                added_unique_constraints += 1

        # Removed unique constraints
        for constraint in source_unique_constraints:
            constraint_key = tuple(constraint)

            if constraint_key not in target_unique_set:
                changes.append(
                    {
                        "type": "UNIQUE_CONSTRAINT_REMOVED",
                        "table": table_name,
                        "constraint": constraint,
                    }
                )
                removed_unique_constraints += 1

        # Changed unique constraints
        if (
            source_unique_set
            and target_unique_set
            and source_unique_set != target_unique_set
        ):
            changes.append(
                {
                    "type": "UNIQUE_CONSTRAINT_CHANGED",
                    "table": table_name,
                    "source": source_unique_constraints,
                    "target": target_unique_constraints,
                }
            )
            changed_unique_constraints += 1

        # ---------------------------------------------------------
        # CHECK Constraints
        # ---------------------------------------------------------

        source_checks = source_table.get("checks", [])
        target_checks = target_table.get("checks", [])

        source_check_set = set(source_checks)
        target_check_set = set(target_checks)

        # Added checks
        for check in target_checks:
            if check not in source_check_set:
                changes.append(
                    {
                        "type": "CHECK_ADDED",
                        "table": table_name,
                        "check": check,
                    }
                )
                added_checks += 1

        # Removed checks
        for check in source_checks:
            if check not in target_check_set:
                changes.append(
                    {
                        "type": "CHECK_REMOVED",
                        "table": table_name,
                        "check": check,
                    }
                )
                removed_checks += 1

        # Changed checks
        if (
            source_check_set
            and target_check_set
            and source_check_set != target_check_set
        ):
            changes.append(
                {
                    "type": "CHECK_CONSTRAINT_CHANGED",
                    "table": table_name,
                    "source": source_checks,
                    "target": target_checks,
                }
            )
            changed_checks += 1

        # ---------------------------------------------------------
        # Indexes
        # ---------------------------------------------------------

        source_indexes = source_table.get("indexes", [])
        target_indexes = target_table.get("indexes", [])

        source_indexes_by_name = {index["name"]: index for index in source_indexes}

        target_indexes_by_name = {index["name"]: index for index in target_indexes}

        # Added indexes
        for index_name in target_indexes_by_name.keys() - source_indexes_by_name.keys():
            changes.append(
                {
                    "type": "INDEX_ADDED",
                    "table": table_name,
                    "index": target_indexes_by_name[index_name],
                }
            )
            added_indexes += 1

        # Removed indexes
        for index_name in (
            source_indexes_by_name.keys() 
            - target_indexes_by_name.keys()
        ):
            changes.append(
                {
                    "type": "INDEX_REMOVED",
                    "table": table_name,
                    "index": source_indexes_by_name[index_name],
                }
            )
            removed_indexes += 1

        # Changed indexes
        for index_name in source_indexes_by_name.keys() & target_indexes_by_name.keys():
            source_index = source_indexes_by_name[index_name]
            target_index = target_indexes_by_name[index_name]

            if source_index != target_index:
                changes.append(
                    {
                        "type": "INDEX_CHANGED",
                        "table": table_name,
                        "source": source_index,
                        "target": target_index,
                    }
                )
                changed_indexes += 1

    return {
        "summary": {
            "added_tables": added_tables,
            "removed_tables": removed_tables,
            "added_columns": added_columns,
            "removed_columns": removed_columns,
            "changed_columns": changed_columns,
            "changed_primary_keys": changed_primary_keys,
            "added_primary_keys": added_primary_keys,
            "removed_primary_keys": removed_primary_keys,
            "changed_foreign_keys": changed_foreign_keys,
            "added_foreign_keys": added_foreign_keys,
            "removed_foreign_keys": removed_foreign_keys,
            "changed_unique_constraints": changed_unique_constraints,
            "added_unique_constraints": added_unique_constraints,
            "removed_unique_constraints": removed_unique_constraints,
            "changed_checks": changed_checks,
            "added_checks": added_checks,
            "removed_checks": removed_checks,
            "changed_indexes": changed_indexes,
            "added_indexes": added_indexes,
            "removed_indexes": removed_indexes,
            
        },
        "changes": changes,
    }
