//////////////////////////////////////////////////////////
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to={"/"} className="cursor-pointer">
        Logo
      </Link>
      <div className="bar">
        <Link to={"/"} className="p-2 cursor-pointer">
          <div className="navTitle">Home</div>
        </Link>
        
        <Link to={"/profile"} className="p-2 cursor-pointer">
        <div className="navTitle">Profile</div>
        </Link>
        <Link to={"/signin"} className="p-2 cursor-pointer">
        <div className="navTitle">Login</div>
        </Link>
        <Link to={"/story"} className="p-2 cursor-pointer">
        <div className="navTitle">Story</div>
        </Link>
        
        <Link to={"/about"} className="p-2 cursor-pointer">
        <div className="navTitle">About</div>
        </Link>

        <Link to={"/writepost"} className="p-2 cursor-pointer">
        <div className="navTitle">Write Post</div>
        </Link>


      </div>
      


    </div>
  );
};

export default Navbar;