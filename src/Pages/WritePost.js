import React, { useCallback, useEffect, useState } from "react";
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
import NominatimGeocoder from "nominatim-geocoder";
import MapView from "../components/MapView";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import Chip from "@mui/material/Chip";
import TextField from '@mui/material/TextField';
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

function WritePost() {
  const { currentUser } = useContext(AuthContext);

  const geoConvert = new NominatimGeocoder();

  const state = useLocation().state;

  const [coordinates, setCoordinates] = useState([]);

  const handleClearCoordinates = () => {
    setCoordinates([]);
  };

  const handleCoordinatesChange = (newCoordinates) => {
    if (coordinates.length >= 3) {
      setCoordinates((prevCoordinates) => [
        ...prevCoordinates.slice(1),
        newCoordinates,
      ]);
    } else {
      setCoordinates((prevCoordinates) => [...prevCoordinates, newCoordinates]);
    }
   
  };

  useEffect(() => {
    if (coordinates.length >= 4) {
      setCoordinates((prevCoordinates) => [...prevCoordinates.slice(1)]);
    }
    if (coordinates.length > 0) {
      setGeocode(`${coordinates[0].lat}, ${coordinates[0].lng}`);
      setAddress(coordinates[0].address);
    }
  }, [coordinates]);

  const [value, setValue] = useState(state?.content || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [year, setYear] = useState(state?.year || "");
  const [imgUrl, setImgUrl] = useState(state?.img || "");
  const [tags, setTags] = useState(state?.tags || []);
  const [address, setAddress] = useState(state?.address || "");
  const [geocode, setGeocode] = useState(state?.geocode || "");
  //const position = "34.4462209063811, 35.83014616188998";
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  
  
  const [newTag, setNewTag] = useState("");

  const handleTagAddition = (event) => {
    event.preventDefault();
    if (!newTag.trim()) return;
    setTags([...tags, newTag.trim()]);
    setNewTag("");
  };
  const navigate = useNavigate();

  const [position, setPosition] = useState("37.98, 23.74"); // default position - later will change to User's location by Default

  const [anchorEl2, setAnchorEl2] = React.useState(null);

  const handlePopoverClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handlePopoverClose2 = () => {
    setAnchorEl2(null);
  };
  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? "simple-popover" : undefined;
  ////////////////////////////////////////

  const handleClick = async (e) => {
    e.preventDefault();
    // const imgUrl = await upload();

    try {
      state
        ? await axios.put(`http://localhost:8800/api/story/${state.id}`, {
            title: title,
            content: value,
            img: imgUrl,
            year: year,
            geocode: position,
            geocode: `${coordinates[0].lat}, ${coordinates[0].lng}`,
            address: coordinates[0].address,
          })
        : await axios
            .post(`http://localhost:8800/api/story/`, {
              title: title,
              content: value,
              img: imgUrl,
              postdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
              year: year,
              geocode: geocode,
              address: address,
              tags: tags,
              likes: 0,
              uid: currentUser.id,
            })
            .then((response) => {
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
  const colors = ["red", "green", "blue", "orange", "violet", "white", "black"];
  const toolbarOptions = [
    [{ font: ["serif", "monospace"] }, { size: ["small", "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: colors }, { background: colors }],
    [{ script: "sub" }, { script: "super" }],
    [{ header: [1, 2, false] }, "blockquote", "code-block"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ direction: "rtl" }, { align: [] }],
    ["link", "image", "video", "formula"],
  ];

  return (
    <div>
      {" "}
      {currentUser ? (
        <>
          <h1>Post a Story</h1>
          <div className="add">
            <div className="content">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Box>
      {tags.map((tag, index) => (
        <Chip key={index} label={tag} />
      ))}
      <form onSubmit={handleTagAddition}>
        <TextField
          label="Add Tag"
          variant="outlined"
          size="small"
          value={newTag}
          onChange={(event) => setNewTag(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleTagAddition(event);
            }
          }}
        />
      </form>
    </Box>
              <div className=" text-slate-900 bg-white border rounded-md focus:border-orange-200 focus:ring-orange-100 focus:outline-none focus:ring focus:ring-opacity-40">
                <ReactQuill
                  className="editor"
                  theme="snow"
                  value={value}
                  onChange={setValue}
                  modules={{
                    toolbar: toolbarOptions,
                  }}
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
                <br />
                <span>(temp)*Image URL :</span>
                <input
                  type="text"
                  placeholder="Image"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                />
                <br />
                <div className="buttons">
                  <button disabled>Save as a draft</button>
                  <button onClick={handleClick}>Publish</button>
                </div>
              </div>

              <div></div>

              <div className="item">
                <h1>
                  Selected Locations:{" "}
                  {coordinates.length > 0 && (
                    <HighlightOffIcon
                      className="cursor-pointer float-right "
                      onClick={handleClearCoordinates}
                    />
                  )}
                </h1>
                <ul>
                  {coordinates.map((coord, index) => (
                    <li className="m-1" key={index}>
                      <Chip label={coord.address} variant="outlined" />
                    </li>
                  ))}
                </ul>
                <MapView onCoordinatesChange={handleCoordinatesChange} />
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

                <Button
                  aria-describedby={id}
                  variant="contained"
                  onClick={handlePopoverClick2}
                  className="font-medium text-xs submit-btn text-white px-3 py-2 rounded bg-slate-200"
                >
                  Date and Time
                </Button>
                <Popover
                  id={id2}
                  open={open2}
                  anchorEl={anchorEl2}
                  onClose={handlePopoverClose2}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <StaticDateTimePicker />
                      {/* <button onClick={handleGetTimestamp}>Get Timestamp</button>*/}
                    </LocalizationProvider>
                  </Typography>
                </Popover>
              </div>
            </div>
          </div>{" "}
        </>
      ) : (
        <>
          <h1>Post a Story</h1>
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
            {/* Centered button */}
            <div className="text-center">
              <button
                onClick={() => navigate("/signin")}
                className="shadow-xl text-justify px-6 py-6 h-fit m-5 text-sm tracking-wide bg-orange-200 text-zinc-900 transition-colors duration-200 transform rounded-md hover:bg-orange-100 focus:outline-none focus:bg-orange-100"
              >
                Sign In to Post
              </button>
            </div>
          </div>
          <div className="add cursor-not-allowed">
            <div className="content cursor-not-allowed">
              <input
                type="text"
                placeholder="Title"
                value={title}
                disabled
                onChange={(e) => setTitle(e.target.value)}
                className="cursor-not-allowed"
              />
              <div className="editorContainer"></div>
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
                <br />
                <span>(temp)*Image URL :</span>
                <input
                  type="text"
                  placeholder="Image"
                  value={imgUrl}
                  className="cursor-not-allowed"
                />
                <br />
                <div className="buttons">
                  <button disabled className="cursor-not-allowed">
                    Save as a draft
                  </button>
                  <button disabled className="cursor-not-allowed">
                    Publish
                  </button>
                </div>
              </div>

              <div></div>

              <div className="item cursor-not-allowed">
                <h1>YEAR</h1>
                {year}
                <Box sx={{ width: 400 }}>
                  <Slider
                    aria-label="Year"
                    defaultValue={2020}
                    getAriaValueText={valuetext}
                    valueLabelDisplay="auto"
                    step={1}
                    disabled
                    marks
                    min={1920}
                    max={2023}
                  />
                </Box>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default WritePost;
