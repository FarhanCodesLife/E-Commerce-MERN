import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/login`,
        formData,
        {
          withCredentials: true,
        }
      );
      setUser(response.data.user);
      console.log(response.data);
      

      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return  (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Login to Your Account
            </h2>
            {error && (
              <div className="p-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-indigo-600 hover:underline">
                Register here
              </a>
            </p>
          </div>
        </div>
      );
};

export default Login;
