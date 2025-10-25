// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userData = params.get("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <img src={user?.picture} alt="profile" />
      <p>{user?.email}</p>
    </div>
  );
};

export default Dashboard;
