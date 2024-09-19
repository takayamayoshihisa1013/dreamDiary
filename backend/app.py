from flask import Flask, render_template, redirect, url_for, request, jsonify, session
import mysql.connector
from flask_cors import CORS
import uuid
import os
from datetime import datetime, timedelta

app = Flask("__name__", static_folder='static')
app.secret_key = "secret!!!"
CORS(app, supports_credentials=True)

# app.root_pathはflaskのapp.pyがある場所を指していたらしい。初めて知った。

UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'images')


def mysql_conn():
    conn = mysql.connector.connect(
        db="dream_diary",
        host="localhost",
        port=3306,
        user="root",
        password=""
    )
    return conn


@app.route("/post_data", methods=["POST"])
def post_data():
    conn = mysql_conn()
    cur = conn.cursor()

    loginState = False

    if "user_id" in session:
        loginState = True
        cur.execute("""
                    SELECT
                        post.post_name,
                        post.post_text,
                        post.created_at,
                        user.id,
                        user.name,
                        user.icon,
                        GROUP_CONCAT(DISTINCT post_images.image_name),
                        post.id,
                        COUNT(DISTINCT postLike.user_id),
                        CASE
                            WHEN EXISTS (
                                SELECT 1
                                FROM postLike
                                WHERE postLike.post_id = post.id
                                AND postLike.user_id = %s -- ログイン中のユーザーのIDをここに挿入
                            )
                            THEN True
                            ELSE False
                        END AS user_liked,
                        CASE
                            WHEN EXISTS (
                                SELECT 1
                                FROM bookmark
                                WHERE bookmark.post_id = post.id
                                AND bookmark.user_id = %s -- ログイン中のユーザーのIDをここに挿入
                            )
                            THEN True
                            ELSE False
                        END AS bookmark_user
                    FROM post
                    JOIN user ON user.id = post.user_id
                    LEFT JOIN post_images ON post.id = post_images.post_id
                    LEFT JOIN postLike ON post.id = postLike.post_id
                    LEFT JOIN bookmark ON post.id = bookmark.post_id
                    GROUP BY post.id
                    ORDER BY post.created_at DESC
                    """, (session["user_id"], session["user_id"]))

    else:
        cur.execute("""
                    SELECT
                        post.post_name,
                        post.post_text,
                        post.created_at,
                        user.id,
                        user.name,
                        user.icon,
                        GROUP_CONCAT(DISTINCT post_images.image_name),
                        post.id,
                        COUNT(DISTINCT postLike.user_id)
                    FROM post
                    JOIN user ON user.id = post.user_id
                    LEFT JOIN post_images ON post.id = post_images.post_id
                    LEFT JOIN postLike ON post.id = postLike.post_id
                    LEFT JOIN bookmark ON post.id = bookmark.post_id
                    GROUP BY post.id
                    ORDER BY post.created_at DESC
                    """)

    post_data = cur.fetchall()

    data_list = []
    # print(post_data)

    for data in post_data:
        data_name = {}
        data_name["postTitle"] = data[0]
        data_name["postText"] = data[1]
        data_name["datetime"] = data[2].strftime("%Y/%m/%d %H:%M")
        data_name["userId"] = data[3]
        data_name["username"] = data[4]
        data_name["userIcon"] = data[5]
        data_name["postImages"] = data[6].split(",")
        data_name["postId"] = data[7]

        data_name["likeCount"] = data[8]

        if "user_id" in session:
            if data[9] == 1:
                data_name["favorite"] = True
            else:
                data_name["favorite"] = False

            if data[10] == 1:
                # print(data[9])
                data_name["bookmark"] = True
            else:
                data_name["bookmark"] = False

        data_list.append(data_name)

        print(data_list)

    return jsonify({"success": True, "post_data": data_list, "loginState": loginState})


@app.route("/signup", methods=["POST"])
def signup():
    formData = request.get_json()
    print(formData["username"])
    username = formData["username"]
    email = formData["email"]
    password = formData["password"]

    conn = mysql_conn()
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
    
    try:
        cur.execute("""
                    SELECT *
                    FROM user
                    WHERE email = %s AND password = %s
                    """, (email, password))

        user_exist = cur.fetchone()
        print(user_exist)
        if user_exist:
            return jsonify({"success": False})
        else:
            user_uuid = str(uuid.uuid4())
            print(user_uuid)
            cur.execute("INSERT INTO user(id,name,email,password) VALUES(%s,%s,%s,%s)",
                        (user_uuid, username, email, password))
            conn.commit()
            session["user_id"] = user_uuid
            conn.close()

            return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"success": "error"})


@app.route("/login", methods=["POST"])
def login():
    loginData = request.get_json()
    print(loginData)
    email = loginData["email"]
    password = loginData["password"]

    conn = mysql_conn()
    cur = conn.cursor()
    try:
        cur.execute("""
                    SELECT id
                    FROM user
                    WHERE email = %s AND password = %s
                    """, (email, password))

        user_data = cur.fetchone()

        if user_data:
            session["user_id"] = user_data[0]
            return jsonify({"success": True})
        else:
            return jsonify({"success": False})
    except:
        return jsonify({"success": "error"})


@app.route("/add_post", methods=["POST"])
def add_post():
    # テキストデータの取得
    addPostName = request.form.get("postName")
    addPostText = request.form.get("postText")

    # 画像ファイルの取得
    addPostImages = request.files.getlist("postImages")
    print(addPostName, addPostText, addPostImages)

    # 画像を保存するフォルダのパスを設定
    postImage = os.path.join(UPLOAD_FOLDER, 'postImages')
    if not os.path.exists(postImage):
        os.makedirs(postImage)  # フォルダが存在しない場合、作成

    saved_image_urls = []

    # デバッグ用に保存された画像のURLを表示
    print(saved_image_urls)

    conn = mysql_conn()
    cur = conn.cursor()

    postUuid = str(uuid.uuid4())

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
    print("作った")
    try:
        cur.execute("INSERT INTO post(id,user_id,post_name,post_text) VALUES(%s,%s,%s,%s)",
                    (postUuid, session["user_id"], addPostName, addPostText))
        print("ポスト")
        # 画像ファイルの保存
        for img in addPostImages:
            if img:
                img_filename = str(uuid.uuid4()) + "." + \
                    (img.filename).split(".")[1]
                print((img.filename).split(".")[1])
                save_path = os.path.join(postImage, img_filename)

                # 画像ファイルを指定されたパスに保存
                img.save(save_path)

                # 保存された画像のURLを作成
                image_url = url_for(
                    'static', filename=f'images/postImages/{img_filename}')
                saved_image_urls.append(image_url)
                print(image_url)
                postImageUuid = str(uuid.uuid4())
                cur.execute("INSERT INTO post_images(id,post_id,image_name) VALUES(%s,%s,%s)",
                            (postImageUuid, postUuid, img_filename))
                print("画像", img_filename)
        conn.commit()
        conn.close()
        print("完了")
        return jsonify({"success": True})

    except Exception as e:
        print(session)
        print(e, "except")
        return jsonify({"success": False})


@app.route("/test")
def test():
    return render_template("index.html")


@app.route("/like", methods=["POST"])
def heart():

    postId = request.form.get("postId")
    print(postId)
    conn = mysql_conn()
    cur = conn.cursor()

    try:
        cur.execute("""
                    SELECT *
                    FROM postLike 
                    WHERE user_id = %s AND post_id = %s
                    """, (session["user_id"], postId))

        existCheck = cur.fetchone()

        if existCheck:
            # いいねが押されていた場合の処理
            print(existCheck)
            cur.execute("""
                        DELETE FROM postLike
                        WHERE post_id = %s AND user_id = %s
                        """, (postId, session["user_id"]))
        else:
            postLikeUuid = str(uuid.uuid4())
            cur.execute("INSERT INTO postLike(id,post_id,user_id) VALUES(%s,%s,%s)",
                        (postLikeUuid, postId, session["user_id"]))
        conn.commit()
        conn.close()
        return jsonify({})
    except Exception as e:
        print(e)
        return jsonify({})

@app.route("/bookmark", methods=["POST"])
def bookmark():

    postId = request.form.get("bookmark")
    print(postId)
    conn = mysql_conn()
    cur = conn.cursor()
    try:
        cur.execute("""
                    SELECT *
                    FROM bookmark
                    WHERE user_id = %s AND post_id = %s
                    """, (session["user_id"], postId))

        existCheck = cur.fetchone()

        if existCheck:
            # いいねが押されていた場合の処理
            print(existCheck)
            cur.execute("""
                        DELETE FROM bookmark
                        WHERE post_id = %s AND user_id = %s
                        """, (postId, session["user_id"]))
        else:
            postLikeUuid = str(uuid.uuid4())
            cur.execute("INSERT INTO bookmark(id,post_id,user_id) VALUES(%s,%s,%s)",
                        (postLikeUuid, postId, session["user_id"]))
        conn.commit()
        conn.close()
        return jsonify({})
    except Exception as e:
        print(e)
        return jsonify({})


@app.route("/post", methods=["POST"])
def post():
    conn = mysql_conn()
    cur = conn.cursor()

    loginState = False

    postId = request.form.get("postId")
    print(request.form)
    print(postId, "postId")

    if "user_id" in session:
        loginState = True
        cur.execute("""
                    SELECT
                        post.post_name,
                        post.post_text,
                        post.created_at,
                        user.id,
                        user.name,
                        user.icon,
                        GROUP_CONCAT(DISTINCT post_images.image_name),
                        post.id,
                        COUNT(DISTINCT postLike.user_id),
                        CASE
                            WHEN EXISTS (
                                SELECT 1
                                FROM postLike
                                WHERE postLike.post_id = post.id
                                AND postLike.user_id = %s -- ログイン中のユーザーのIDをここに挿入
                            )
                            THEN True
                            ELSE False
                        END AS user_liked,
                        CASE
                            WHEN EXISTS (
                                SELECT 1
                                FROM bookmark
                                WHERE bookmark.post_id = post.id
                                AND bookmark.user_id = %s -- ログイン中のユーザーのIDをここに挿入
                            )
                            THEN True
                            ELSE False
                        END AS bookmark_user
                    FROM post
                    JOIN user ON user.id = post.user_id
                    LEFT JOIN post_images ON post.id = post_images.post_id
                    LEFT JOIN postLike ON post.id = postLike.post_id
                    LEFT JOIN bookmark ON post.id = bookmark.post_id
                    WHERE post.id = %s
                    GROUP BY post.id
                    ORDER BY post.created_at DESC
                    """, (session["user_id"], session["user_id"], postId))

    else:
        cur.execute("""
                    SELECT
                        post.post_name,
                        post.post_text,
                        post.created_at,
                        user.id,
                        user.name,
                        user.icon,
                        GROUP_CONCAT(DISTINCT post_images.image_name),
                        post.id,
                        COUNT(DISTINCT postLike.user_id)
                    FROM post
                    JOIN user ON user.id = post.user_id
                    LEFT JOIN post_images ON post.id = post_images.post_id
                    LEFT JOIN postLike ON post.id = postLike.post_id
                    LEFT JOIN bookmark ON post.id = bookmark.post_id
                    WHERE post.id = %s
                    GROUP BY post.id
                    ORDER BY post.created_at DESC
                    """, (postId,))

    post_data = cur.fetchall()

    data_list = []
    print(post_data)

    for data in post_data:
        data_name = {}
        data_name["postTitle"] = data[0]
        data_name["postText"] = data[1]
        data_name["datetime"] = data[2].strftime("%Y/%m/%d %H:%M")
        data_name["userId"] = data[3]
        data_name["username"] = data[4]
        data_name["userIcon"] = data[5]
        data_name["postImages"] = data[6].split(",")
        data_name["postId"] = data[7]

        data_name["likeCount"] = data[8]

        if "user_id" in session:
            if data[9] == 1:
                data_name["favorite"] = True
            else:
                data_name["favorite"] = False

            if data[10] == 1:
                # print(data[9])
                data_name["bookmark"] = True
            else:
                data_name["bookmark"] = False

        data_list.append(data_name)

        print(data_list, "datalist")

    cur.execute("""
                    SELECT user.name, comment_text, created_at
                    FROM comment
                    LEFT JOIN user ON comment.user_id = user.id
                    WHERE post_id = %s
                    """, (postId,))

    commentData = cur.fetchall()
    
    commentList = []
    
    for data in commentData:
        comment = {}
        comment["userId"] = data[0]
        comment["comment"] = data[1]
        comment["time"] = data[2].strftime("%Y/%m/%d %H:%M")
        commentList.append(comment)
    
    return jsonify({"success": True, "post_data": data_list, "loginState": loginState, "commentList":commentList})

@app.route("/add_comment", methods=["POST"])
def add_comment():
    print(request.form, "request.form")
    commentText = request.form.get("commentText")
    postId = request.form.get("postId")
    print(commentText)
    conn = mysql_conn()
    cur = conn.cursor()
    try:
        commentUuid = str(uuid.uuid4())
        cur.execute("INSERT INTO comment(id,post_id,user_id,comment_text) VALUES(%s,%s,%s,%s)",
                    (commentUuid, postId, session["user_id"], commentText))
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"success": False})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
