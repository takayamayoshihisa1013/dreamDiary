import React, {useState, useEffect} from "react";
import "./LeftNav.css";
import { Link } from 'react-router-dom';
import zzz from "./images/zzz.png";


function LeftNav() {

    const [loginState, setLoginState] = useState("");


    useEffect(() => {
        fetch("http://localhost:5000/post_data", {
            method: "POST",
            credentials: "include",
        })
            .then(response => response.json())
            .then(data => {
                setLoginState(data.loginState);
            })
    }, [])

    return (
        <nav className="leftNav">
            <ul>
                <Link to={"/"}>
                    <li>
                        <img src={zzz}></img>
                        <p className="navValue">夢を見る</p>
                    </li>
                </Link>
                <Link to={loginState === false ? "/login" : `/profile?id=${loginState}`}>
                    <li>
                        <p className="navIcon"><i class="fa-solid fa-user"></i></p>
                        <p className="navValue">マイページ</p>
                    </li>
                </Link>
                <Link to={`/followAndFollower?id=${loginState}`}>
                    <li>
                        <p className="navIcon"><i class="fa-solid fa-users"></i></p>
                        <p className="navValue">フォロー・フォロワー</p>

                    </li>
                </Link>
                <Link to={"/"}>
                    <li>
                        <p className="navIcon"><i class="fa-solid fa-bookmark"></i></p>
                        <p className="navValue">お気に入り</p>

                    </li>
                </Link>
                <Link to={"/reminder"}>
                    <li>
                        <p className="navIcon"><i class="fa-solid fa-bell"></i></p>

                        <p className="navValue">通知</p>

                    </li>
                </Link>
                <Link to={"/"}>
                    <li>
                        <p className="navIcon"><i class="fa-solid fa-gear"></i></p>
                        <p className="navValue">設定</p>
                    </li>
                </Link>
            </ul>
        </nav>
    )
}

export default LeftNav;