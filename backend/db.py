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

conn.commit()

cur.execute("""
            CREATE TABLE IF NOT EXISTS post
            """)