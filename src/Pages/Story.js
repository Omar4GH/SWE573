import React, { useEffect, useState } from "react";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import "../scss/style.scss";
import Avatar from "@mui/material/Avatar";
import Heart from "react-animated-heart";
import { red } from "@mui/material/colors";
import Navbar from "../components/Navbar";
import NominatimGeocoder from "nominatim-geocoder";
import { AuthContext } from "../context/authContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import CardHeader from "@mui/material/CardHeader";
import { Icon, divIcon, point } from "leaflet";

function Story() {
  const [story, setStory] = useState({});
  const [comments, setComments] = useState({});
  const [map, setmap] = useState(false);
  const [comment, setComment] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [isClick, setClick] = useState(false);
  const [trigger, setTtrigger] = useState(false);

  const geoConvert = new NominatimGeocoder();

  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [address, setAddress] = useState("");
  const storyId = location.pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/story/${storyId}`
        );
        setStory(res.data);
        // console.log(res.data);
        // setPosition(res.data.geocode);
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
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/comments/${storyId}`
        );
        setComments(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [trigger]);

  useEffect(() => {
    if (lat && lon) {
      geoConvert.reverse({ lat, lon }).then((response) => {
        const city =
          response.address.city ||
          response.address.town ||
          response.address.village;
        const country = response.address.country;
        if (country === "Israel") {
          setAddress(`${city}, Palestine`);
        } else {
          setAddress(`${city}, ${country}`);
        }
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

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/819/819814.png",
    // iconUrl: require(PlaceIcon),
    iconSize: [38, 38],
  });

  const postCommentClick = async (e) => {
    e.preventDefault();
    setTtrigger(!trigger);
    // const imgUrl = await upload();

    try {
      await axios
        .post(`http://localhost:8800/api/comments/`, {
          date_posted: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          comment: comment,
          sid: story.id,
          uid: currentUser.id,
        })
        .then((response) => {
          console.log(response.data);
        });
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
            <img onClick={() => navigate(`/userprofile/${story.uid}`)} src={story.userImg} alt="" />

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
              </div>
            )}

            <div className="float-right right-96 text-right text-base m-0 absolute text-gray-700">
              {address} &nbsp;&nbsp; {story.year}
            </div>
          </div>
          <div className="flex  justify-center ">
            {lat != null && lon != null && (
              <MapContainer
                className="leaflet-container3"
                center={[lat, lon]}
                zoom={10}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors"'
                  url="https://{s}.tile.jawg.io/5a646c26-4702-40b1-8fed-671eacbf1892/{z}/{x}/{y}{r}.png?access-token=Jsz7VZAnkb84aX0p5Oq8HwK57Vu4YmeRlNf1t7TUaujVsv3eOgqX8IWMoeUQ5DRU"
                />

                <Marker position={[lat, lon]} icon={customIcon}></Marker>
              </MapContainer>
            )}
          </div>
          <h1>{story.title}</h1>
          <div className="text-center flex justify-center">
          <img src={story.img} alt="" /></div>
          <p dangerouslySetInnerHTML={{__html: story.content}}></p>{" "}
        </div>
      </div>
      <div className=" mt-7 mb-7 w-full h-1 bg-orange-100"></div>
      <div className="">
        <div className="float-right right-96 text-right text-base m-0 absolute flex self-center text-gray-700">
          0<Heart isClick={isClick} onClick={() => setClick(!isClick)} />
        </div>
        <ol className="comments-list ">
          {" "}
          <label
            for="comment"
            className="block text-sm font-semibold text-gray-800"
          >
            Comment
          </label>
          <div className="mb-2 flex">
            {currentUser ? (
              <>
                <textarea
                  required
                  name="comment"
                  type="text"
                  className="block w-2/4 px-4 py-2 mt-2 text-orange-300 bg-white border rounded-md focus:border-orange-200 focus:ring-orange-100 focus:outline-none focus:ring focus:ring-opacity-40"
                  onChange={(event) => setComment(event.target.value)}
                />
                <button
                  className=" px-4 py-2 h-fit m-5 self-center text-sm tracking-wide bg-orange-200 text-zinc-900 transition-colors duration-200 transform rounded-md hover:bg-orange-100 focus:outline-none focus:bg-orange-100 "
                  onClick={postCommentClick}
                >
                  Post Comment
                </button>
              </>
            ) : (
              <>
                {" "}
                <textarea
                  required
                  disabled
                  name="comment"
                  type="text"
                  className="cursor-not-allowed block w-2/4 px-4 py-2 mt-2 text-orange-300 bg-white border rounded-md focus:border-orange-200 focus:ring-orange-100 focus:outline-none focus:ring focus:ring-opacity-40"
                  onChange={(event) => setComment(event.target.value)}
                />
                <button
                  className=" px-4 py-2 h-fit m-5 self-center text-sm tracking-wide bg-orange-200 text-zinc-900 transition-colors duration-200 transform rounded-md hover:bg-orange-100 focus:outline-none focus:bg-orange-100 "
                  onClick={() => navigate("/signin")}
                >
                  Signin to Comment
                </button>
              </>
            )}
          </div>
          {Array.isArray(comments) ? (
            comments.map((comment, key) => {
              return (
                <li className="w-2/4" key={key}>
                  <div className=" ">
                    <div className="w-full">
                      <CardHeader
                        avatar={
                          <Avatar
                            sx={{ bgcolor: red[500] }}
                            src={comment.userImg}
                            aria-label="avatar"
                          />
                        }
                        title={comment.username}
                        subheader={moment(comment.date_posted).fromNow()}
                      />
                    </div>
                    <div className="w-full  text-lg ">{comment.comment}</div>
                  </div>
                </li>
              );
            })
          ) : (
            <></>
          )}
        </ol>
      </div>
    </div>
  );
}

export default Story;
