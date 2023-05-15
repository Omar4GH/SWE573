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
import { Chip } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import { Icon, divIcon, point } from "leaflet";

function Story() {
  const [story, setStory] = useState({});
  const [comments, setComments] = useState({});

  const [map, setmap] = useState(false);
  const [comment, setComment] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const [trigger, setTtrigger] = useState(false);

  const geoConvert = new NominatimGeocoder();

  const [isLiked, setIsLiked] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [allLikes, setAllLikes] = useState({});
  const [likeId, setLikeId] = useState("");
  const [likes, setLikes] = useState({});

  const [lat, setLat] = useState();
  const [lon, setLon] = useState();

  

  const [tags, setTags] = useState({});
  const [address, setAddress] = useState("");
  const storyId = location.pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://geomemoirs-backend-sh52mcq4ba-oa.a.run.app/api/story/${storyId}`
        );
        setStory(res.data);
        setTags(res.data.tags.split(","));
        console.log(res.data.tags);

        const [latStr, lonStr] = res.data.geocode.split(",");
        setLat(parseFloat(latStr.trim()));
        setLon(parseFloat(lonStr.trim()));

      
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [storyId, isClick]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://geomemoirs-backend-sh52mcq4ba-oa.a.run.app/api/comments/${storyId}`
        );
        setComments(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    getLikes();
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
      await axios.delete(`https://geomemoirs-backend-sh52mcq4ba-oa.a.run.app/api/story/${storyId}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/4874/4874744.png",
    // iconUrl: require(PlaceIcon),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    
  });
  const secondaryIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/4874/4874669.png",
    // iconUrl: require(PlaceIcon),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    
  });
  ////////////////////////////////  COMMENT   /////////////////////////////////////////////////

  const postCommentClick = async (e) => {
    e.preventDefault();
    setTtrigger(!trigger);
    // const imgUrl = await upload();

    try {
      await axios
        .post(`https://geomemoirs-backend-sh52mcq4ba-oa.a.run.app/api/comments/`, {
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

  const deleteComment = async (id) => {
    setTtrigger(!trigger);

    try {
      await axios
        .delete(`https://geomemoirs-backend-sh52mcq4ba-oa.a.run.app/api/comments/${id}`)
        .then((response) => {
          console.log(response);
        });
    } catch (err) {
      console.log(err);
    }
  };
  /////////////////////////////////////////      Like       ////////////////////////////////////////////


  const postLike = async (e) => {
    e.preventDefault();
    setTtrigger(!trigger);

    if (isClick) {
      try {
        await axios
          .delete(`https://geomemoirs-backend-sh52mcq4ba-oa.a.run.app/api/likes/${likeId}/${storyId}`)
          .then((response) => {
            console.log("deleted Comment");
            setIsLiked(false);
            setIsClick(false);
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await axios
          .post(`https://geomemoirs-backend-sh52mcq4ba-oa.a.run.app/api/likes/`, {
            user_id: currentUser.id,
            story_id: story.id,
          })
          .then((response) => {
            console.log(response.data);
            setIsLiked(true);
            setIsClick(true);
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getLikes = async () => {
    try {
      const res = await axios.get("https://geomemoirs-backend-sh52mcq4ba-oa.a.run.app/api/likes/");
      setAllLikes(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (Array.isArray(allLikes)) {
      const filteredLikes = allLikes.filter(
        (like) => like.story_id === story.id
      );
      setLikes(filteredLikes);

      if (currentUser) {
        const userLiked = filteredLikes.some(
          (like) => like.user_id === currentUser.id
        );
        if (userLiked) {
          setIsClick(true);
          console.log("liked by user");
          const userlike = filteredLikes.filter(
            (like) => like.user_id === currentUser.id
          );
          setLikeId(userlike[0].id);
          console.log(userlike[0].id);
        }
      }
    }
  }, [allLikes, trigger]);

  ////////////////////////////////////////////////////////////////

  return (
    <div>
      <div className="single">
        <div className="content">
          <br />{" "}
          <div className="user">
            <Avatar
              className="cursor-pointer"
              onClick={() => navigate(`/userprofile/${story.uid}`)}
              sx={{ width: 66, height: 66, bgcolor: red[500] }}
              src={story.userImg}
              aria-label="avatar"
            />

            <div className="info">
              <span>{story.username}</span>
              <p>Posted {moment(story.postdate).fromNow()}</p>
            </div>
            {currentUser && currentUser.id === story.uid && (
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
                {story.geocode2 && (
  <Marker position={story.geocode2.split(",")} icon={secondaryIcon}></Marker>
)}
         {story.geocode3 && (
  <Marker position={story.geocode3.split(",")} icon={secondaryIcon}></Marker>
)}

              </MapContainer>
            )}
          </div>
          <h1>{story.title}</h1>
          <div>
            {Array.isArray(tags) && tags.length > 0 ? (
              JSON.parse(tags).map((tag) => (
                <Chip className="mx-1" key={tag} label={tag} />
              ))
            ) : (
              <></>
            )}
          </div>
          <div className="text-center flex justify-center">
            <img className="shadow-lg" src={story.img} alt="" />
          </div>
          <p dangerouslySetInnerHTML={{ __html: story.content }}></p>{" "}
        </div>
      </div>
      <div className=" mt-7 mb-7 w-full h-1 bg-orange-100"></div>
      <div className="">
        <div className="float-right right-96 text-right align-center text-base m-0 absolute flex self-center text-gray-700">
          <div className="relative">
          {currentUser ? (
              <>
    <Heart isClick={isClick} onClick={postLike} />
              </>
            ) : (
              <>
            <Heart disabled className="cursor-not-allowed"  />
              </>
            )}
            
            <span className="absolute top-1/2 transform -translate-y-1/2 left-full ml-2">
              {story.likes}
            </span>
          </div>
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
                  {currentUser &&
                    (currentUser.id === story.uid ||
                      comment.uid === currentUser.id) && (
                        <div className="edit absolute top-0 right-0 mr-5 mt-2">
                        <Delete
                          className="cursor-pointer hover:text-red-500"
                          onClick={() => deleteComment(comment.id)}
                        />
                      </div>
                    )}

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
