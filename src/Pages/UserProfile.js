import React, { useEffect, useState } from "react";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import { useParams } from 'react-router-dom';
import { useContext } from "react";
import "../scss/style.scss";
import Navbar from "../components/Navbar";
import NominatimGeocoder from "nominatim-geocoder";
import { AuthContext } from "../context/authContext";

import { Icon, divIcon, point } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function UserProfile() {
    
  const location = useLocation();
  const userid = location.pathname.split("/")[2];
    console.log(userid);

  const [stories, setStories] = useState({});
  const [user, setUser] = useState("");
  const [editMode, setEditMode] = useState(false);


  const [bio, setBio] = useState("");

  const geoConvert = new NominatimGeocoder();
  const navigate = useNavigate();
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [address, setAddress] = useState("");
  //setStories(res.data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/users/${userid}`
        );
        setUser(res.data);
        // console.log(res.data);
        console.log("res.data");

        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/story/user/${userid}`
        );
        setStories(res.data);
        // console.log(res.data);
        console.log("res.data");

        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);


  const position = "34.4462209063811, 35.83014616188998";

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/819/819814.png",
    // iconUrl: require(PlaceIcon),
    iconSize: [38, 38],
  });

  return (
    <div>


      <div className="mb-28 h-full">
      <div className="self-center mt-5 mx-auto text-center bg-white w-fit items-center justify-center flex">
              <div className="mx-5">
                <div className="listTitles">Stories</div>
                <div className="details">{Object.keys(stories).length}</div>
              </div>
              <div className="mx-5">
                <div className="listTitles">Following</div>
                <div className="details">{user.following}</div>
              </div>
              <div className="mx-5">
                <div className="listTitles">Followers</div>
                <div className="details">{user.followers}</div>
              </div>
     
        </div>
        {Array.isArray(stories) ? (
          <div className="">
            <MapContainer
              className="leaflet-container2"
              center={position.split(",").map(parseFloat)}
              zoom={2}
              scrollWheelZoom={true}
            >
             
              <TileLayer
                attribution='&copy; <a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors'
                url="https://{s}.tile.jawg.io/5a646c26-4702-40b1-8fed-671eacbf1892/{z}/{x}/{y}{r}.png?access-token=Jsz7VZAnkb84aX0p5Oq8HwK57Vu4YmeRlNf1t7TUaujVsv3eOgqX8IWMoeUQ5DRU"
              />

              {stories.map((val, key) => {
                return (
                  <Marker
                    position={val.geocode.split(",").map(parseFloat)}
                    icon={customIcon}
                  >
                    <Popup>
                      {" "}
                      <Link className="link" to={`/story/${val.id}`}>
                        <div>
                          <img className="popup-img" src={val.img} alt="" />
                        </div>
                        <h1 className="text-center text-2xl">{val.title}</h1>{" "}
                        <p className="popup-year">{val.year}</p>
                      </Link>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        ) : (
          <></>
        )}
        <div className="flex">
          <img
            className="w-60 h-48 float-left object-cover"
            src={user.img}
          />
          &nbsp;&nbsp;&nbsp;
          <div>
            <p className="font-bold"> {user.username}</p>
            <br />
            {user.bio}
          </div>
          <div className="float-right right-96 text-right text-base m-0 absolute text-gray-700">
            {user.address}
            <br />
            Age:{" "}
            {Math.floor(moment().diff(user.birthdate, "years", true))}
          </div>
        </div>{" "}
      </div>

      <div className="usersList">
        <h1 className="mt-7 mb-7 text-center text-4xl">Stories</h1>
        <ol className="users-list">
          {Array.isArray(stories) ? (
            stories.map((val, key) => {
              return (
                <li key={key} onClick={() => navigate(`/story/${val.id}`)} className="shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl">
                  
                  <div className="">
                    <img
                      className="w-60 h-32 float-left object-cover"
                      src={val.img}
                    />
                  </div>
                  <div className="w-60">{val.title}</div>
                  <div>
                    <div className="listTitles">Year</div>
                    <div className="details">{val.year}</div>
                  </div>

                  <div>
                    <div className="listTitles">Location</div>
                    <div className="details">Test</div>
                  </div>

                

                  <div>
                 
                  </div>
                </li>
              );
            })
          ) : (
            <>
              <p className="text-red-400 text-center">No Stories</p>
            </>
          )}
        </ol>
      </div>


    </div>
  );
}

export default UserProfile;
