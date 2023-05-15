import React, { useState } from "react";

import logo from "../assets/MiniLogoGeoMemoirs.png";
import omarPhoto from "../assets/omar.jpg";
import { Link } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { red } from "@mui/material/colors";
function About() {
  return (
    <div>
  <div className="text-center mt-10">
          <div className="flex items-center justify-center mb-4">
            <a
              href="https://omarghamrawi.net/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Tooltip title="Check My Website">
                <Avatar
                  className="shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
                  src={omarPhoto}
                  sx={{ width: 96, height: 96, bgcolor: red[500] }}
                  aria-label="avatar"
                />
              </Tooltip>
            </a>
          </div>

          <div className="flex items-center justify-center mb-4">
            <div>
              <h3 className="text-lg font-bold">Built by Omar Ghamrawi</h3>
              <p className="text-gray-700">
                A Software Engineer and student at Boğaziçi University.
                Developed GeoMemoirs as a project for SWE-573.
              </p>
            </div>
          </div>
      <div className="flex flex-col items-center justify-center mt-5">
        <div className="text-center">
          <p className="text-base text-gray-700 mb-8">
            GeoMemoirs is a platform for users around the world to share their
            Stories and Memories around the world. With a Map view and Year
            indicator GeoMemoirs keeps users memories alive, and accessible to
            others to read and react to!
          </p>
        </div>
        
      

          <div className="flex items-center justify-center mb-4">
            <div className="mr-4"></div>
            <div>
              <h3 className="text-lg font-bold">
                Built Using ReactJS, NodeJS, MYSQL
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-center mb-4">
            <div className="mr-4">
              
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col border items-center justify-center ">
        <img src={logo} alt="Logo" className="h-28" />
        
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-8">
            Discover the world through the memories of others with Geomemoir.
            Immerse yourself in unique stories and experiences shared by users
            from all over the globe, each one tied to a specific location on the
            map. Create your own memory and leave your mark on the world, or
            explore the stories of others and connect with people through shared
            experiences. With Geomemoir, the world is at your fingertips.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
