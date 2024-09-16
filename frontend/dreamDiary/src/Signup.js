import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

function Signup() {

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null)

    const handleSubmit = (e) => {

        e.preventDefault();

        const signupData = {
            username: username,
            email: email,
            password: password
        }

        fetch("http://localhost:5000/signup", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signupData),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log(data.success);
            if(data.success === true) {
                window.location.href = "/";
            }
            else if(data.success === false) {
                alert("このメールアドレスは既に登録されています。");
            }
            else {
                alert("アカウント作成時に問題が発生しました。")
            }

        })
    }

    return(
        <>
        <h1>dream Diary</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <p>お名前</p>
                <input type="text" name="name" onChange={(e) => setUsername(e.target.value)}></input>
            </div>
            <div>
                <p>メールアドレス</p>
                <input type="email" name="email" onChange={(e) => setEmail(e.target.value)}></input>
            </div>
            <div>
                <p>パスワード</p>
                <input type="password" name="password" onChange={(e) => setPassword(e.target.value)}></input>
            </div>
            <button type="submit">登録</button>
        </form>
        </>
    )
}

export default Signup;