//////////////////////////////////////////////////////////
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import logo from "../assets/LogoGeoMemoirs.png";
const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="bar">
        <Link to={"/"} className="p-2 cursor-pointer">
          <div className="navTitle">Home</div>
        </Link>
        <Link to={"/feed"} className="p-2 cursor-pointer">
          <div className="navTitle">Feed</div>
        </Link>

        <Link to={"/profile"} className="p-2 cursor-pointer">
          <div className="navTitle">Profile</div>
        </Link>
      </div>
      <Link to={"/"} className="cursor-pointer">
        <img className="navBarLogo" src={logo} />
      </Link>
      <div className="bar">
        <Link to={"/story"} className="p-2 cursor-pointer">
          <div className="navTitle">Story</div>
        </Link>

        <Link to={"/about"} className="p-2 cursor-pointer">
          <div className="navTitle">About</div>
        </Link>

        <Link to={"/writepost"} className="p-2 cursor-pointer">
          <div className="navTitle">Write Post</div>
        </Link></div>
        <div className=" float-right mr-7 inline-block absolute" >
          {currentUser ? (
            <>
              <Link
                to={"/profile"}
                className=" navItem p-2 cursor-pointer float-right mr-7"
              >
                <Avatar sx={{ bgcolor: red[500] }} src={currentUser.img} aria-label="avatar"/>
              </Link>

              <Link
                onClick={logout}
                className="navItem  p-2 cursor-pointer float-right mr-7"
              >
                <div>Logout</div>
              </Link>
            </>
          ) : (<div className="absolute float-right  ">
            <Link to={"/signin"} className="  p-2 cursor-pointer">
              <div className="navTitle float-right mr-7">Login</div>
            </Link></div>
          )}
        </div>
      
    </div>
  );
};

export default Navbar;
