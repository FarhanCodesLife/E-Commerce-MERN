import React, { useEffect, useState } from "react";
import axios from "axios";

const UserItem = ({ name, email }) => (
  <li className="flex justify-between p-4 bg-gray-50 rounded shadow-sm border">
    <span className="font-medium text-gray-700">{name}</span>
    <span className="text-gray-600">{email}</span>
  </li>
);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/all`);
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);


  const logout = async () => {
    try {
      const responce = await axios.post("http://localhost:5000/api/user/logout");
      console.log(responce.data);
      
      // window.location.href = "/login";
    } catch (err) {
      console.error("Failed to logout:", err.message);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Dashboard</h2>

        {error && (
          <div className="p-4 text-red-600 bg-red-100 border border-red-400 rounded mb-4">
            {error}
          </div>
        )}

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>

        <ul className="space-y-4">
          {currentUsers.length === 0 ? (
            <div className="text-gray-600 text-center">No users found</div>
          ) : (
            currentUsers.map((user) => (
              <UserItem key={user._id} name={user.name} email={user.email} />
            ))
          )}
        </ul>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded mr-2"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(users.length / usersPerPage))
              )
            }
            disabled={currentPage === Math.ceil(users.length / usersPerPage)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
