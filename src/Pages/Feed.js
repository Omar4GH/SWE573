import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import "leaflet/dist/leaflet.css";
import { Icon, divIcon, point } from "leaflet";
import axios from "axios";

function Feed() {
  const [stories, setStories] = useState([]);
  const yearFilter = useLocation().search;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/story/${yearFilter}`);
        setStories(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [yearFilter]);


  //Side Menu
    const [state, setState] = React.useState({
      top: false,
      left: false,
      bottom: false,
      right: false,
    });
    const toggleDrawer = (anchor, open) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
  
      setState({ ...state, [anchor]: open });
    };
    const list = (anchor) => (
      <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
        role="presentation"
       // onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List><Link to="/feed/?year=1985">
      <span>1985</span></Link>
      <Link to="/feed/">
      <span>clear</span></Link>
        </List>
      </Box>
    );
    //


  const position = "34.4462209063811, 35.83014616188998";
 // const arr = position.split(",").map(parseFloat);
 // console.log(arr);

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/819/819814.png",
    // iconUrl: require(PlaceIcon),
    iconSize: [38, 38],
  });
  /*
  const createCustomClusterIcon = (cluster) =>{
    return new divIcon({
      html:`<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      iconSize: point(33,33, true)
  });
  };*/

  return (
    <div className="home">
      <h1 className="mt-7 mb-7 text-center text-5xl">
        Check out Stories from around the World !{" "}
      </h1>
      <div className="float-left ">
      {['Search/Filter'].map((anchor) => (
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
        <MapContainer center={position.split(",").map(parseFloat)} zoom={13} scrollWheelZoom={true}>
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
              <Marker position={story.geocode.split(",").map(parseFloat)} icon={customIcon}>
                <Popup>
                  {" "}<Link className="link" to={`/story/${story.id}`}>
                  <div>
                    <img className="popup-img" src={story.img} alt="" />
                  </div>
                  <h1 className="text-center text-2xl">{story.title}</h1>
                  <p className="popup-year">{story.year}</p>
                  <p>...</p></Link>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
      <div className="posts">
        {stories.map((story) => (
          <div className="post" key={story.id}>
            <div className="img">
              <img src={story.img} alt="" />
            </div>
            <div className="content">
              <Link className="link" to={`/story/${story.id}`}>
                <h1>{story.title}</h1>
              </Link>
              {story.content}
              <button>Read More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
