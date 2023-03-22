
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import About from "./Pages/About";

import Feed from "./Pages/Feed";
import Profile from "./Pages/Profile";
import Story from "./Pages/Story";
import WritePost from "./Pages/WritePost";



function App() {


    return (
      <Router>
        
        <Routes>
          <Route path="/" element={<Feed/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/Story" element={<Story/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/writepost" element={<WritePost/>} />
        </Routes>
      </Router>
    );
  

}

export default App;
