CREATE TABLE IF NOT EXISTS todos (
    uuid VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    creator_id VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(uuid),
    FOREIGN KEY (creator_id) REFERENCES users(uuid) ON DELETE CASCADE
)



