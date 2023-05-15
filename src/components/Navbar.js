//////////////////////////////////////////////////////////
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import logo from "../assets/LogoGeoMemoirs.png";
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import axios from "axios";
const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [userImg, setUserImg] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await axios.get(
        `https://geomemoirs-backend-sh52mcq4ba-oa.a.run.app/api/users/${currentUser.id}`
      );
      setUserImg(res.data.img);

      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
        </Link></div>
        <div className=" mt-4 mr-7 inline-block align-middle absolute " >
          {currentUser ? (
            <>
              <Link
                to={"/profile"}
                className="  "
              >
                <Avatar className="shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl" sx={{width: 96, height:96, bgcolor: red[500] }} src={userImg} aria-label="avatar"/>
              </Link>
              <Link
                to={"/"}
                onClick={logout}
              >
                <LogoutIcon/></Link>
             
            </>
          ) : (       <>
            <Link
              to={"/signin"}
              className="  "
            >
              <Avatar className="shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl" sx={{width: 96, height:96, bgcolor: red[500] }}  aria-label="avatar"/>
            </Link>
            <Link
              to={"/signin"}
            >
              <LoginIcon/></Link>
           
          </>
          )}
        </div>
      
    </div>
  );
};

export default Navbar;
