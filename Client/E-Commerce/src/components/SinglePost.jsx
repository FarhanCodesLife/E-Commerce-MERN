import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PostDetail = () => {
  const { id } = useParams(); // Get the post ID from URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/post/${id}`);
        setPost(response.data);
        console.log(response.data);
        
      } catch (error) {
        setError("Post not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return <div>Loading post...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {error && <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">{error}</div>}
      
      {post && (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-4xl font-bold mb-4">{post.name}</h1>
          <img src={post.images} alt={post.name} className="w-full rounded-md mb-4" />
          <p className="text-lg text-gray-700 mb-4">{post.description}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold text-green-600">${post.price}</span>
            <span className="text-sm text-gray-500">Stock: {post.stock}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
