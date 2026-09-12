SCHEMA_SAMPLES = [
    {
        "name": "simple_users",
        "sql": """
        CREATE TABLE users(
            id INT PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(255)
        );
        """,
        "complexity": "LOW"
    },

    {
        "name": "users_orders",
        "sql":"""
        CREATE TABLE users (
           id INT PRIMARY KEY,
           name VARCHAR(100),
           email VARCHAR(255)UNIQUE
        );

        CREATE TABLE orders(
            id INT PRIMARY KEY,
            user_id INT,
            amount DECIMAL(10,2),
            FOREIGN KEY (user_id) REFERENCES users(id)   
        );
        """,
        "complexity": "LOW"
    },

    {
        "name": "constraint_heavy",
        "sql": """
        CREATE TABLE products (
            id INT PRIMARY KEY,
            name VARCHAR(100) UNIQUE,
            price DECIMAL(10,2) CHECK (price >= 0),
            stock INT CHECK (stock >= 0)
        );

        CREATE TABLE categories (
            id INT PRIMARY KEY,
            name VARCHAR(100) UNIQUE
        );

        CREATE TABLE product_category (
            product_id INT,
            category_id INT,
            PRIMARY KEY (product_id, category_id),
            FOREIGN KEY (product_id) REFERENCES products(id),
            FOREIGN KEY (category_id) REFERENCES categories(id)
        );
        """,
        "complexity": "MEDIUM"
    },

    {
        "name": "multi_fk_schema",
        "sql": """
        CREATE TABLE customers (
            id INT PRIMARY KEY,
            name VARCHAR(100)
        );

        CREATE TABLE products (
            id INT PRIMARY KEY,
            name VARCHAR(100),
            price DECIMAL(10,2)
        );

        CREATE TABLE orders (
            id INT PRIMARY KEY,
            customer_id INT,
            product_id INT,
            quantity INT CHECK (quantity > 0),
            FOREIGN KEY (customer_id) REFERENCES customers(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        );

        CREATE INDEX idx_orders_customer ON orders(customer_id);
        CREATE INDEX idx_orders_product ON orders(product_id);
        """,
        "complexity": "MEDIUM"
    },

    {
        "name": "deep_relationship_schema",
        "sql": """
        CREATE TABLE departments (
            id INT PRIMARY KEY,
            name VARCHAR(100) UNIQUE
        );

        CREATE TABLE employees (
            id INT PRIMARY KEY,
            department_id INT,
            name VARCHAR(100),
            FOREIGN KEY (department_id) REFERENCES departments(id)
        );

        CREATE TABLE projects (
            id INT PRIMARY KEY,
            name VARCHAR(100)
        );

        CREATE TABLE employee_projects (
            employee_id INT,
            project_id INT,
            assigned_date DATE,
            PRIMARY KEY (employee_id, project_id),
            FOREIGN KEY (employee_id) REFERENCES employees(id),
            FOREIGN KEY (project_id) REFERENCES projects(id)
        );
        """,
        "complexity": "MEDIUM"
    },

    {
        "name": "data_type_complex_schema",
        "sql": """
        CREATE TABLE accounts (
            id BIGINT PRIMARY KEY,
            username VARCHAR(100) UNIQUE,
            balance DECIMAL(15,2),
            created_at DATETIME,
            is_active BOOLEAN,
            metadata JSON
        );
        """,
        "complexity": "MEDIUM"
    },

    {
        "name": "large_business_schema",
        "sql": """
        CREATE TABLE customers (
            id INT PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(255) UNIQUE
        );

        CREATE TABLE categories (
            id INT PRIMARY KEY,
            name VARCHAR(100) UNIQUE
        );

        CREATE TABLE products (
            id INT PRIMARY KEY,
            category_id INT,
            name VARCHAR(150),
            price DECIMAL(12,2) CHECK (price >= 0),
            FOREIGN KEY (category_id) REFERENCES categories(id)
        );

        CREATE TABLE orders (
            id INT PRIMARY KEY,
            customer_id INT,
            order_date DATETIME,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        );

        CREATE TABLE order_items (
            id INT PRIMARY KEY,
            order_id INT,
            product_id INT,
            quantity INT CHECK (quantity > 0),
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        );

        CREATE INDEX idx_products_category ON products(category_id);
        CREATE INDEX idx_orders_customer ON orders(customer_id);
        CREATE INDEX idx_items_order ON order_items(order_id);
        """,
        "complexity": "HIGH"
    },

    {
        "name": "trigger_schema",
        "sql": """
        CREATE TABLE users (
            id INT PRIMARY KEY,
            email VARCHAR(255)
        );

        CREATE TRIGGER before_insert_users
        BEFORE INSERT ON users
        FOR EACH ROW
        SET NEW.email = LOWER(NEW.email);
        """,
        "complexity": "MEDIUM"
    },

    {
    "name": "unsupported_feature_schema",
    "sql": """
        CREATE TABLE users (
            id INT PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(255)
        );

        CREATE FULLTEXT INDEX idx_users_name
        ON users(name);
    """,
    "complexity": "HIGH"
    },

    {
    "name": "unsigned_schema",
    "sql": """
        CREATE TABLE products (
            id INT UNSIGNED PRIMARY KEY,
            stock INT UNSIGNED,
            name VARCHAR(100)
        );
    """,
    "complexity": "MEDIUM"
    },

    {
        "name": "simple_products",
        "sql": """
        CREATE TABLE products (
            id INT PRIMARY KEY,
            name VARCHAR(100),
            price DECIMAL(10,2)
        );
        """,
        "complexity": "LOW"
    },

    {
        "name": "simple_categories",
        "sql": """
        CREATE TABLE categories (
            id INT PRIMARY KEY,
            name VARCHAR(100) UNIQUE
        );
        """,
        "complexity": "LOW"
    },

    {
        "name": "simple_orders",
        "sql": """
        CREATE TABLE orders (
            id INT PRIMARY KEY,
            order_date DATE,
            total DECIMAL(10,2)
        );
        """,
        "complexity": "LOW"
    },

    {
        "name": "basic_index_schema",
        "sql": """
        CREATE TABLE users (
            id INT PRIMARY KEY,
            email VARCHAR(255),
            name VARCHAR(100)
        );

        CREATE INDEX idx_users_email ON users(email);
        """,
        "complexity": "LOW"
    },

    {
        "name": "basic_two_table",
        "sql": """
        CREATE TABLE departments (
            id INT PRIMARY KEY,
            name VARCHAR(100)
        );

        CREATE TABLE employees (
            id INT PRIMARY KEY,
            department_id INT,
            name VARCHAR(100),
            FOREIGN KEY (department_id) REFERENCES departments(id)
        );
        """,
        "complexity": "LOW"
    },

    {
        "name": "simple_inventory",
        "sql": """
        CREATE TABLE inventory (
            id INT PRIMARY KEY,
            product_name VARCHAR(100),
            quantity INT,
            updated_at DATETIME
        );
        """,
        "complexity": "LOW"
    },

    {
        "name": "simple_customers",
        "sql": """
        CREATE TABLE customers (
            id BIGINT PRIMARY KEY,
            name VARCHAR(150),
            email VARCHAR(255) UNIQUE
        );
        """,
        "complexity": "LOW"
    },

    {
        "name": "simple_payments",
        "sql": """
        CREATE TABLE payments (
            id INT PRIMARY KEY,
            order_id INT,
            amount DECIMAL(12,2),
            payment_date DATE
        );
        """,
        "complexity": "LOW"
    },

    {
        "name": "simple_reviews",
        "sql": """
        CREATE TABLE reviews (
            id INT PRIMARY KEY,
            product_id INT,
            rating INT,
            comment TEXT
        );
        """,
        "complexity": "LOW"
    },

    {
        "name": "simple_addresses",
        "sql": """
        CREATE TABLE addresses (
            id INT PRIMARY KEY,
            customer_id INT,
            city VARCHAR(100),
            state VARCHAR(100),
            country VARCHAR(100)
        );
        """,
        "complexity": "LOW"
    },

    {
        "name": "medium_constraints",
        "sql": """
        CREATE TABLE products (
            id INT PRIMARY KEY,
            name VARCHAR(100) UNIQUE,
            price DECIMAL(10,2) CHECK (price >= 0),
            stock INT CHECK (stock >= 0)
        );
        """,
        "complexity": "MEDIUM"
    },

    {
        "name": "medium_multiple_indexes",
        "sql": """
        CREATE TABLE orders (
            id INT PRIMARY KEY,
            customer_id INT,
            order_date DATETIME,
            status VARCHAR(50)
        );

        CREATE INDEX idx_orders_customer ON orders(customer_id);
        CREATE INDEX idx_orders_date ON orders(order_date);
        CREATE INDEX idx_orders_status ON orders(status);
        """,
        "complexity": "MEDIUM"
    },

    {
        "name": "medium_three_table",
        "sql": """
        CREATE TABLE customers (
            id INT PRIMARY KEY,
            name VARCHAR(100)
        );

        CREATE TABLE orders (
            id INT PRIMARY KEY,
            customer_id INT,
            total DECIMAL(12,2),
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        );

        CREATE TABLE payments (
            id INT PRIMARY KEY,
            order_id INT,
            amount DECIMAL(12,2),
            FOREIGN KEY (order_id) REFERENCES orders(id)
        );
        """,
        "complexity": "MEDIUM"
    },

    {
        "name": "medium_unsigned_bigint",
        "sql": """
        CREATE TABLE transactions (
            id BIGINT UNSIGNED PRIMARY KEY,
            account_id INT UNSIGNED,
            amount DECIMAL(15,2),
            created_at DATETIME
        );
        """,
        "complexity": "MEDIUM"
    },

    {
        "name": "medium_json_schema",
        "sql": """
        CREATE TABLE user_profiles (
            id BIGINT PRIMARY KEY,
            user_id INT,
            preferences JSON,
            metadata JSON,
            created_at DATETIME,
            UNIQUE (user_id)
        );
        """,
        "complexity": "MEDIUM"
    },

    {
        "name": "medium_trigger_constraints",
        "sql": """
        CREATE TABLE accounts (
            id INT PRIMARY KEY,
            balance DECIMAL(12,2) CHECK (balance >= 0),
            email VARCHAR(255) UNIQUE
        );

        CREATE TRIGGER before_account_insert
        BEFORE INSERT ON accounts
        FOR EACH ROW
        SET NEW.email = LOWER(NEW.email);
        """,
        "complexity": "MEDIUM"
    },

    {
        "name": "high_set_schema",
        "sql": """
        CREATE TABLE users (
            id INT PRIMARY KEY,
            name VARCHAR(100),
            permissions SET('read','write','delete'),
            status ENUM('active','inactive')
        );

        CREATE INDEX idx_users_name ON users(name);
        """,
        "complexity": "HIGH"
    },

    {
        "name": "high_fulltext_schema",
        "sql": """
        CREATE TABLE articles (
            id INT PRIMARY KEY,
            title VARCHAR(255),
            content TEXT,
            author_id INT
        );

        CREATE FULLTEXT INDEX idx_articles_content
        ON articles(title, content);
        """,
        "complexity": "HIGH"
    },

    {
        "name": "high_trigger_relationship_schema",
        "sql": """
        CREATE TABLE customers (
            id INT PRIMARY KEY,
            email VARCHAR(255) UNIQUE
        );

        CREATE TABLE orders (
            id INT PRIMARY KEY,
            customer_id INT,
            total DECIMAL(12,2),
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        );

        CREATE TRIGGER before_order_insert
        BEFORE INSERT ON orders
        FOR EACH ROW
        SET NEW.total = ABS(NEW.total);

        CREATE INDEX idx_orders_customer
        ON orders(customer_id);
        """,
        "complexity": "HIGH"
    },

    {
        "name": "high_complex_business_schema",
        "sql": """
        CREATE TABLE customers (
            id BIGINT UNSIGNED PRIMARY KEY,
            name VARCHAR(150),
            email VARCHAR(255) UNIQUE
        );

        CREATE TABLE products (
            id BIGINT UNSIGNED PRIMARY KEY,
            name VARCHAR(150),
            price DECIMAL(15,2) CHECK (price >= 0),
            tags SET('new','sale','featured')
        );

        CREATE TABLE orders (
            id BIGINT UNSIGNED PRIMARY KEY,
            customer_id BIGINT UNSIGNED,
            order_date DATETIME,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        );

        CREATE TABLE order_items (
            id BIGINT UNSIGNED PRIMARY KEY,
            order_id BIGINT UNSIGNED,
            product_id BIGINT UNSIGNED,
            quantity INT UNSIGNED CHECK (quantity > 0),
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        );

        CREATE FULLTEXT INDEX idx_products_name
        ON products(name);

        CREATE TRIGGER before_order_item_insert
        BEFORE INSERT ON order_items
        FOR EACH ROW
        SET NEW.quantity = ABS(NEW.quantity);
        """,
        "complexity": "HIGH"
    },
]