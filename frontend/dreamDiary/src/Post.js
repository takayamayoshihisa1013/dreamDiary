import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import zzz from "./images/zzz.png"
import testIcon from "./images/userIcon/mikakunintouhikousyoujo.jpg"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLocation } from 'react-router-dom';
import "./Post.css";
import config from"./config/config";
import LeftNav from "./LeftNav";


function Post() {

    // スライダーの設定
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false
    };

    const [commentName, setCommentName] = useState("");
    const [commentText, setCommentText] = useState("");
    const [commentImages, setCommentImages] = useState([]);

    const [post_data, setPostData] = useState([]);
    const [commentData, setCommentData] = useState([])


    const [loginState, setLoginState] = useState("");


    const location = useLocation();

    const [postId, setPostId] = useState();



    useEffect(() => {

        const urlParams = new URLSearchParams(location.search);
        const postId = urlParams.get("postId");
        setPostId(postId);

        const postData = new FormData();
        postData.append("postId", postId)

        fetch(`${config.apiurl}/post`, {
            method: "POST",
            credentials: "include",
            body: postData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setPostData(data.post_data);
                setLoginState(data.loginState);
                setCommentData(data.commentList);
                // console.log(loginState);
            })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("commentText", commentText);
        formData.append("postId", postId)

        Array.from(commentImages).forEach(image => {
            formData.append("postImages", image)
            // console.log(image);
        });

        console.log(formData)


        fetch("http://localhost:5000/add_comment", {
            method: "POST",
            credentials: "include",
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    window.location.href = `/post?postId=${postId}`;
                }
                else {
                    alert("送信中に問題が発生しました")
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
        <article className="view">
            <LeftNav />
            <section className="postList">
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
                            <button type="submit" onClick={(e) => postPage(e, post.postId)}  className="commentButton"><i class="fa-regular fa-comment"></i></button>
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
                {commentData.map((comment, index) => (
                    <div className="comment">
                    <div className="commentHeader">
                        <div className="commentUserIcon">
                            <img src={testIcon}></img>
                        </div>
                        <p className="username">{comment.userId}</p>
                        <p className="commentTime">{comment.time}</p>
                    </div>
                    <div className="commentBody">
                        <p className="commentText">{comment.comment}</p>
                    </div>
                </div>
                ))}
            </section>
            <div className="right">
                <form onSubmit={""}>
                    <input placeholder="夢を見つける"></input>
                </form>
                <nav className="rightNav">
                    <form>
                    </form>
                    <ul>
                        <Link to={"/"}>
                            <li>

                                <p className="navIcon"><i class="fa-solid fa-heart"></i></p>
                                <p className="navValue">本日の人気夢</p>

                            </li>
                        </Link>
                        <Link to={"/"}>
                            <li>
                                <p className="navIcon"><i class="fa-solid fa-arrow-trend-up"></i></p>

                                <p className="navValue">急上昇</p>

                            </li>
                        </Link>
                        <Link to={"/"}>
                            <li>
                                <p className="navIcon"><i class="fa-solid fa-bookmark"></i></p>
                                <p className="navValue">フォロー中のユーザー</p>

                            </li>
                        </Link>
                    </ul>
                </nav>
                <button className="addPost" onClick={toggleForm}><i class="fa-solid fa-pencil"></i>コメントを書く</button>

            </div>
            {isFormButton && (
                <form className="addCommentForm" onSubmit={handleSubmit}>
                    <div className="addCommentFormDiv">
                        <div>
                            <p>コメントの内容</p>
                            <textarea onChange={(e) => setCommentText(e.target.value)}></textarea>
                        </div>
                        <div className="buttons">
                            <input type="file" multiple id="commentImages" onChange={(e) => setCommentImages(e.target.files)} />
                            <label className="commentImages" for="commentImages"><i class="fa-regular fa-image"></i>画像</label>
                            <button type="submit" className="addCommentSubmit"><i class="fa-solid fa-pencil"></i>ポストする</button>
                        </div>
                        <button type="button" className="formClose" onClick={toggleForm}><i class="fa-solid fa-xmark"></i></button>
                    </div>


                </form>
            )}

        </article>

    )
}

export default Post;