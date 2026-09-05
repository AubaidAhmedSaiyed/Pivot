// Mock Data for Pivot Frontend (MySQL -> PostgreSQL Migration Engine)

export const MIGRATION_PROJECTS = [
  {
    id: 'proj-ecom-prod',
    name: 'ecom_production_db',
    sourceEngine: 'MySQL 8.0.32',
    targetEngine: 'PostgreSQL 16.2',
    tableCount: 48,
    viewCount: 6,
    triggerCount: 12,
    riskScore: 28,
    riskTier: 'Low',
    status: 'Completed',
    lastRun: '14 minutes ago',
    flaggedItems: 3,
    author: 'alex.chen@stripe-demo.io',
    branch: 'main-v2-cutover',
  },
  {
    id: 'proj-saas-billing',
    name: 'saas_billing_engine',
    sourceEngine: 'MySQL 5.7.40',
    targetEngine: 'PostgreSQL 15.6',
    tableCount: 34,
    viewCount: 4,
    triggerCount: 9,
    riskScore: 46,
    riskTier: 'Medium',
    status: 'In Review',
    lastRun: '2 hours ago',
    flaggedItems: 7,
    author: 'sarah.k@finscale.dev',
    branch: 'feature/pg-sub-engine',
  },
  {
    id: 'proj-fintech-core',
    name: 'fintech_ledger_v3',
    sourceEngine: 'MySQL 8.0.28',
    targetEngine: 'PostgreSQL 16.1',
    tableCount: 84,
    viewCount: 18,
    triggerCount: 31,
    riskScore: 82,
    riskTier: 'High',
    status: 'Needs Attention',
    lastRun: 'Yesterday at 18:42',
    flaggedItems: 14,
    author: 'marcus.vault@mercury-demo.com',
    branch: 'audit/core-invariants',
  },
  {
    id: 'proj-telemetry-fleet',
    name: 'logistics_fleet_telemetry',
    sourceEngine: 'MySQL 8.0.34',
    targetEngine: 'PostgreSQL 16.2',
    tableCount: 19,
    viewCount: 2,
    triggerCount: 4,
    riskScore: 14,
    riskTier: 'Low',
    status: 'Completed',
    lastRun: '3 days ago',
    flaggedItems: 1,
    author: 'dave.iot@fleetwire.io',
    branch: 'cutover/iot-timescale',
  },
  {
    id: 'proj-crm-hub',
    name: 'crm_customer_hub',
    sourceEngine: 'MySQL 5.7.38',
    targetEngine: 'PostgreSQL 15.4',
    tableCount: 56,
    viewCount: 11,
    triggerCount: 16,
    riskScore: 65,
    riskTier: 'High',
    status: 'In Review',
    lastRun: 'May 28, 2026',
    flaggedItems: 9,
    author: 'elena.rodriguez@opsflow.net',
    branch: 'release/v4-pg-migration',
  },
];

export const WORKSPACE_STATS = {
  totalMigrations: 218,
  averageRiskScore: 34,
  safeConversionRate: '98.6%',
  flaggedConstructsCount: 38,
  activeEnginesCount: 12,
};

export const SAMPLE_SCHEMAS = {
  ecommerce: {
    name: 'E-Commerce Storefront Schema',
    description: '4 tables with AUTO_INCREMENT, ENUMs, JSON columns, and zero-date defaults.',
    tableCount: 4,
    sql: `-- MySQL 8.0 Source Schema: Storefront Core
CREATE TABLE users (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer', 'vendor', 'support', 'admin') DEFAULT 'customer',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  metadata JSON DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_users_uuid (uuid),
  FULLTEXT KEY idx_users_search (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE orders (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  order_number VARCHAR(64) NOT NULL UNIQUE,
  user_id INT(11) UNSIGNED NOT NULL,
  status ENUM('pending', 'authorized', 'processing', 'completed', 'refunded') NOT NULL DEFAULT 'pending',
  subtotal_cents INT(11) NOT NULL,
  tax_cents INT(11) NOT NULL DEFAULT 0,
  total_cents INT(11) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  notes MEDIUMTEXT DEFAULT NULL,
  placed_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY fk_orders_user_idx (user_id),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE order_items (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT(20) UNSIGNED NOT NULL,
  sku VARCHAR(64) NOT NULL,
  quantity INT(11) NOT NULL DEFAULT 1,
  unit_price_cents INT(11) NOT NULL,
  total_price_cents INT(11) NOT NULL,
  attributes JSON DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fk_order_items_order_idx (order_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE audit_logs (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  entity_type VARCHAR(64) NOT NULL,
  entity_id VARCHAR(64) NOT NULL,
  action VARCHAR(32) NOT NULL,
  payload JSON NOT NULL,
  recorded_at DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (id),
  KEY idx_audit_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
  },
  saas: {
    name: 'SaaS Multi-tenant Engine',
    description: 'Tenant organizations, memberships, role bitmasks, and session timestamps.',
    tableCount: 3,
    sql: `-- MySQL 5.7 Source: Multi-tenant SaaS
CREATE TABLE organizations (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(120) NOT NULL UNIQUE,
  display_name VARCHAR(200) NOT NULL,
  plan ENUM('starter', 'team', 'enterprise') DEFAULT 'starter',
  is_suspended TINYINT(1) DEFAULT 0,
  settings LONGTEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE organization_members (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  org_id INT(10) UNSIGNED NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  role_flags INT(11) DEFAULT 1,
  invited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_org_member (org_id, user_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
  },
  fintech: {
    name: 'FinTech Ledger & Transactions',
    description: 'Strict double-entry accounts, balance locks, and audit immutable sequence.',
    tableCount: 3,
    sql: `-- MySQL 8.0 Source: Ledger Transactions
CREATE TABLE ledger_accounts (
  account_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  account_number VARCHAR(34) NOT NULL UNIQUE,
  account_type ENUM('asset', 'liability', 'equity', 'revenue', 'expense') NOT NULL,
  currency VARCHAR(3) NOT NULL,
  current_balance_cents BIGINT(20) NOT NULL DEFAULT 0,
  is_frozen TINYINT(1) NOT NULL DEFAULT 0,
  version INT(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
  },
};

export const SCHEMA_DIFF_TABLES = {
  users: {
    tableName: 'users',
    riskScore: 24,
    riskTier: 'Low',
    mysqlRows: [
      { num: 1, text: 'CREATE TABLE users (', type: 'same' },
      { num: 2, text: '  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,', type: 'changed-del', note: 'INT + AUTO_INCREMENT not native in PG' },
      { num: 3, text: '  uuid VARCHAR(36) NOT NULL,', type: 'changed-del', note: 'VARCHAR(36) recommended to native UUID' },
      { num: 4, text: '  email VARCHAR(255) NOT NULL UNIQUE,', type: 'same' },
      { num: 5, text: '  password_hash VARCHAR(255) NOT NULL,', type: 'same' },
      { num: 6, text: "  role ENUM('customer', 'vendor', 'support', 'admin') DEFAULT 'customer',", type: 'changed-del', note: 'Inline ENUM requires CREATE TYPE in PG' },
      { num: 7, text: '  is_active TINYINT(1) NOT NULL DEFAULT 1,', type: 'changed-del', note: 'TINYINT(1) maps to BOOLEAN' },
      { num: 8, text: '  metadata JSON DEFAULT NULL,', type: 'changed-del', note: 'JSON converted to indexable JSONB' },
      { num: 9, text: '  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,', type: 'changed-del', note: 'DATETIME converted to TIMESTAMPTZ' },
      { num: 10, text: '  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,', type: 'changed-del', note: 'ON UPDATE not supported; requires trigger' },
      { num: 11, text: '  PRIMARY KEY (id),', type: 'same' },
      { num: 12, text: '  KEY idx_users_uuid (uuid),', type: 'same' },
      { num: 13, text: '  FULLTEXT KEY idx_users_search (email)', type: 'changed-del', note: 'FULLTEXT converted to GIN tsvector' },
      { num: 14, text: ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;', type: 'changed-del', note: 'Storage engines omitted in PG' },
    ],
    postgresRows: [
      { num: 1, text: '-- 1. Standalone Enum Type Definition', type: 'comment' },
      { num: 2, text: "CREATE TYPE user_role_enum AS ENUM ('customer', 'vendor', 'support', 'admin');", type: 'changed-add', note: 'Safe custom enum created' },
      { num: 3, text: '', type: 'empty' },
      { num: 4, text: 'CREATE TABLE users (', type: 'same' },
      { num: 5, text: '  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,', type: 'changed-add', note: 'Standard SQL identity sequence' },
      { num: 6, text: '  uuid UUID NOT NULL DEFAULT gen_random_uuid(),', type: 'changed-add', note: 'Optimized 16-byte native UUID' },
      { num: 7, text: '  email VARCHAR(255) NOT NULL UNIQUE,', type: 'same' },
      { num: 8, text: '  password_hash VARCHAR(255) NOT NULL,', type: 'same' },
      { num: 9, text: "  role user_role_enum NOT NULL DEFAULT 'customer',", type: 'changed-add', note: 'Bound to user_role_enum' },
      { num: 10, text: '  is_active BOOLEAN NOT NULL DEFAULT TRUE,', type: 'changed-add', note: 'Strict boolean type mapping' },
      { num: 11, text: '  metadata JSONB DEFAULT NULL,', type: 'changed-add', note: 'Fast binary JSONB' },
      { num: 12, text: '  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),', type: 'changed-add', note: 'Timezone-aware timestamp' },
      { num: 13, text: '  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()', type: 'changed-add', note: 'Managed by auto-generated trigger' },
      { num: 14, text: ');', type: 'same' },
      { num: 15, text: 'CREATE INDEX idx_users_uuid ON users (uuid);', type: 'changed-add' },
      { num: 16, text: "CREATE INDEX idx_users_email_gin ON users USING gin (to_tsvector('english', email));", type: 'changed-add', note: 'PostgreSQL GIN fulltext' },
    ],
  },
  orders: {
    tableName: 'orders',
    riskScore: 18,
    riskTier: 'Low',
    mysqlRows: [
      { num: 1, text: 'CREATE TABLE orders (', type: 'same' },
      { num: 2, text: '  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,', type: 'changed-del' },
      { num: 3, text: '  order_number VARCHAR(64) NOT NULL UNIQUE,', type: 'same' },
      { num: 4, text: '  user_id INT(11) UNSIGNED NOT NULL,', type: 'same' },
      { num: 5, text: "  status ENUM('pending', 'authorized', 'processing', 'completed', 'refunded') NOT NULL DEFAULT 'pending',", type: 'changed-del' },
      { num: 6, text: '  subtotal_cents INT(11) NOT NULL,', type: 'same' },
      { num: 7, text: '  tax_cents INT(11) NOT NULL DEFAULT 0,', type: 'same' },
      { num: 8, text: '  total_cents INT(11) NOT NULL,', type: 'same' },
      { num: 9, text: "  currency VARCHAR(3) NOT NULL DEFAULT 'USD',", type: 'same' },
      { num: 10, text: '  notes MEDIUMTEXT DEFAULT NULL,', type: 'changed-del' },
      { num: 11, text: '  placed_at DATETIME NOT NULL,', type: 'changed-del' },
      { num: 12, text: '  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,', type: 'changed-del' },
      { num: 13, text: '  PRIMARY KEY (id),', type: 'same' },
      { num: 14, text: '  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT', type: 'same' },
      { num: 15, text: ') ENGINE=InnoDB;', type: 'changed-del' },
    ],
    postgresRows: [
      { num: 1, text: "CREATE TYPE order_status_enum AS ENUM ('pending', 'authorized', 'processing', 'completed', 'refunded');", type: 'changed-add' },
      { num: 2, text: 'CREATE TABLE orders (', type: 'same' },
      { num: 3, text: '  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,', type: 'changed-add' },
      { num: 4, text: '  order_number VARCHAR(64) NOT NULL UNIQUE,', type: 'same' },
      { num: 5, text: '  user_id BIGINT NOT NULL,', type: 'same' },
      { num: 6, text: "  status order_status_enum NOT NULL DEFAULT 'pending',", type: 'changed-add' },
      { num: 7, text: '  subtotal_cents INTEGER NOT NULL,', type: 'same' },
      { num: 8, text: '  tax_cents INTEGER NOT NULL DEFAULT 0,', type: 'same' },
      { num: 9, text: '  total_cents INTEGER NOT NULL,', type: 'same' },
      { num: 10, text: "  currency VARCHAR(3) NOT NULL DEFAULT 'USD',", type: 'same' },
      { num: 11, text: '  notes TEXT DEFAULT NULL,', type: 'changed-add', note: 'MEDIUMTEXT normalized to TEXT' },
      { num: 12, text: '  placed_at TIMESTAMPTZ NOT NULL,', type: 'changed-add' },
      { num: 13, text: '  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),', type: 'changed-add' },
      { num: 14, text: '  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE', type: 'same' },
      { num: 15, text: ');', type: 'same' },
    ],
  },
  audit_logs: {
    tableName: 'audit_logs',
    riskScore: 54,
    riskTier: 'Medium',
    mysqlRows: [
      { num: 1, text: 'CREATE TABLE audit_logs (', type: 'same' },
      { num: 2, text: '  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,', type: 'changed-del' },
      { num: 3, text: '  entity_type VARCHAR(64) NOT NULL,', type: 'same' },
      { num: 4, text: '  entity_id VARCHAR(64) NOT NULL,', type: 'same' },
      { num: 5, text: '  action VARCHAR(32) NOT NULL,', type: 'same' },
      { num: 6, text: '  payload JSON NOT NULL,', type: 'changed-del' },
      { num: 7, text: "  recorded_at DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',", type: 'changed-del', note: 'Zero-dates illegal in Postgres' },
      { num: 8, text: '  PRIMARY KEY (id),', type: 'same' },
      { num: 9, text: '  KEY idx_audit_entity (entity_type, entity_id)', type: 'same' },
      { num: 10, text: ') ENGINE=InnoDB;', type: 'changed-del' },
    ],
    postgresRows: [
      { num: 1, text: 'CREATE TABLE audit_logs (', type: 'same' },
      { num: 2, text: '  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,', type: 'changed-add' },
      { num: 3, text: '  entity_type VARCHAR(64) NOT NULL,', type: 'same' },
      { num: 4, text: '  entity_id VARCHAR(64) NOT NULL,', type: 'same' },
      { num: 5, text: '  action VARCHAR(32) NOT NULL,', type: 'same' },
      { num: 6, text: '  payload JSONB NOT NULL,', type: 'changed-add', note: 'Binary JSONB mapping' },
      { num: 7, text: '  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),', type: 'changed-add', note: 'Replaced invalid 0000-00-00 with NOW()' },
      { num: 8, text: ');', type: 'same' },
      { num: 9, text: 'CREATE INDEX idx_audit_entity ON audit_logs (entity_type, entity_id);', type: 'changed-add' },
      { num: 10, text: 'CREATE INDEX idx_audit_payload_gin ON audit_logs USING gin (payload);', type: 'changed-add', note: 'Path-optimized JSON index' },
    ],
  },
};

export const UNRESOLVED_OBJECTS = [
  {
    id: 'unresolved-1',
    title: 'MySQL `ON UPDATE CURRENT_TIMESTAMP` Construct',
    target: 'users.updated_at',
    severity: 'Medium',
    category: 'Trigger Required',
    mysqlSnippet: 'updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    plainLanguage:
      'MySQL allows columns to automatically update to the current time whenever any column in the row changes. PostgreSQL does not have an inline column clause for this behavior.',
    recommendation:
      'Pivot generated an automated PL/pgSQL function `fn_touch_updated_at()` and attached a `BEFORE UPDATE` trigger on the `users` table so your timestamp updates work identically without changing application code.',
    status: 'Auto-Resolved via Trigger',
    resolvedSnippet: `CREATE OR REPLACE FUNCTION fn_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_touch_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION fn_touch_updated_at();`,
  },
  {
    id: 'unresolved-2',
    title: 'Zero-Date Default Constraint Discrepancy',
    target: 'audit_logs.recorded_at',
    severity: 'High',
    category: 'Data Integrity',
    mysqlSnippet: "recorded_at DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00'",
    plainLanguage:
      "MySQL historically accepted '0000-00-00 00:00:00' as a pseudo-null date fallback. PostgreSQL strictly enforces calendar validation and will raise a fatal syntax error on zero-dates.",
    recommendation:
      'Pivot adjusted the default to `NOW()` and sanitized column requirements. If your existing data dump contains zero-dates, run our generated sanitization regex during the CSV or pgloader ETL phase.',
    status: 'Requires Data Cleanse Verification',
    resolvedSnippet: `ALTER TABLE audit_logs 
ALTER COLUMN recorded_at SET DEFAULT NOW();`,
  },
  {
    id: 'unresolved-3',
    title: 'MySQL Full-Text Search Key Conversion',
    target: 'users.idx_users_search',
    severity: 'Medium',
    category: 'Indexing Engine',
    mysqlSnippet: 'FULLTEXT KEY idx_users_search (email)',
    plainLanguage:
      'MySQL InnoDB provides a specialized FULLTEXT index syntax. PostgreSQL uses Generalized Inverted Indexes (GIN) or GiST combined with `to_tsvector()` dictionary parsers.',
    recommendation:
      "Pivot generated a PostgreSQL GIN index `USING gin (to_tsvector('english', email))`. Queries should use `to_tsvector() @@ to_tsquery()` in place of MySQL `MATCH(...) AGAINST(...)`.",
    status: 'Auto-Resolved via GIN Index',
    resolvedSnippet: `CREATE INDEX idx_users_email_gin 
ON users USING gin (to_tsvector('english', email));`,
  },
  {
    id: 'unresolved-4',
    title: 'AUTO_INCREMENT → SQL:2008 Identity Sequence',
    target: 'All Tables (Primary Keys)',
    severity: 'Low',
    category: 'Standardization',
    mysqlSnippet: 'id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT',
    plainLanguage:
      'MySQL uses the proprietary `AUTO_INCREMENT` attribute. Older PostgreSQL migrations used `SERIAL`, which has known edge-case permission and sequence detachment flaws.',
    recommendation:
      'Pivot upgraded all primary keys to modern standard `GENERATED ALWAYS AS IDENTITY`, guaranteeing sequence integrity and preventing accidental manual ID collisions.',
    status: 'Standardized Cleanly',
    resolvedSnippet: `id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY`,
  },
];

export const MIGRATION_AUDIT_LOGS = [
  {
    timestamp: '14:22:01.102',
    rule: 'TYPE_MAP',
    source: 'TINYINT(1)',
    target: 'BOOLEAN',
    tablesAffected: 'users, organizations, ledger_accounts',
    confidence: '100%',
    status: 'Safe',
  },
  {
    timestamp: '14:22:01.215',
    rule: 'IDENTITY_NORM',
    source: 'AUTO_INCREMENT',
    target: 'GENERATED ALWAYS AS IDENTITY',
    tablesAffected: '4 tables',
    confidence: '100%',
    status: 'Safe',
  },
  {
    timestamp: '14:22:01.340',
    rule: 'TRIGGER_SYNTHESIS',
    source: 'ON UPDATE CURRENT_TIMESTAMP',
    target: 'CREATE TRIGGER trg_users_touch_updated_at',
    tablesAffected: 'users',
    confidence: '95%',
    status: 'Synthesized',
  },
  {
    timestamp: '14:22:01.488',
    rule: 'INDEX_TRANSLATION',
    source: 'FULLTEXT KEY',
    target: 'CREATE INDEX ... USING gin',
    tablesAffected: 'users',
    confidence: '92%',
    status: 'Synthesized',
  },
  {
    timestamp: '14:22:01.610',
    rule: 'CONSTRAINT_ZERO_DATE',
    source: "'0000-00-00 00:00:00'",
    target: 'DEFAULT NOW()',
    tablesAffected: 'audit_logs',
    confidence: '84%',
    status: 'Flagged',
  },
];

export const GENERATED_PG_SQL = `-- =====================================================================
-- PIVOT DATABASE SCHEMA MIGRATION ENGINE
-- Source Dialect : MySQL 8.0 (InnoDB)
-- Target Dialect : PostgreSQL 16.x
-- Generated At   : 2026-09-05T17:00:00Z
-- Overall Risk   : 28/100 (Low Risk - Safe for Automated Staging)
-- =====================================================================

BEGIN;

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Standalone Enum Types
DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM ('customer', 'vendor', 'support', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status_enum AS ENUM ('pending', 'authorized', 'processing', 'completed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Trigger Utility Functions
CREATE OR REPLACE FUNCTION fn_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Table: users
CREATE TABLE IF NOT EXISTS users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uuid UUID NOT NULL DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'customer',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_uuid ON users (uuid);
CREATE INDEX IF NOT EXISTS idx_users_email_gin ON users USING gin (to_tsvector('english', email));

CREATE OR REPLACE TRIGGER trg_users_touch_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION fn_touch_updated_at();

-- 5. Table: orders
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_number VARCHAR(64) NOT NULL UNIQUE,
  user_id BIGINT NOT NULL,
  status order_status_enum NOT NULL DEFAULT 'pending',
  subtotal_cents INTEGER NOT NULL,
  tax_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  notes TEXT DEFAULT NULL,
  placed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS fk_orders_user_idx ON orders (user_id);

-- 6. Table: order_items
CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id BIGINT NOT NULL,
  sku VARCHAR(64) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_cents INTEGER NOT NULL,
  total_price_cents INTEGER NOT NULL,
  attributes JSONB DEFAULT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS fk_order_items_order_idx ON order_items (order_id);

-- 7. Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  entity_type VARCHAR(64) NOT NULL,
  entity_id VARCHAR(64) NOT NULL,
  action VARCHAR(32) NOT NULL,
  payload JSONB NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_payload_gin ON audit_logs USING gin (payload);

COMMIT;
`;

export const ROLLBACK_PG_SQL = `-- =====================================================================
-- PIVOT ROLLBACK SCRIPT
-- Reverts tables, triggers, and types created during migration
-- =====================================================================

BEGIN;

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP FUNCTION IF EXISTS fn_touch_updated_at() CASCADE;

DROP TYPE IF EXISTS order_status_enum CASCADE;
DROP TYPE IF EXISTS user_role_enum CASCADE;

COMMIT;
`;
