import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import Navbar from "../components/Navbar";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import LocationPicker from "react-leaflet-location-picker";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import  NominatimGeocoder  from 'nominatim-geocoder';

function WritePost() {
  const { currentUser } = useContext(AuthContext);

  const geoConvert = new NominatimGeocoder();

  const state = useLocation().state;

  const [value, setValue] = useState(state?.content || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [year, setYear] = useState(state?.year || "");
  //const position = "34.4462209063811, 35.83014616188998";
  const [lat, setLat] = useState(); 
  const [lon, setLon] = useState();
  const [address, setAddress] = useState("Pick a Location");

  const navigate = useNavigate();

  //const upload = async () => {};

  const [position, setPosition] = useState("51.505, -0.09"); // default position - later will change to User's location by Default

console.log(position);


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



  const handleClick = async (e) => {
    e.preventDefault();
    // const imgUrl = await upload();

    try {
      state
        ? await axios.put(`http://localhost:8800/api/story/${state.id}`, {
            title: title,
            content: value,
          })
        : await axios.post(`http://localhost:8800/api/story/`, {
            title: title,
            content: value,
            img: "https://drscdn.500px.org/photo/1052218373/m%3D900/v2?sig=c89f9d25d4152370f0a8085e06bf3ec0fc8fa19e91cd48404777214868a0bc33",
            postdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            year: year,
            geocode: position,
            uid: currentUser.id,
          })  .then((response) => {
            console.log(response.data);
            navigate(`/story/${response.data.id}`);
          });
    } catch (err) {
      console.log(err);
    }
  };

  const pointVals = [];
  const pointMode = {
   // banner: true,
    control: {
      values: pointVals,
      onClick: (point) => {
        console.log("I've just been clicked on the map!", point);
        setPosition(point.join(", "));
        setLat(point[0]);
        setLon(point[1]);
      },
      onRemove: (point) =>
        console.log("I've just been clicked for removal :(", point),
    },
  };



  function valuetext(value) {
    setYear(value);
    // return `${value}`;
  }
  //////////////////popover////////////////////////////////

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlepopoverClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  /////////////////////////////////////////////////
  return (
    <div>
      <h1>Post a Story</h1>

      <div className="add">
        <div className="content">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="editorContainer">
            <ReactQuill
              className="editor"
              theme="snow"
              value={value}
              onChange={setValue}
            />
          </div>
        </div>
        <div className="menu ">
          <div className="item">
            <h1>Publish</h1>
            <span>
              <b>Status: </b> Draft
            </span>
            <span>
              <b>Visibility: </b> Public
            </span>
            <input
              disabled
              className="cursor-not-allowed"
              style={{ display: "none" }}
              type="file"
              id="file"
              name=""
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label className="file" htmlFor="file">
              Upload Image
            </label>
            <div className="buttons">
              <button disabled>Save as a draft</button>
              <button onClick={handleClick}>Publish</button>
            </div>
          </div>
          <div className="item">
            <Button
              aria-describedby={id}
              variant="contained"
              onClick={handlepopoverClick}
            >
             {address} 
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Typography sx={{ p: 2 }}>
                {" "}
                <div>
                  {" "}{address}
                  <LocationPicker
                   // geoURL="https://{s}.tile.jawg.io/5a646c26-4702-40b1-8fed-671eacbf1892/{z}/{x}/{y}{r}.png?access-token=Jsz7VZAnkb84aX0p5Oq8HwK57Vu4YmeRlNf1t7TUaujVsv3eOgqX8IWMoeUQ5DRU"
                    mapStyle={{
                     width: '100%', // Set the width of the map container
                    
                    }}
                    pointMode={pointMode}
                  />
                </div>{" "}
              </Typography>
            </Popover>

            <h1>YEAR</h1>
            {year}
            <Box sx={{ width: 400 }}>
              <Slider
                aria-label="Year"
                defaultValue={2020}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1920}
                max={2023}
              />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WritePost;
