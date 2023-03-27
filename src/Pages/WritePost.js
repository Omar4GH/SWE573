import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import Navbar from "../components/Navbar";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';



function WritePost() {
    
    const state = useLocation().state;
    const [value, setValue] = useState(state?.title || "");
    const [title, setTitle] = useState(state?.desc || "");
    const [file, setFile] = useState(null);
    const [year, setYear] = useState("");
  
    const navigate = useNavigate()
  
    const upload = async () => {
  
    };
  
    const handleClick = async (e) => {
      e.preventDefault();
     // const imgUrl = await upload();
    // axios POST to backend
    
    };
  
 
function valuetext(value) {
    setYear(value);
   // return `${value}`;
  }

    return (
<div>
<h1>Post a Story</h1>
<div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Title"
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
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input
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
            <button>Save as a draft</button>
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>
        <div className="item">
          <h1>YEAR</h1>{year}
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
