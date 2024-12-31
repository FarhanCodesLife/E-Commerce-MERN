import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/post/all");
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/post/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Failed to delete post:", error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">All Posts</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {posts.length === 0 ? (
            <p>No posts available.</p>
          ) : (
            <ul className="space-y-4">
              {posts.map((post) => (
                <li key={post._id} className="border p-4 rounded shadow-md">
                  <h3 className="text-xl font-semibold">{post.name}</h3>
                  <p className="text-gray-600">{post.description}</p>
                  <div className="mt-2">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                    <Link to={`/post/${post._id}`}>
                      <button className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-md">
                        View Post
                      </button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default PostList;
