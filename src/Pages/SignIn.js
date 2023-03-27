import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function SignIn({ setToken }) {
  const [err,setError] = useState(null);
  const navigate = useNavigate();
  
    const [inputs, setInputs] = useState({
      username: "",
      password: "",
    });
  
    
  
    const submit = async (e) => {
      e.preventDefault();
      try {
        await axios.post("http://localhost:8800/api/auth/login", inputs);
        navigate("/");
      } catch (err) {
        setError(err.response.data);
      }
    };
  
    const handleChange = (e) => {
      setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
  
  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden ">
      <div className="bg-image w-full h-full"></div>
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl lg:max-w-xl">
        <h1
          className="text-3xl font-semibold text-center uppercase"
          style={{ color: "#D1345B" }}
        >
          Sign in
        </h1>
        <div className="text-red-600">{err}</div>
        <form className="mt-6" onSubmit={submit}>
          <div className="mb-2">
            <label
              for="username"
              className="block text-sm font-semibold text-gray-800"
            >
              Username
            </label>
            <input
              required name="username" type="text"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
              
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label
              for="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Password
            </label>
            <input
              required name="password" type="password"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
             
              onChange={handleChange}
            />
          </div>
          {/* <a href="#" className="text-xs text-purple-600 hover:underline">
            Forget Password?
          </a> */}
          {err && <p>{err}</p>}
          <div className="mt-6">
            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600 submit-btn">
              Login
            </button>
          </div>
        </form>

        <p className="mt-8 text-xs font-light text-center text-gray-700">
          {" "}
          Don't have an account?{" "}
          <Link to={"/register"} className="font-medium hover:underline">
            <span style={{ color: "#D1345B" }}> Sign up</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
