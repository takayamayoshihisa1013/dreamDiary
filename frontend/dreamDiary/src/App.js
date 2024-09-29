import React from "react";
import './App.css';
import Header from "./Header";
import View from "./View";
import Login from "./Login";
import Signup from "./Signup"; // サインアップページを想定
import Post from "./Post";
import Profile from "./Profile";
import Follow from "./Follow";
import Reminder from "./Reminder";
import DayFavoritePost from "./DayFavoritePost";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      {/* 現在のパスが "/login" または "/signup" でない場合に Header を表示 */}
      {location.pathname !== "/login" && location.pathname !== "/signup" && <Header />}
      <Routes>
        <Route path="/" element={<View />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> {/* サインアップルート */}
        <Route path="/post" element={<Post />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/followAndFollower" element={<Follow />} />
        <Route path="/dayFavoritePost" element={<DayFavoritePost />} />
        <Route path="/reminder" element={<Reminder />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;