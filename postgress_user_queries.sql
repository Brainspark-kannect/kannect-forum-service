CREATE TABLE users (
    id SERIAL PRIMARY KEY,          -- Auto-incrementing unique ID for each user
    email VARCHAR(255) NOT NULL UNIQUE, -- User's email, must be unique
    password VARCHAR(255) NOT NULL, -- User's hashed password
    name VARCHAR(100),              -- User's name
    role VARCHAR(50) NOT NULL DEFAULT 'employee', -- Role: 'admin' or 'employee', defaults to 'employee'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the user was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for when the user was last updated
);


-- Insert an admin user
INSERT INTO users (email, password, name, role) 
VALUES ('admin@example.com', 'admin123', 'Admin User', 'admin');

-- Insert an employee user
INSERT INTO users (email, password, name, role) 
VALUES ('employee@example.com', 'employee123', 'Employee User', 'employee');

select * from users;