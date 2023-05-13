import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import moment from "moment";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ShareIcon from "@mui/icons-material/Share";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import { Chip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "leaflet/dist/leaflet.css";
import { Icon, divIcon, point } from "leaflet";
import axios from "axios";
import SliderSlick from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SearchIcon from "@material-ui/icons/Search";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TagIcon from "@mui/icons-material/Tag";
import CalendarIcon from "@mui/icons-material/CalendarMonth";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import PersonIcon from '@mui/icons-material/Person';

function Feed() {
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState([]);
  //const yearFilter = useLocation().search;
  const [yearFilter, setYearFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [showMore, setShowMore] = useState({});
  const [mapExpanded, setMapExpanded] = useState(true);

  const handleMapExpand = () => {
    setMapExpanded(!mapExpanded);
    console.log(mapExpanded);
  };
  const handleShowMore = (storyId) => {
    setShowMore((prevState) => ({
      ...prevState,
      [storyId]: !prevState[storyId],
    }));
  };

  const handleYearChange = (date) => {
    setYearFilter(date.getFullYear());
  };
  const handleClearYear = () => {
    setYearFilter("");
  };

  const handleTitleChange = (e) => {
    setTitleFilter(e.target.value);
  };
  const handleTagChange = (e) => {
    setTagsFilter(e.target.value);
  };
  const handleUserChange = (e, value) => {
    if (value) {
      setSelectedUser(value);
      setUserFilter(value.id);
      setUsernameFilter(value.username);
    } else {
      setSelectedUser(null);
      setUserFilter("");
      setUsernameFilter("");
    }
  };
  const handleUsernameChange = (e) => {
    setUsernameFilter(e.target.value);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/story/?year=${yearFilter}&tags=${tagsFilter}&title=${titleFilter}&userid=${userFilter}`
      );
      setStories(res.data);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/users/?name=${usernameFilter}`
      );
      setUsers(res.data);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, [yearFilter, titleFilter, userFilter, usernameFilter, tagsFilter]);

  //Side Menu

  //
  const [yearRange, setYearRange] = useState([2000, 2023]); // Initial year range

  // Handler for year range change
  const handleYearRangeChange = (event, newYearRange) => {
    setYearRange(newYearRange);
  };
  const position = "34.4462209063811, 35.83014616188998";

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/819/819814.png",

    iconSize: [38, 38],
  });

  //////////////
  const handleCopy = (storyid) => {
    const url = `http://localhost:3000/story/${storyid}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="home">
      <h1 className="mt-7 mb-1 text-center text-5xl">
        Check out Stories from around the World !{" "}
      </h1>

      <div>
        <Accordion 
        sx={{backgroundColor: 'transparent', boxShadow: 'none',  margin: 0 }}
        className="w-fit">
          <AccordionSummary
          
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            className="w-fit"
          >
            <SearchIcon fontSize="large" className="hover:text-green-600"/>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex items-center">
              <div className="relative mr-4">
                <input
                  type="text"
                  className="pl-8 pr-3 py-2 w-72 border rounded-md"
                  placeholder="Search by title"
                  value={titleFilter}
                  onChange={handleTitleChange}
                />
                <SearchIcon className="w-4 h-4 absolute top-3 left-2 text-gray-400" />
              </div>

              <div className="relative mr-4">
                <input
                  type="text"
                  className="pl-8 pr-3 py-2 w-72 border rounded-md"
                  placeholder="Search by tags"
                  value={tagsFilter}
                  onChange={handleTagChange}
                />
                <TagIcon className="w-4 h-4 absolute top-3 left-2 text-gray-400" />
              </div>

                <Autocomplete
                  className="w-72 bg-white rounded-md"
                  options={users}
                  getOptionLabel={(users) => users.username || ""}
                  value={users.find((option) => option.id === userFilter)}
                  onChange={handleUserChange}
                  onInputChange={handleUsernameChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <div className="flex items-center">
                          <PersonIcon />
                          <span>Search by User</span>
                          
                        </div>
                      }
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
            </div>
            <div className="flex items-center mr-4 ">
              <div className="relative mb-5 mr-4 " style={{ zIndex: 9999 }}>
                <DatePicker
                  selected={yearFilter}
                  onChange={(date) => handleYearChange(date)}
                  dateFormat="yyyy"
                  showYearPicker
                  className="pl-8 pr-3 py-2 w-72 border rounded-md"
                  placeholderText="Select a year"
                  value={yearFilter ? yearFilter.toString() : ""}
                />
                <CalendarIcon className="w-4 h-4 absolute top-3 left-2 text-gray-400" />
                {yearFilter && (
                  <button
                    className="absolute top-3 right-2 text-gray-400"
                    onClick={handleClearYear}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>

      <div>
        <button
          className="absolute top-2 right-2 z-50 bg-gray-200 px-2 py-1 rounded-md"
          onClick={handleMapExpand}
        >
          {mapExpanded ? "Collapse Map" : "Expand Map"}
        </button>
        <MapContainer
          key={mapExpanded}
          className={
            mapExpanded ? "leaflet-container1" : "leaflet-containersmall"
          }
          center={position.split(",").map(parseFloat)}
          zoom={10}
          scrollWheelZoom={true}
        >
          {mapExpanded ? (
            <CloseFullscreenIcon
              className="absolute top-2 shadow-xl right-2 z-50 hover:text-orange-500 bg-gray-200 cursor-pointer px-2 py-1 rounded-md"
              onClick={handleMapExpand}
              style={{ zIndex: 9999 }}
              fontSize="large"
            />
          ) : (
            <OpenInFullIcon
              className="absolute top-2 shadow-xl right-2 z-50 hover:text-orange-500 bg-gray-200 cursor-pointer px-2 py-1 rounded-md"
              onClick={handleMapExpand}
              style={{ zIndex: 9999 }}
              fontSize="large"
            />
          )}

          <TileLayer
            attribution='&copy; <a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors"'
            url="https://{s}.tile.jawg.io/5a646c26-4702-40b1-8fed-671eacbf1892/{z}/{x}/{y}{r}.png?access-token=Jsz7VZAnkb84aX0p5Oq8HwK57Vu4YmeRlNf1t7TUaujVsv3eOgqX8IWMoeUQ5DRU"
          />
          <MarkerClusterGroup chunkedLoading>
            {stories.map((story) => (
              <Marker
                position={story.geocode.split(",").map(parseFloat)}
                icon={
                  new Icon({
                    iconUrl:
                      "https://cdn-icons-png.flaticon.com/512/819/819814.png",
                    // iconUrl: require(PlaceIcon),
                    iconSize: [38, 38],
                  })
                }
              >
                <Popup>
                  {" "}
                  <Link className="link" to={`/story/${story.id}`}>
                    <div>
                      <img className="popup-img" src={story.img} alt="" />
                    </div>
                    <h1 className="text-center text-2xl">{story.title}</h1>{" "}
                    <p className="popup-year">{story.year}</p>
                  </Link>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      <div className="posts flex flex-wrap">
        {stories.map((story) => (
          <Card
            sx={{ maxWidth: 350, width: "100%" }}
            className="shadow-md h-fit transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="relative h-40 lg:h-56">
              <Link to={`/story/${story.id}`}>
                <img
                  src={story.img}
                  alt="Story Cover"
                  className="object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-300"
                  style={{ width: "100%" }}
                />
              </Link>
            </div>
            <div className="p-4">
              <Link to={`/story/${story.id}`}>
                <p className="text-gray-700 float-right flex text-sm mb-2">
                  {story.year}
                </p>{" "}
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {story.title}
                </h2>
              </Link>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Avatar
                    alt={story.username}
                    src={story.userImg}
                    className="mr-2"
                  />
                  <span className="text-gray-700 text-sm">
                    {story.username}
                  </span>
                </div>
                <span className="text-gray-700 text-sm">
                  {moment(story.postdate).fromNow()}
                </span>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700 flex text-sm mb-2">
                  {story.address}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  <FavoriteIcon fontSize="small" className="mx-1" />
                  {story.likes}
                </p>
              </div>
              <div>
                {story.tags && (
                  <div>
                    {JSON.parse(story.tags)
                      .slice(0, 6)
                      .map((tag, index) => (
                        <Chip
                          className="w-fit"
                          key={tag}
                          label={tag}
                          size="small"
                        />
                      ))}
                    {JSON.parse(story.tags).length > 6 &&
                      JSON.parse(story.tags).slice(6).length > 0 && (
                        <button
                          className="text-blue-500 text-sm float-right font-semibold mt-2 focus:outline-none"
                          onClick={() => handleShowMore(story.id)}
                        >
                          {showMore[story.id]
                            ? "Show Less"
                            : `+${JSON.parse(story.tags).slice(6).length} more`}
                        </button>
                      )}
                    {showMore[story.id] &&
                      JSON.parse(story.tags)
                        .slice(6)
                        .map((tag, index) => (
                          <Chip
                            className="w-fit"
                            key={tag}
                            label={tag}
                            size="small"
                          />
                        ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Feed;
