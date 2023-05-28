//////////////////////////////////////////////////////////
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import logo from "../assets/LogoGeoMemoirs.png";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";

import _axios from "../api/_axios";
const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [userImg, setUserImg] = useState("");
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await _axios.get(
        `users/${currentUser.id}`
      );
      setUserImg(res.data.img);

     // console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const [showNavbar, setShowNavbar] = useState(false);

  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <>
      {isMobile ? (<>
        <div className="w-full bg-orange-800 text-white p-2 relative">
  <button
    className="text-white absolute top-2 left-2"
    onClick={toggleNavbar}
  >
    {showNavbar ? "Close" : "Menu"}
  </button>
  <Link to={"/"} className="cursor-pointer">
    <img className="w-16" src={logo} alt="logo" />
  </Link>
  <div
    className={`${
      showNavbar ? "" : "hidden"
    } absolute top-14 left-0 w-full bg-orange-300`}
  >
    <div className="flex flex-col">
      <Link to={"/"} className="p-2 cursor-pointer">
        <div className="">Home</div>
      </Link>
      <Link to={"/feed"} className="p-2 cursor-pointer">
        <div className="">Feed</div>
      </Link>
      <Link to={"/about"} className="p-2 cursor-pointer">
        <div className="">About</div>
      </Link>
      <Link to={"/writepost"} className="p-2 cursor-pointer">
        <div className="">Write Post</div>
      </Link>
    </div>
  </div>
  <div className="absolute top-2 right-2">
    {currentUser ? (
      <>
        <Link to={"/profile"} className="">
          <Avatar
            className="shadow-md "
            sx={{ width: 46, height: 46, bgcolor: red[500] }}
            src={userImg}
            aria-label="avatar"
          />
        </Link>
        <Link to={"/"} onClick={logout}>
          <LogoutIcon />
        </Link>
      </>
    ) : (
      <>
        <Link to={"/signin"} className="">
          <Avatar
            className="shadow-md "
            sx={{ width: 46, height: 46, bgcolor: red[500] }}
            aria-label="avatar"
          />
        </Link>
        <Link to={"/signin"}>
          <LoginIcon />
        </Link>
      </>
    )}
  </div>
</div>
</>
      ) : (
        <div className="navbar">
          <div className="bar">
            <Link to={"/"} className="p-2 cursor-pointer">
              <div className="navTitle">Home</div>
            </Link>
            <Link to={"/feed"} className="p-2 cursor-pointer">
              <div className="navTitle">Feed</div>
            </Link>
          </div>
          <Link to={"/"} className="cursor-pointer">
            <img className="navBarLogo" src={logo} />
          </Link>
          <div className="bar">
            <Link to={"/about"} className="p-2 cursor-pointer">
              <div className="navTitle">About</div>
            </Link>

            <Link to={"/writepost"} className="p-2 cursor-pointer">
              <div className="navTitle">Write Post</div>
            </Link>
          </div>
          <div className=" mt-4 mr-7 inline-block align-middle absolute ">
            {currentUser ? (
              <>
                <Link to={"/profile"} className="  ">
                  <Avatar
                    className="shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
                    sx={{ width: 96, height: 96, bgcolor: red[500] }}
                    src={userImg}
                    aria-label="avatar"
                  />
                </Link>
                <Link to={"/"} onClick={logout}>
                  <LogoutIcon />
                </Link>
              </>
            ) : (
              <>
                <Link to={"/signin"} className="  ">
                  <Avatar
                    className="shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
                    sx={{ width: 96, height: 96, bgcolor: red[500] }}
                    aria-label="avatar"
                  />
                </Link>
                <Link to={"/signin"}>
                  <LoginIcon />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
