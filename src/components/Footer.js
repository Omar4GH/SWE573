import React from "react";
import minilogo from "../assets/MiniLogoGeoMemoirs.png";
const Footer = () => {
  return (
    <footer>
      
      <img className="h-auto w-36 inline-block " src={minilogo}/><div className="flex flex-col items-center justify-center w-screen"><div>
      <span>
         {"  "}
        Built by <a className="font-bold text-red-700" href="https://omarghamrawi.net/" target="_blank">Omar Ghamrawi</a> , 
        a project for SWE-573 , Ms.Software Engineering Boğaziçi University 2023 <br/>
        Using ReactJs and NodeJs
      </span></div></div>
    </footer>
  );
};

export default Footer;