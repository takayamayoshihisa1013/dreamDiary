import { useState } from 'react';
import { Link } from 'react-router-dom';
import "./RightNav.css";

function RightNav() {
    const [isFormButton, setIsFormButton] = useState(false);
    const [postName, setPostName] = useState("");
    const [postText, setPostText] = useState("");
    const [postImages, setPostImages] = useState([]);

    // フォームの表示・非表示を切り替える関数
    const toggleForm = () => {
        setIsFormButton(!isFormButton);
    };

    // フォームの送信ハンドラー
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

    return (
        <>
        <div className="right">
            <form onSubmit={""}>
                <input placeholder="夢を見つける"></input>
            </form>
            <nav className="rightNav">
                <ul>
                    <Link to={"/"}>
                        <li>
                            <p className="navIcon"><i className="fa-solid fa-heart"></i></p>
                            <p className="navValue">本日の人気夢</p>
                        </li>
                    </Link>
                    <Link to={"/"}>
                        <li>
                            <p className="navIcon"><i className="fa-solid fa-arrow-trend-up"></i></p>
                            <p className="navValue">急上昇</p>
                        </li>
                    </Link>
                    <Link to={"/"}>
                        <li>
                            <p className="navIcon"><i className="fa-solid fa-bookmark"></i></p>
                            <p className="navValue">フォロー中のユーザー</p>
                        </li>
                    </Link>
                </ul>
            </nav>
            <button className="addPost" onClick={toggleForm}>
                <i className="fa-solid fa-feather"></i> ポストする
            </button>

            
        </div>
        {isFormButton && (
            <form className="addPostForm" onSubmit={handleSubmit}>
                <div className="addPostFormDiv">
                    <div>
                        <p>夢のタイトル</p>
                        <input type="text" onChange={(e) => setPostName(e.target.value)} />
                    </div>
                    <div>
                        <p>夢の内容</p>
                        <textarea onChange={(e) => setPostText(e.target.value)}></textarea>
                    </div>
                    <div className="buttons">
                        <input type="file" multiple id="postImages" onChange={(e) => setPostImages(e.target.files)} />
                        <label className="postImages" htmlFor="postImages"><i className="fa-regular fa-image"></i>画像</label>
                        <button type="submit" className="addPostSubmit"><i className="fa-solid fa-pencil"></i>ポストする</button>
                    </div>
                    <button type="button" className="formClose" onClick={toggleForm}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </form>
        )}
        </>
    );
}

export default RightNav;
