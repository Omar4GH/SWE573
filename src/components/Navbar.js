//////////////////////////////////////////////////////////
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
<br/><br/>
      <Link to={"/"} className="cursor-pointer">
        Logo
      </Link>
      <br/><br/><br/><br/>
      <div className="bar">
        <Link to={"/"} className="p-2 cursor-pointer">
          <div className="navTitle">Home</div>
        </Link>
        
        <Link to={"/profile"} className="p-2 cursor-pointer">
        <div className="navTitle">Profile</div>
        </Link>
        <Link to={"/login"} className="p-2 cursor-pointer">
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