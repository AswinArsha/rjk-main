import React, { useState } from "react";
import { supabase } from "./supabase";

const LoginPage = ({ setAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signIn = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    setError("");

    if (email.trim() === "" || password.trim() === "") {
      setError("Email and password are required");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("email, password")
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
    } catch (err) {
      console.error("Error signing in:", err.message);
      setError("An error occurred during login. Please try again later.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      signIn(e);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen p-5 bg-gray-100">
      <div className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 flex flex-col w-full md:w-1/3">
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Admin Login
        </h1>
        <form onSubmit={signIn}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 hover:bg-green-700 text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
          </div>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
