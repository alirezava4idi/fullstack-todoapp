CREATE TABLE IF NOT EXISTS users (
    uuid VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY(uuid)
)
