import React from "react";

const Login = () => {
  const handleGoogleLogin = () => {
    // Redirect to your backend
    window.location.href = "http://localhost:3000/google/login";
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;