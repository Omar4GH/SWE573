import React, { useEffect, useState } from "react";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import "../scss/style.scss";
import Navbar from "../components/Navbar";
import  NominatimGeocoder  from 'nominatim-geocoder';
import { AuthContext } from "../context/authContext";


function Story() {
  const [story, setStory] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const geoConvert = new NominatimGeocoder();

  const [lat, setLat] = useState(); 
  const [lon, setLon] = useState();
  const [address, setAddress] = useState("");

  const storyId = location.pathname.split("/")[2];
  const {currentUser} = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/story/${storyId}`);
        setStory(res.data);
       // console.log(res.data);  
        const [latStr, lonStr] = res.data.geocode.split(","); 
        setLat(parseFloat(latStr.trim())); 
        setLon(parseFloat(lonStr.trim())); 

      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [storyId]);


  useEffect(() => {
    if (lat && lon) {
      geoConvert.reverse({ lat, lon }).then((response) => {
        const city = response.address.city || response.address.town || response.address.village;
        const country = response.address.country;
        if(country === "Israel"){
          setAddress(`${city}, Palestine`);
        }else{
        setAddress(`${city}, ${country}`);}
        console.log(`${city}, ${country}`);
      });
    }
  }, [lat, lon]);




  const handleDelete = async () => {
    try {
     await axios.delete(`http://localhost:8800/api/story/${storyId}`);
     navigate("/");


    } catch (err) {
      console.log(err);
    }

  };



  return (
    <div>
      <div className="single">
        <div className="content">
          <br />{" "}
          <div className="user">
            <img
              src={story.userImg}
              alt=""
            />

            <div className="info">
              <span>{story.username}</span>
              <p>Posted {moment(story.postdate).fromNow()}</p>
            </div>
{currentUser && currentUser.username === story.username && (
            <div className="edit">
              <Link to={`/writepost?edit=2`} state={story}>
                <Edit />
              </Link>
              <Delete onClick={handleDelete} />
            </div>)
}
            <div className="float-right right-96 text-right text-base m-0 absolute text-gray-700">{address} &nbsp;&nbsp; {story.year}</div>
          </div><h1>{story.title}</h1>
          <img
            src={story.img}
            alt=""
          />
          
          
{story.content}
          {" "}
        </div>
      </div>
    </div>
  );
}

export default Story;
