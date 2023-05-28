import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import NominatimGeocoder from "nominatim-geocoder";
import MapView from "../components/MapView";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "@mui/material/styles";
import "@mui/material";

import DatePicker from "react-datepicker";
import { DateRange } from 'react-date-range';
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import Chip from "@mui/material/Chip";
import { IconButton } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import TextField from "@mui/material/TextField";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import _axios from "../api/_axios";

function WritePost() {
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState("");
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
    if (coordinates.length > 1) {
      setGeocode(`${coordinates[0].lat}, ${coordinates[0].lng}`);
      setGeocode2(`${coordinates[1].lat}, ${coordinates[1].lng}`);
      setAddress(coordinates[0].address);
    }
    if (coordinates.length > 2) {
      setGeocode(`${coordinates[0].lat}, ${coordinates[0].lng}`);
      setGeocode2(`${coordinates[1].lat}, ${coordinates[1].lng}`);
      setGeocode3(`${coordinates[2].lat}, ${coordinates[2].lng}`);
      setAddress(coordinates[0].address);
    }
  }, [coordinates]);
  
  const [value, setValue] = useState(state?.content || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [year, setYear] = useState(state?.year || "");
  const [dateTime, setDateTime] = useState(state?.fulldate || null);
  const [imgUrl, setImgUrl] = useState(state?.img || "");
  const [tags, setTags] = useState(state ? JSON.parse(state.tags) : []);
  const [address, setAddress] = useState(state?.address || "");
  const [geocode, setGeocode] = useState(state?.geocode || "");
  const [geocode2, setGeocode2] = useState(state?.geocode2 || "");
  const [geocode3, setGeocode3] = useState(state?.geocode3 || "");
  //const position = "34.4462209063811, 35.83014616188998";
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [dateRange, setDateRange] = useState([
    {
      startDate: state?.startdate || new Date(),
      endDate: state?.enddate || null,
      key: "selection",
    },
  ]);

  const [newTag, setNewTag] = useState("");

  const handleTagAddition = (event) => {
    event.preventDefault();
    if (!newTag.trim()) return;
    const newTagObject = {
      id: Date.now(),
      label: newTag.trim(),
    };
    setTags((prevTags) => [...prevTags, newTagObject]);
    setNewTag("");
  };
  const handleTagDeletion = (tagId) => {
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
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
  const handleDateTimeChange = (newDateTime) => {
    setDateTime(newDateTime);
   // console.log(newDateTime);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    // const imgUrl = await upload();
    if (coordinates.length == 0 || title == "" || imgUrl == "" || year =="") {
      setError("Fill all fields");
      console.log("fill all fields");
    } else {
      try {
        state
          ? await _axios
              .put(`story/${state.id}`, {
                title: title,
                content: value,
                img: imgUrl,
                fulldate: moment(dateTime).format("YYYY-MM-DD HH:mm:ss"),
                startdate: moment(dateRange[0].startDate).format("YYYY-MM-DD HH:mm:ss"),
                enddate: moment(dateRange[0].endDate).format("YYYY-MM-DD HH:mm:ss"),
                year: year,
                geocode: geocode,
                geocode2: geocode2,
                geocode3: geocode3,
                address: address,
                tags: tags,
              })
              .then((response) => {
                navigate(`/story/${state.id}`);
              })
          : await _axios
              .post(`story/`, {
                title: title,
                content: value,
                img: imgUrl,
                postdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                fulldate: moment(dateTime).format("YYYY-MM-DD HH:mm:ss"),
                startdate: moment(dateRange[0].startDate).format("YYYY-MM-DD HH:mm:ss"),
                enddate: moment(dateRange[0].endDate).format("YYYY-MM-DD HH:mm:ss"),
                year: year,
                geocode: geocode,
                geocode2: geocode2,
                geocode3: geocode3,
                address: address,
                tags: tags,
                likes: 0,
                uid: currentUser.id,
              })
              .then((response) => {
               // console.log(response.data);
                navigate(`/story/${response.data.id}`);
              });
      } catch (err) {
        console.log(err);
      }
    }
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
    ["link", "video", "formula"],
  ];

  return (
    <div>
      {" "}
      {currentUser ? (
        <>
          <div className="flex flex-col items-center justify-center ">
            <h1 className="text-4xl font-bold mt-5 text-gray-900 mb24">
              Post a Story
            </h1>
          </div>
          <div className="add">
            <div className="content">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Box className="gap-2 items-center">
                {tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    color="primary"
                    label={tag.label}
                    onDelete={() => handleTagDeletion(tag.id)}
                    className="mr-1 hover:bg-blue-200 transition duration-300 ease-in-out"
                  />
                ))}
                <form
                  onSubmit={handleTagAddition}
                  className="flex items-center mt-3"
                >
                  <TextField
                    label="Add Tag"
                    variant="outlined"
                    size="small"
                    className="bg-white mr-2"
                    value={newTag}
                    onChange={(event) => setNewTag(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleTagAddition(event);
                      }
                    }}
                  />
                  <IconButton type="submit" aria-label="add tag">
                    <AddCircleIcon className="text-green-500 hover:text-green-600 transition duration-300 ease-in-out" />
                  </IconButton>
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
                <h1 className="font-bold">Publish</h1>
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
                  <button onClick={handleClick}>Publish</button>
                </div>

                {error && <p className="text-red-700">{error}</p>}
              </div>

              <div className="item">
                <div>
                  <h1 className="font-bold">Select up to 3 Locations <p className="text-red-600 text-xs float-right">required</p></h1>
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
                        <Chip
                          label={coord.address}
                          variant="outlined"
                          color="success"
                          className="custom-chip"
                        />
                      </li>
                    ))}
                  </ul>
                  <MapView onCoordinatesChange={handleCoordinatesChange} />
                </div>
                <h1 className="mt-3 text-center font-bold">Enter Date</h1>
                <div className="border m-1 p-1">
                  <h1 className="mt-1 mb-2 font-bold">Year<p className="text-red-600 text-xs float-right">required</p></h1>
                  <p className="text-center text-base">{year}</p>
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
                </div>{" "}
                <div className="border m-2 p-5">
                  <h1 className="font-bold mb-3">Specific Date & Time<p className="text-blue-600 text-xs float-right">optional</p></h1>

                  <Button
                    aria-describedby={id2}
                    variant="contained"
                    onClick={handlePopoverClick2}
                    className="date font-medium w-full text-xs submit-btn text-white px-3 py-2 rounded bg-slate-200"
                  >
                    {dateTime ? dateTime.toString() : "Date and Time"}
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
                        <StaticDateTimePicker
                          value={dateTime}
                          onChange={handleDateTimeChange}
                        />
                      </LocalizationProvider>
                    </Typography>
                  </Popover>
                </div>{" "}
                <div className="border m-2 p-5">
                  <h1 className="font-bold mt-3 mb-2">Date Range <p className="text-blue-600 text-xs float-right">optional</p></h1>
                  <span className="flex">
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) => setDateRange([item.selection])}
                      moveRangeOnFirstSelection={false}
                      ranges={dateRange}
                    />
                  </span>
                  <p>{dateRange[0].endDate && dateRange[0].startDate.toLocaleDateString() +" to "+dateRange[0].endDate.toLocaleDateString()}</p>
                </div>
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
