import mysql.connector

conn = mysql.connector.connect(
    db = "dream_diary",
    host="localhost",
    port=3306,
    user="root",
    password=""
)

cur = conn.cursor()

cur.execute("""
            CREATE TABLE IF NOT EXISTS user (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                password VARCHAR(255),
                profile_text TEXT DEFAULT NULL,
                icon VARCHAR(255) DEFAULT NULL,
                back_image VARCHAR(255) DEFAULT NULL
                )
            """)


cur.execute("""
            CREATE TABLE IF NOT EXISTS postLike(
                id VARCHAR(36) PRIMARY KEY,
                post_id VARCHAR(36),
                user_id VARCHAR(36),
                FOREIGN KEY(post_id) REFERENCES post(id),
                FOREIGN KEY(user_id) REFERENCES user(id)
            )
            """)

cur.execute("""
            CREATE TABLE IF NOT EXISTS bookmark(
                id VARCHAR(36) PRIMARY KEY,
                post_id VARCHAR(36),
                user_id VARCHAR(36),
                FOREIGN KEY(post_id) REFERENCES post(id),
                FOREIGN KEY(user_id) REFERENCES user(id)
            )
            """)

cur.execute("""
            CREATE TABLE IF NOT EXISTS comment(
                Id VARCHAR(36) PRIMARY KEY,
                post_id VARCHAR(36),
                user_id VARCHAR(36),
                comment_text TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(post_id) REFERENCES post(id),
                FOREIGN KEY(user_id) REFERENCES user(id)
            )
            """)

conn.commit()

