import React, { useState } from "react";
import { supabase } from "./supabase"; // Import Supabase client instance
import bcrypt from "bcryptjs"; // Import bcryptjs for password hashing

function LoginPage({ setAuthenticated }) {
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
      // Get user data from Supabase
      const { data, error } = await supabase
        .from("users")
        .select("email, password")
        .eq("email", email.trim())
        .single();

      if (error || !data) {
        setError("Invalid email or password");
        return;
      }

      // Compare unhashed password with provided password
      const isValidPassword = data.password === password.trim();

      if (!isValidPassword) {
        setError("Invalid email or password");
        return;
      }

      // Set authentication state if password is valid
      setAuthenticated(true);
    } catch (err) {
      console.error("Error signing in:", err.message);
      setError("An error occurred during login. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full p-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition duration-300"
          onClick={signIn}
        >
          Sign In
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
