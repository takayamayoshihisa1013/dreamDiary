import React, { useState, useEffect } from "react";
import "./Follow.css";
import LeftNav from "./LeftNav";
import RightNav from "./RightNav";
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import testIcon from "./images/userIcon/mikakunintouhikousyoujo.jpg";

function Follow() {
    const [postName, setPostName] = useState("");
    const [postText, setPostText] = useState("");
    const [postImages, setPostImages] = useState([]);

    const [post_data, setPostData] = useState([]);

    const [loginState, setLoginState] = useState("");

    const navigate = useNavigate();

    // スライダーの設定
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false
    };

    useEffect(() => {
        const formData = new FormData();
        formData.append("page", "top")
        fetch("http://localhost:5000/post_data", {
            method: "POST",
            credentials: "include",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setPostData(data.post_data);
                setLoginState(data.loginState);
            })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("postName", postName)
        formData.append("postText", postText)

        Array.from(postImages).forEach(image => {
            formData.append("postImages", image)
            // console.log(image);
        });

        console.log(formData)


        fetch("http://localhost:5000/add_post", {
            method: "POST",
            credentials: "include",
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    window.location.href = "/";
                }
                else {
                    alert("送信中に問題が発生しました");
                }
            }
            )
    }

    // ポストフォーム
    const [isFormButton, setIsFormButton] = useState(false);

    const toggleForm = () => {
        setIsFormButton(!isFormButton)
    }

    // いいね機能
    const heartButton = (e, postId) => {
        e.preventDefault();

        if (loginState === false) {
            window.location.href = "/login"
        }

        var postId = e.currentTarget.value;
        console.log("like", postId);

        // 反転処理
        setPostData(prevData =>
            prevData.map(post =>
                post.postId === postId ?
                    {
                        ...post,
                        favorite: !post.favorite,
                        likeCount: post.favorite ? post.likeCount - 1 : post.likeCount + 1
                    }
                    : post
            )
        );

        const likeData = new FormData();
        likeData.append("postId", postId);

        fetch("http://localhost:5000/like", {
            method: "POST",
            credentials: "include",
            body: likeData,
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
    }

    const postPage = (e, postId) => {
        e.preventDefault();
        window.location.href = `http://localhost:3000/post?postId=${postId}`;
    }

    // ブックマーク
    const bookMarkButton = (e, postId) => {
        e.preventDefault();

        if (loginState === false) {
            window.location.href = "/login"
        }
        var bookMark = e.currentTarget.value;

        setPostData(prevData =>
            prevData.map(post =>
                post.postId === postId ?
                    {
                        ...post,
                        bookmark: !post.bookmark
                    }
                    : post
            )
        );

        const bookMarkForm = new FormData();
        bookMarkForm.append("bookmark", bookMark)
        console.log(bookMark);



        fetch("http://localhost:5000/bookmark", {
            method: "POST",
            credentials: "include",
            body: bookMarkForm,
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
    }
    return (
        <article className="followAndFollower">
            <LeftNav />

            <section className="followAndFollowerList">
                <div className="change">
                    <button className="followListButton">フォロー</button>
                    <button className="followerListButton">フォロワー</button>
                </div>
                <div className="followList">
                    <div className="follow">
                        <div className="reminderType">
                            <i class="fa-solid fa-heart fa-bounce heart" style={{color: "pink"}}></i>
                        </div>
                        <p className="reminderText">
                            るらりゆさんがいいねしました。
                        </p>
                    </div>
                    <div className="follow">
                        <div className="reminderType">
                        <i class="fa-solid fa-comment fa-bounce" style={{color: "#74C0FC"}}></i>
                        </div>
                        <p className="reminderText">
                            コメントされました
                        </p>
                    </div>
                </div>
            </section>
            <RightNav />

        </article>
    )
}

export default Follow;