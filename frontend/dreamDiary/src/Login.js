import React, {useState} from "react";
import "./Login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const loginData = {
            email:email,
            password:password
        }

        fetch("http://localhost:5000/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.success === true) {
                window.location.href = "/";
            }
            else if (data.success === false) {
                alert("アカウントが見つかりません。");
            }
            else {
                alert("ログイン中に問題が発生しました。");
            }
        })
    }

    return(
        <>
        <h1>dream Diary</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <p>メールアドレス</p>
                <input type="email" name="email" onChange={(e) => setEmail(e.target.value)}></input>
            </div>
            <div>
                <p>パスワード</p>
                <input type="password" name="password" onChange={(e) => setPassword(e.target.value)}></input>
            </div>

            <button type="submit">ログイン</button>
        </form>
        </>
    )
}

export default Login;