import React, { useEffect, useState, forwardRef } from "react";
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
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
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
import PersonIcon from "@mui/icons-material/Person";
import Tooltip from "@mui/material/Tooltip";
import _axios from "../api/_axios";
import SeasonSelection from "../components/SeasonSelection";

function Feed() {
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState([]);
  //const yearFilter = useLocation().search;
  const [yearFilter, setYearFilter] = useState("");
  const [beforeYear, setBeforeYear] = useState("");
  const [afterYear, setAfterYear] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [selectedYearBA, setSelectedYearBA] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [countries, setCountries] = useState([]);
  const [alignment, setAlignment] = useState("before");
  const [showMore, setShowMore] = useState({});
  const [mapExpanded, setMapExpanded] = useState(true);

  const handleMapExpand = () => {
    setMapExpanded(!mapExpanded);
   // console.log(mapExpanded);
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
      const res = await _axios.get(
        `story/?year=${yearFilter}&tags=${tagsFilter}&title=${titleFilter}&userid=${userFilter}&beforeyear=${beforeYear}&afteryear=${afterYear}&selectedMonths=${selectedMonths}&selectedCountry=${selectedCountry}`
      );
      setStories(res.data);
      //console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await _axios.get(`users/?name=${usernameFilter}`);
      setUsers(res.data);
      //console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, [
    yearFilter,
    titleFilter,
    userFilter,
    usernameFilter,
    tagsFilter,
    beforeYear,
    afterYear,
    alignment,
    selectedMonths,
    selectedCountry,
  ]);

  //Side Menu

  //
  const [yearRange, setYearRange] = useState([2000, 2023]); // Initial year range

  // Handler for year range change
  const handleYearRangeChange = (event, newYearRange) => {
    setYearRange(newYearRange);
  };
  const position = "41.04896168992059, 29.046300199304536";

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/4874/4874744.png",

    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  //////////////
  const handleCopy = (storyid) => {
    const url = `https://geo-memoirs.netlify.app/${storyid}`;
    navigator.clipboard.writeText(url);
  };
  /////////////////////////////////////
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  useEffect(() => {
    if (alignment == "before") {
      setBeforeYear(selectedYearBA);
      setAfterYear("");
    }
    if (alignment == "after") {
      setAfterYear(selectedYearBA);
      setBeforeYear("");
    }
  }, [alignment]);

  const handleYearBAChange = (date) => {
    if (alignment == "before") {
      setBeforeYear(date);
      setSelectedYearBA(date);
      setAfterYear("");
    }
    if (alignment == "after") {
      setAfterYear(date);
      setSelectedYearBA(date);
      setBeforeYear("");
    }
  };
  const handleClearYearBA = () => {
    setBeforeYear("");
    setAfterYear("");
    setSelectedYearBA("");
  };
  /////////////////////////////////////////////////
  const handleMonthsFilter = (selectedMonths) => {
    // Implement your logic to send the selected months to the backend
    //console.log(selectedMonths);
    setSelectedMonths(selectedMonths);
    // Make a request to your backend API and pass the selected months
  };
  //////////////////////////////////////////////////////////

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data); // Log the response data
        setCountries(data.data.map((country) => country.country));
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const handleCountryChange = (event, value) => {
    setSelectedCountry(value || ""); // Set the selected country value or an empty string if no country is selected
  };

  return (
    <div className="home">
      <h1 className="mt-7 mb-1 text-center sm:text-base md:text-5xl">
        Check out Stories from around the World !{" "}
      </h1>

      <div>
        <Accordion
          sx={{ backgroundColor: "transparent", boxShadow: "none", margin: 0 }}
          className="w-fit"
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            className="w-fit"
          >
            <SearchIcon fontSize="large" className="hover:text-green-600" />
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

              <div className="relative mb-5 mr-4" style={{ zIndex: 9999 }}>
                <DatePicker
                  selected={selectedYearBA}
                  onChange={(date) => handleYearBAChange(date.getFullYear())}
                  dateFormat="yyyy"
                  showYearPicker
                  className="pl-8 pr-3 py-2 w-72 border rounded-md"
                  placeholderText="< or > a year"
                  value={selectedYearBA ? selectedYearBA.toString() : ""}
                >
                  <div className="text-center">
                    <ToggleButtonGroup
                      color="primary"
                      value={alignment}
                      exclusive
                      onChange={handleChange}
                      aria-label="Platform"
                      className="bg-white"
                      size="small"
                    >
                      <ToggleButton value="before">Before</ToggleButton>
                      <ToggleButton value="after">After</ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                </DatePicker>
                <CalendarIcon className="w-4 h-4 absolute top-3 left-2 text-gray-400" />
                {selectedYearBA && (
                  <button
                    className="absolute top-3 right-2 text-gray-400"
                    onClick={handleClearYearBA}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div>
                <SeasonSelection handleFilter={handleMonthsFilter} />
              </div>

              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={countries}
                sx={{ width: 250 }}
                className="bg-white"
                value={selectedCountry}
                onChange={handleCountryChange}
                renderInput={(params) => (
                  <TextField {...params} label="Countries" />
                )}
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>

      <div>
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
            attribution='<a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a>  '
            url="https://{s}.tile.jawg.io/5a646c26-4702-40b1-8fed-671eacbf1892/{z}/{x}/{y}{r}.png?access-token=Jsz7VZAnkb84aX0p5Oq8HwK57Vu4YmeRlNf1t7TUaujVsv3eOgqX8IWMoeUQ5DRU"
          />
          <MarkerClusterGroup chunkedLoading>
            {stories.map((story) => (
              <Marker
                position={story.geocode.split(",").map(parseFloat)}
                icon={
                  new Icon({
                    iconUrl:
                      "https://cdn-icons-png.flaticon.com/512/4874/4874744.png",

                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                  })
                }
              >
                <Popup>
                  <Link to={`/story/${story.id}`}>
                    <div
                      className="w-56"
                      sx={{
                        maxWidth: 350,
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      <Tooltip title="Copy">
                        <ShareIcon
                          onClick={() => handleCopy(story.id)}
                          className="shareiconMap text-black cursor-pointer mt-7 mr-2 transition duration-500 ease-in-out transform hover:scale-125 absolute top-0 right-0 z-50"
                        />
                      </Tooltip>
                      <div className="mr-4">
                        <Link to={`/story/${story.id}`}>
                          <h2 className="text-lg font-bold text-gray-900">
                            {story.title}
                          </h2>
                        </Link>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center">
                            <Avatar
                              alt={story.username}
                              src={story.userImg}
                              className="mr-1"
                            />
                            <span className="text-gray-700 text-xs">
                              {story.username}
                            </span>
                          </div>
                          <span className="text-gray-700 text-xs">
                            {moment(story.postdate).fromNow()}
                            <br />
                          </span>
                        </div>
                      </div>
                      <div className="mt-14">
                        <div
                          className="absolute bottom-0 left-0 right-0"
                          style={{ height: "30%" }}
                        >
                          <img
                            src={story.img}
                            alt="Story Banner"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
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
              <Tooltip title="Copy">
                <ShareIcon
                  onClick={() => handleCopy(story.id)}
                  className="shareicon cursor-pointer m-3 transition duration-500 ease-in-out transform hover:scale-125 absolute top-0 right-0 z-50"
                />
              </Tooltip>
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
                          className="w-fit feed-chip"
                          key={tag}
                          label={tag.label}
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
                            className="w-fit feed-chip"
                            key={tag}
                            label={tag.label}
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
