import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/post/all?page=${page}&limit=3`
        );
        if (response.data && Array.isArray(response.data.posts)) {
          setPosts(response.data.posts);
          setTotalPages(response.data.totalPages);
        } else {
          setPosts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/post/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Failed to delete post:", error.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-center mb-8 text-blue-600">
        All Posts
      </h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="spinner"></div> {/* Add a custom loading spinner */}
        </div>
      ) : (
        <div>
          {posts.length === 0 ? (
            <p className="text-center text-lg text-gray-500">
              No posts available.
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <li
                  key={post._id}
                  className="bg-white shadow-lg rounded-lg p-6 flex flex-col transition-transform transform hover:scale-105 hover:shadow-2xl"
                >
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    {post.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.description}</p>
                  <div className="mt-auto flex justify-between items-center">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all"
                    >
                      Delete
                    </button>
                    <Link to={`/post/${post._id}`}>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all">
                        View Post
                      </button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination controls */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-6 py-2 bg-gray-300 text-white rounded-md hover:bg-gray-400 disabled:opacity-50 transition-all"
            >
              Prev
            </button>
            <span className="text-lg text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-6 py-2 bg-gray-300 text-white rounded-md hover:bg-gray-400 disabled:opacity-50 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;
