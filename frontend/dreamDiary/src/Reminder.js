import React, { useState, useEffect } from "react";
import "./Reminder.css";
import LeftNav from "./LeftNav";
import RightNav from "./RightNav";
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';

function Follow() {

    const [reminderList, setReminderList] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/reminder", {
            method: "POST",
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    setReminderList(data.reminderData);
                }
                else {
                    alert("通知の取得に失敗しました。")
                }
            })
    }, [])




    return (
        <article className="reminder">
            <LeftNav />

            <section className="reminderListSection">
                <div className="reminderList">
                    
                    {reminderList.map((reminder, index) => (
                        reminder.type === "favorite" ? (
                            <div className="favorite reminders" key={index}>
                                <div className="reminderType">
                                    <i className="fa-solid fa-heart fa-bounce heart" style={{ color: "pink" }}></i>
                                </div>
                                <p className="reminderText">
                                    {reminder.userName}さんがいいねしました
                                </p>
                            </div>
                        ) : reminder.type === "comment" ? (
                            <div className="comment reminders" key={index}>
                                <div className="reminderType">
                                    <i className="fa-solid fa-comment fa-bounce" style={{ color: "#74C0FC" }}></i>
                                </div>
                                <p className="reminderText">
                                    {reminder.userName}さんがコメントしました
                                </p>
                            </div>
                        ) : reminder.type === "follow" ? (
                            <div className="follow reminders" key={index}>
                                <div className="reminderType">
                                    <i className="fa-solid fa-user-plus fa-bounce"></i>
                                </div>
                                <p className="reminderText">
                                    {reminder.userName}さんにフォローされました
                                </p>
                            </div>
                        ) : null
                    ))}

                </div>
            </section>
            <RightNav />

        </article>
    )
}

export default Follow;