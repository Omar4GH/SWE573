import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import moment from "moment";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import ShareIcon from "@mui/icons-material/Share";
import Box from "@mui/material/Box";
import Slider from '@mui/material/Slider';
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";

import "leaflet/dist/leaflet.css";
import { Icon, divIcon, point } from "leaflet";
import axios from "axios";

function Feed() {
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState([]);
  //const yearFilter = useLocation().search;
  const [yearFilter, setYearFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const handleTitleChange = (e) => {
    setTitleFilter(e.target.value);
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
        `http://localhost:8800/api/story/?year=${yearFilter}&title=${titleFilter}&userid=${userFilter}`
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
  }, [yearFilter, titleFilter, userFilter, usernameFilter]);
  
  //Side Menu
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    > 
 <div className="m-5">Filter</div>

      <Divider />
      <List>
        <Link to="/feed/?year=1985">
          <span>1985</span>
        </Link>
        <Link to="/feed/">
          <span>clear</span>
        </Link>
      </List>
      <div className="bg-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">Filter by Year</h3>
      
      <Typography id="year-range-slider" gutterBottom>
        Year Range: {yearRange[0]} - {yearRange[1]}
      </Typography>
      
      <Slider
        value={yearRange}
        onChange={handleYearRangeChange}
        min={1940}
        max={2023}
        step={1}
        valueLabelDisplay="auto"
        aria-labelledby="year-range-slider"
      />
    </div>
    </Box>
    
  );
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
      <h1 className="mt-7 mb-7 text-center text-5xl">
        Check out Stories from around the World !{" "}
      </h1>
      <div className="flex">
      <input
        type="text"
        placeholder="Search by title"
        value={titleFilter}
        onChange={handleTitleChange}
      />
 <Autocomplete className="w-52 ml-5 bg-white"
    options={users}
    getOptionLabel={(users) => users.username || ""}

    value={users.find((option) => option.id === userFilter)}
    onChange={handleUserChange}
    onInputChange={handleUsernameChange}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Search by User"
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
      {/* 
            <input
        type="text"
        placeholder="Search by User"
        value={usernameFilter}
        onChange={handleUsernameChange}
      />
      <select onChange={handleUserChange}>
        <option value="">Select a user</option>
        {users.map(user => <option key={user.id} value={user.id}>{user.username}</option>)}
      </select>
*/}
    </div>
      <div className="float-left ">
        {["Search/Filter"].map((anchor) => (
          <React.Fragment key={anchor}>
            <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              {list(anchor)}
            </Drawer>
          </React.Fragment>
        ))}
      </div>
      <div>
        <MapContainer
          className="leaflet-container1"
          center={position.split(",").map(parseFloat)}
          zoom={10}
          scrollWheelZoom={true}
        >
          {/*<TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />*/}
          <TileLayer
            attribution='&copy; <a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors"'
            url="https://{s}.tile.jawg.io/5a646c26-4702-40b1-8fed-671eacbf1892/{z}/{x}/{y}{r}.png?access-token=Jsz7VZAnkb84aX0p5Oq8HwK57Vu4YmeRlNf1t7TUaujVsv3eOgqX8IWMoeUQ5DRU"
          />
          <MarkerClusterGroup chunkedLoading>
            {stories.map((story) => (
              <Marker
                position={story.geocode.split(",").map(parseFloat)}
                icon={new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/819/819814.png",
    // iconUrl: require(PlaceIcon),
    iconSize: [38, 38],
  })}
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
        {stories.map(
          (
            story 
          ) => (
            <Card
              sx={{ maxWidth: 345 }}
              className="shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
            ><Link to={`/story/${story.id}`}>
              <CardContent>
                <Typography variant="h5" color="text.primary">
                  {story.title}
                </Typography>
              </CardContent>

              <CardMedia
                component="img"
                height="194"
                image={story.img}
                alt="Paella dish"
              /></Link>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} src={story.userImg} aria-label="avatar"/>
                    
                }
                action={
                  <IconButton aria-label="share">
                    <ShareIcon onClick={() => handleCopy(story.id)} />
                  </IconButton>
                }
                title={story.username}
                subheader={moment(story.postdate).fromNow()}
              />
            </Card>
          )
        )}
      </div>
    </div>
  );
}

export default Feed;
