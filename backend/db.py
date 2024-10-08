import mysql.connector

conn = mysql.connector.connect(
    db="dream_diary",
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
                CREATE TABLE IF NOT EXISTS post(
                    id VARCHAR(36) PRIMARY KEY,
                    user_id VARCHAR(36),
                    post_name VARCHAR(255),
                    post_text TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(user_id) REFERENCES user(id)
                )
                """)
cur.execute("""
                CREATE TABLE IF NOT EXISTS post_images(
                    id VARCHAR(36) PRIMARY KEY,
                    post_id VARCHAR(36),
                    image_name VARCHAR(50),
                    FOREIGN KEY(post_id) REFERENCES post(id)
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

cur.execute("""
            CREATE TABLE IF NOT EXISTS follow(
                id VARCHAR(36) PRIMARY KEY,
                user_id VARCHAR(36),
                follow_id VARCHAR(36),
                FOREIGN KEY(follow_id) REFERENCES user(id),
                FOREIGN KEY(user_id) REFERENCES user(id)
            )
            """)

cur.execute("""
            CREATE TABLE IF NOT EXISTS reminder(
                id VARCHAR(36) PRIMARY KEY,
                send_id VARCHAR(36),
                receive_id VARCHAR(36),
                post_id VARCHAR(36),
                type CHAR(10),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(send_id) REFERENCES user(id),
                FOREIGN KEY(receive_id) REFERENCES user(id),
                FOREIGN KEY(post_id) REFERENCES post(id)
            )
            """)



conn.commit()
