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

    const [showList, setShowList] = useState(true);






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
                    <button className="followListButton" onClick={() => setShowList(true)}>フォロー</button>
                    <button className="followerListButton" onClick={() => setShowList(false)}>フォロワー</button>
                </div>
                <div className="followList">
                    {showList ?
                        followList.map((follow, index) => (
                            <div className="follow">
                                <a href={`http://localhost:3000/profile?id=${follow.userId}`}>
                                    <div className="userIcon">
                                        <img src={testIcon}></img>
                                    </div>
                                    <div className="nameId">
                                        <p>{follow.name}</p>
                                        <p>@{follow.userId}</p>
                                    </div>
                                </a>
                            </div>
                        ))
                        :
                        followerList.map((follower, index) => (
                            <div className="follow">
                                <a href={`http://localhost:3000/profile?id=${follower.userId}`}>
                                    <div className="userIcon">
                                        <img src={testIcon}></img>
                                    </div>
                                    <div className="nameId">
                                        <p>{follower.name}</p>
                                        <p>@{follower.userId}</p>
                                    </div>
                                </a>
                            </div>
                        ))
                    }


                </div>
            </section>
            <RightNav />

        </article>
    )
}

export default Follow;