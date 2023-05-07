import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/LogoGeoMemoirs.png";

function Register() {

const [err,setError] = useState(null);
const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });

  

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
      navigate("/signin");
    } catch (err) {
      setError(err.response.data);
    }
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  console.log(inputs);

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="bg-image w-full h-full"></div>
      <div className="justify-center text-center flex"><img className="w-72 h-72" src={logo}/></div>
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl lg:max-w-xl">
        <h1
          className="text-3xl font-semibold text-center uppercase"
          style={{ color: "#7d7059" }}
        >
          Sign Up
        </h1>
        <form className="mt-6" onSubmit={submit}>
          <div className="mb-2">
            <label
              for="username"
              className="block text-sm font-semibold text-gray-800"
            >
              Username
            </label>
            <input
              required
              type="text"
              className="block w-full px-4 py-2 mt-2 text-orange-300 bg-white border rounded-md focus:border-orange-200 focus:ring-orange-100 focus:outline-none focus:ring focus:ring-opacity-40"
              name="username"
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label
              for="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Email
            </label>
            <input
              required
              type="text"
              className="block w-full px-4 py-2 mt-2 text-orange-300 bg-white border rounded-md focus:border-orange-200 focus:ring-orange-100 focus:outline-none focus:ring focus:ring-opacity-40"
              name="email"
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
              required
              type="password"
              className="block w-full px-4 py-2 mt-2 text-orange-300 bg-white border rounded-md focus:border-orange-200 focus:ring-orange-100 focus:outline-none focus:ring focus:ring-opacity-40"
              name="password"
              onChange={handleChange}
            />
          </div>
{err && <p>{err}</p>}
          <div className="mt-6">
            <button className="w-full px-4 py-2 tracking-wide bg-orange-200 text-white transition-colors duration-200 transform submit-btn rounded-md hover:bg-orange-100 focus:outline-none focus:bg-purple-600">
              Register
            </button>
          </div>
        </form>

        <p className="mt-8 text-xs font-light text-center text-gray-700">
          {" "}
          Already have an account?{" "}
          <Link
            to={"/signin"}
            className="font-medium hover:underline"
            style={{ color: "#D1345B" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
