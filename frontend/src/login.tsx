import React from "react";

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/google/login";
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-10 w-[90%] max-w-md flex flex-col items-center gap-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-indigo-600">
          FlowState
        </h1>
        <p className="text-lg font-medium text-gray-600">Sign in to continue</p>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl shadow-md hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google Logo"
            className="w-6 h-6"
          />
          Sign in with Google
        </button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          By signing in, you agree to our{" "}
          <a href="#" className="text-indigo-500 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-indigo-500 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
