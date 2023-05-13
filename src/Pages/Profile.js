import React, { useEffect, useState } from "react";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import "../scss/style.scss";
import Navbar from "../components/Navbar";
import NominatimGeocoder from "nominatim-geocoder";
import { AuthContext } from "../context/authContext";
import DoneIcon from '@mui/icons-material/Done';
import { Icon, divIcon, point } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function Profile() {
  const { currentUser } = useContext(AuthContext);
  const [trigger, setTrigger] = useState(false);
  const [stories, setStories] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState("");

  const geoConvert = new NominatimGeocoder();
  const navigate = useNavigate();
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  //setStories(res.data);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/story/user/${currentUser.id}`
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
    getUser();
  }, [trigger]);

  const getUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/users/${currentUser.id}`
      );
      setUserInfo(res.data);

      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const switchEditMode = () => {
    setEditMode(!editMode);
  };

  const deleteStory = (id) => {
    axios.delete(`http://localhost:8800/api/story/${id}`).then((response) => {
      setTrigger(!trigger);
    });
  };

  const position = "34.4462209063811, 35.83014616188998";

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/819/819814.png",
    // iconUrl: require(PlaceIcon),
    iconSize: [38, 38],
  });

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch("https://restcountries.com/v2/all")
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.map((country) => country.name));
      });
  }, []);

  const handleChange = (event) => {
    setCountry(event.target.value);
  };

  //////////////////////  UPDATE PROFILE  ////////////////////
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [profileImg, setProfileImg] = useState("");
  console.log(profileImg);
  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      await axios
        .put(`http://localhost:8800/api/users/${currentUser.id}`, {
          bio: bio || userInfo.bio,
          birthdate: birthdate || new Date(userInfo.birthdate).toISOString().slice(0, 10),
          img: profileImg || userInfo.img,
          country: country || userInfo.country,
        })
        .then((response) => {
          setTrigger(!trigger);
          switchEditMode();
        });
    } catch (err) {
      console.log(err);
    }
  };

  ////////////////////////////////////////////////////////

  return (
    <div>
      {editMode ? (
        <>
          <div className="mb-28 h-full">
            <div className="self-center mt-5 mx-auto text-center bg-white w-fit items-center justify-center flex">
              <div className="mx-5">
                <div className="listTitles">Stories</div>
                <div className="details">{Object.keys(stories).length}</div>
              </div>
              <div className="mx-5">
                <div className="listTitles">Following</div>
                <div className="details">{userInfo.following}</div>
              </div>
              <div className="mx-5">
                <div className="listTitles">Followers</div>
                <div className="details">{userInfo.followers}</div>
              </div>
              <div
                className="float-right right-96 text-right text-xs absolute m-0  text-gray-700"
                
              >
                <Edit fontSize="medium" className="cursor-pointer hover:text-blue-800" onClick={switchEditMode}/>
                Back
                <DoneIcon fontSize="medium" className="cursor-pointer hover:text-green-600" onClick={updateProfile}/>Save Changes
              </div>
            </div>
            { Array.isArray(stories) ? (
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
                            <h1 className="text-center text-2xl">
                              {val.title}
                            </h1>{" "}
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
            ) }
           <div className="flex">
  <div className="w-60 h-48 mr-4 relative">
    <img
      className="w-full h-full object-cover shadow-2xl rounded-lg"
      src={userInfo.img}
      alt="Profile"
    />
    <div className="absolute bottom-0 right-0">
      <input
        type="text"
        name="img"
        placeholder="Enter image URL"
        value={userInfo.img}
        onChange={(e) => setProfileImg(e.target.value)}
        className="block w-full px-3 py-2 text-sm text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
      />
    </div>
  </div>
  <div className="flex-grow">
    <div className="mb-4">
      <p className="font-bold text-lg">{userInfo.username}</p>
      <textarea
        className="block w-fit px-3 py-2 text-sm text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
        placeholder={userInfo.bio}
        name="plan"
        required
        defaultValue={userInfo.bio}
        onChange={(e) => {
          setBio(e.target.value);
        }}
        disabled={false} // set to false to enable input
      />

    </div>
    <div className="text-base text-gray-700">
      <select
        name="country"
        className="block w-fit px-3 py-2 mt-2 text-sm text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
        onChange={handleChange}
        defaultValue={userInfo.country}
      >
        <option value={currentUser.country}>
          {currentUser.country}
        </option>
        {countries.map((countries) => (
          <option key={countries} value={countries}>
            {countries}
          </option>
        ))}
      </select>
      <div className="mt-2 flex items-center">
        <span className="mr-2">Age:</span>
        <input
          type="date"
          name="birthdate"
          value={new Date(userInfo.birthdate).toISOString().slice(0, 10)}
          onChange={(e) => setBirthdate(e.target.value)}
          className="block w-fit px-3 py-2 text-sm text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
        />
      </div>
    </div>
  </div>
</div>
{" "}
          </div>

          <div className="usersList">
            <h1 className="mt-7 mb-7 text-center text-4xl">Stories</h1>
            <ol className="users-list">
              {Array.isArray(stories) ? (
                stories.map((val, key) => {
                  return <li key={key}></li>;
                })
              ) : (
                <>
                  <p className="text-red-400 text-center">No Stories</p>
                </>
              )}
            </ol>
          </div>
        </>
      ) : (
        <>
          <div className=" pb-28 h-full mt-2 bg-orange-50 border rounded-lg ">
            <div className="self-center mt-5 mx-auto text-center bg-white  w-fit items-center justify-center flex border rounded-lg p-3">
              <div className="mx-5">
                <div className="listTitles">Stories</div>
                <div className="details">{Object.keys(stories).length}</div>
              </div>
              <div className="mx-5">
                <div className="listTitles">Following</div>
                <div className="details">{userInfo.following}</div>
              </div>
              <div className="mx-5">
                <div className="listTitles">Followers</div>
                <div className="details">{userInfo.followers}</div>
              </div>
              <div
                className="float-right right-96 text-right text-xs absolute m-0 cursor-pointer text-gray-700"
                onClick={switchEditMode}
              >
                <Edit />
                Edit Profile
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
                            <h1 className="text-center text-2xl">
                              {val.title}
                            </h1>{" "}
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
            <div className="flex ">
              <img
                className="w-60 h-48 object-cover shadow-2xl rounded-lg"
                src={userInfo.img}
              />
              &nbsp;&nbsp;&nbsp;
              <div>
                <p className="font-bold"> {userInfo.username}</p>
                <br />
                {userInfo.bio}
              </div>
              <div className="float-right right-96 text-right text-base m-0 absolute text-gray-700">
                {userInfo.country}
                <br />
                Age:{" "}
                {Math.floor(moment().diff(userInfo.birthdate, "years", true))}
              </div>
            </div>{" "}
          </div>

          <div className="usersList">
            <h1 className="mt-7 mb-7 text-center text-4xl">Stories</h1>
            <ol className="users-list">
              {Array.isArray(stories) ? (
                stories.map((val, key) => {
                  return (
                    <li
                      key={key}
                      onClick={() => navigate(`/story/${val.id}`)}
                      className="shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
                    >
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
                        <div className="details">{val.address}</div>
                      </div>

                      <div>
                        <div className="listTitles">Status</div>
                        <div className="details">Public</div>
                      </div>

                      <div>
                        <div className="listTitles">Actions</div>
                        <div className="details">
                          <Link
                            to={`/writepost?edit=${val.id}`}
                            state={val.content}
                          >
                            <Edit className="cursor-pointer mr-2 hover:text-blue-800" />
                          </Link>
                          &nbsp;&nbsp;
                          {
                            <Delete
                              onClick={() => deleteStory(val.id)}
                              className="cursor-pointer mr-2 hover:text-red-800"
                            />
                          }
                        </div>
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
        </>
      )}
    </div>
  );
}

export default Profile;
