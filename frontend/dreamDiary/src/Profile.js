import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import zzz from "./images/zzz.png"
import testIcon from "./images/userIcon/mikakunintouhikousyoujo.jpg";
import { useLocation } from 'react-router-dom';
import LeftNav from "./LeftNav";
import RightNav from "./RightNav";

function Profile() {

    const [postName, setPostName] = useState("");
    const [postText, setPostText] = useState("");
    const [postImages, setPostImages] = useState([]);

    const [post_data, setPostData] = useState([]);

    const [loginState, setLoginState] = useState("");

    const [profile, setProfile] = useState([])

    const navigate = useNavigate();

    const location = useLocation();

    const [follow, setFollow] = useState(false)

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

        const params = new URLSearchParams(location.search);
        console.log(location.search);
        const formData = new FormData();
        formData.append("id", params.get("id"));
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
        fetch("http://localhost:5000/profile", {
            method: "POST",
            credentials: "include",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                setProfile(data.profile);
                setFollow(data.follow);
            })
    }, [location.search])

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("postName", postName);
        formData.append("postText", postText);

        Array.from(postImages).forEach(image => {
            formData.append("postImages", image)
            // console.log(image);
        });

        console.log(formData);

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

    const followSubmit = (e) => {
        e.preventDefault();
        const param = new URLSearchParams(location.search);
        const formData = new FormData();
        formData.append("userId", param.get("id"));
        fetch("http://localhost:5000/follow", {
            method: "POST",
            credentials: "include",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setFollow(!follow);
                    setProfile((prevProfile) => ({
                        ...prevProfile,
                        followerNum: follow ? profile.followerNum - 1 : prevProfile.followerNum + 1
                    }))
                }
            })
    }

    return (
        <article className="view">
            <LeftNav />
            <section className="postList">
                <div className="profile">
                    <div className="profileBackImage">
                        <img src={testIcon}></img>
                    </div>
                    <div className="profileIcon">
                        <img src={testIcon}></img>
                        {loginState !== profile.id &&
                            <button
                                className="followButton"
                                style={follow ? { "backgroundColor": "black" } : { "backgroundColor": "#FFFF" }}
                                onClick={followSubmit}
                            >
                                フォローする
                            </button>
                        }
                    </div>
                    <h1 className="profileName">{profile.name}</h1>
                    <div className="followAndFollower">
                        <div className="follow">
                            <p className="profileNum">follow:</p>
                            <p>{profile.followNum}</p>
                        </div>
                        <div className="follower">
                            <p className="profileNum">follower:</p>
                            <p>{profile.followerNum}</p>
                        </div>
                    </div>
                    <div className="profileText">
                        <p>{profile.profileText}</p>
                    </div>

                </div>
                {post_data.map((post, index) => (
                    <div className="post">
                        <div className="postHeader">
                            <div className="postUserIcon">
                                <img src={testIcon}></img>
                            </div>


                            <p className="username">{post.username}</p>
                            <p className="postTime">{post.datetime}</p>
                        </div>
                        <div className="postBody">
                            <p className="postTitle"><span>title:</span>{post.postTitle}</p>
                            <p className="postText">{post.postText}</p>
                            <Slider {...settings}>
                                {post.postImages.map((image, index) => (
                                    <div className="postImageDiv">
                                        <img src={`http://localhost:5000/static/images/postImages/${image}`}></img>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                        <form className="postFooter">
                            <button type="submit" onClick={(e) => heartButton(e, post.postId)} value={post.postId} className="favoriteButton">
                                <p>{post.favorite === true
                                    ? <i class="fa-solid fa-heart"></i>
                                    : <i class="fa-regular fa-heart"></i>
                                }</p>
                                <p className="likeNum">{post.likeCount}</p>
                            </button>
                            <button type="submit" onClick={(e) => postPage(e, post.postId)}><i class="fa-regular fa-comment"></i></button>
                            <button type="submit" onClick={(e) => bookMarkButton(e, post.postId)} value={post.postId} className="bookmark">
                                {post.bookmark === true
                                    ? <i class="fa-solid fa-bookmark"></i>
                                    : <i class="fa-regular fa-bookmark"></i>
                                }
                            </button>
                            <button type="submit"><i class="fa-solid fa-share-nodes"></i></button>
                        </form>
                    </div>
                ))}
            </section>
            <RightNav />

        </article>

    )
}

export default Profile;