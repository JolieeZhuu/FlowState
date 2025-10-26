import React from "react";

const Login = () => {
  const handleGoogleLogin = () => {
    // Redirect to your backend
    window.location.href = "http://localhost:3000/google/login";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5">
        <div className="items-center">
            <h1>Login Page</h1>
        </div>
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
);
};

export default Login;