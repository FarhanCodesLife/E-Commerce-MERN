import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { UserProvider } from "./context/UserContext";
import PostList from "./components/AllPosts";
import CreatePost from "./components/CreatePost";
import PostDetail from "./components/SinglePost";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <nav>
          <Link to="/">Home</Link> | <Link to="/register">Register</Link> |{" "}
          <Link to="/login">Login</Link> | <Link to="/dashboard">Dashboard</Link>
          <Link to="/AllPosts">Posts</Link> |  <Link to="/logout">Logout</Link> |
          <Link to="/createPost">Create Post</Link>|

        </nav>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/AllPosts" element={<PostList />} />
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/logout" element={<Login />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
