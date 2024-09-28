import React, { useState, useEffect } from "react";
import "./Follow.css";
import LeftNav from "./LeftNav";
import RightNav from "./RightNav";
import { Link, useLocation } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import testIcon from "./images/userIcon/mikakunintouhikousyoujo.jpg";

function Follow() {
    const [postName, setPostName] = useState("");
    const [postText, setPostText] = useState("");

    const [followList, setFollowList] = useState([]);
    const [followerList, setFollowerList] = useState([]);

    const [loginState, setLoginState] = useState("");

    const location = useLocation();








    useEffect(() => {
        const param = new URLSearchParams(location.search);
        const formData = new FormData();
        formData.append("userId", param)
        fetch("http://localhost:5000/followList", {
            method: "POST",
            body: formData,
            credentials: "include",
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setFollowList(data.follow);
                setFollowerList(data.follower);
            })
    }, [location.search])




    return (
        <article className="followAndFollowerSection">
            <LeftNav />

            <section className="followAndFollowerList">
                <div className="change">
                    <button className="followListButton">フォロー</button>
                    <button className="followerListButton">フォロワー</button>
                </div>
                <div className="followList">

                    {followList.map((follow, index) => (
                        <div className="follow">
                            <div className="userIcon">
                                <img src={testIcon}></img>
                            </div>
                            <div className="nameId">
                                <p>{follow.name}</p>
                                <p>@{follow.userId}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <RightNav />

        </article>
    )
}

export default Follow;