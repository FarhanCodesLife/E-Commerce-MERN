import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/all`);
        setUsers(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error("Failed to fetch users:", error.response?.data?.message);

      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
