import React, { useState } from "react";
import { supabase } from "./supabase";

const LoginPage = ({ setAuthenticated, setIsAdmin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signIn = async () => {
    setError(""); // Reset error before attempting sign-in

    if (email.trim() === "" || password.trim() === "") {
      setError("Email and password are required");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("email, password, is_admin")
        .eq("email", email.trim())
        .single();

      if (error || !data) {
        setError("Invalid email or password");
        return;
      }

      if (data.password !== password.trim()) {
        setError("Invalid email or password");
        return;
      }

      setAuthenticated(true);
      setIsAdmin(data.is_admin); // Set admin status based on login
    } catch (err) {
      console.error("Error signing in:", err.message);
      setError("An error occurred during login. Please try again later.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default behavior
      signIn(); // Trigger login
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen p-5 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col w-full md:w-1/3">
        <h1 className="text-3xl font-semibold mb-4 text-center text-gray-800">
          Sign In
        </h1>
        <form onKeyDown={handleKeyDown}>
          {" "}
          {/* Handle Enter key */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="email"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className="shadow border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500 transition duration-150"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              className="shadow border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500 transition duration-150"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
              type="button"
              onClick={signIn}
            >
              Login
            </button>
          </div>
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
