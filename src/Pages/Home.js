import React from "react";
import Navbar from "../components/Navbar";

import logo from '../assets/MiniLogoGeoMemoirs.png';
import { Link } from "react-router-dom";

//http://localhost:8800/api
//https://geomemoirs-backend-sh52mcq4ba-oa.a.run.app/api


function Home() {
    

 

    return (
        <div className="flex flex-col items-center justify-center ">
        <img src={logo} alt="Logo" className="h-96" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to GeoMemoirs!
        </h1>
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-8">
            Discover the world through the memories of others with Geomemoir. 
            Immerse yourself in unique stories and experiences shared by users from all over the globe, each one tied to a specific location on the map. 
            Create your own memory and leave your mark on the world, or explore the stories of others and connect with people through shared experiences. 
            With Geomemoir, the world is at your fingertips.
          </p>
        </div>
        <Link to="/feed">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Start Browsing
          </button>
        </Link>
      </div>
      
    );
  

}

export default Home;
