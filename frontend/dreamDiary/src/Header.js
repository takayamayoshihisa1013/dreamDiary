import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./Header.css";
import zzz from "./images/zzz.png";
import testIcon from "./images/userIcon/mikakunintouhikousyoujo.jpg";

function BottomNav() {

    // ユーザーメニュー
    const [isMenuButton, setIsMenuButton] = useState(false);



    const toggleMenu = () => {
        setIsMenuButton(!isMenuButton)
    }



    return (
        <>
            <header>
                <div className="logo">Dream Diary</div>
                <nav>
                    <ul>
                        <Link to={"/"}>
                            <li>
                                <div>
                                    <img src={zzz}></img>
                                </div>

                                <p>夢を見る</p>
                            </li>
                        </Link>
                        <Link to={"/"}>
                            <li>
                                <div>
                                    <img src={zzz}></img>
                                </div>

                                <p>フォロー・フォロワー</p>
                            </li>
                        </Link>
                        <Link to={"/"}>
                            <li>
                                <div>
                                    <img src={zzz}></img>
                                </div>

                                <p>通知</p>
                            </li>
                        </Link>
                        <li className="user">
                            <p id="userIcon" onClick={toggleMenu}><i class="fa-solid fa-circle-user"></i></p>


                        </li>
                    </ul>

                </nav>
            </header>
            {isMenuButton && (
                <div className="menu">
                    <nav>
                        <ul>
                            <div className="userIcon">
                                <img src={testIcon}></img>
                            </div>
                            <Link to={"/login"}>
                                <li>
                                    <p className="menuIcon"><i class="fa-solid fa-right-to-bracket"></i></p>
                                    <p>ログイン</p>
                                </li>
                            </Link>
                            <Link to={"/signup"}>
                                <li>
                                    <p className="menuIcon"><i class="fa-solid fa-right-to-bracket"></i></p>
                                    <p>サインアップ</p>
                                </li>
                            </Link>
                            <Link to={"/"}>
                                <li>
                                    <p className="menuIcon"><i class="fa-solid fa-gear"></i></p>
                                    <p>設定</p>
                                </li>
                            </Link>
                        </ul>
                    </nav>
                    <button type="button" className="menuClose" onClick={toggleMenu}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            )}
        </>
    );
}

export default BottomNav;
