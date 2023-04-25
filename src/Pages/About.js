import React, { useState } from "react";
import MapView from "../components/MapView";



function About() {
    const [coordinates, setCoordinates] = useState([]);

    // Callback function to handle coordinates change
    const handleCoordinatesChange = (newCoordinates) => {
      // Update the state with the received coordinates
      setCoordinates(newCoordinates);
      console.log("Received Coordinates:", newCoordinates);
      // Perform further processing with the received coordinates as needed
    };

 

    return (
<div>
<MapView onCoordinatesChange={handleCoordinatesChange} />
    <div>
GeoMemoirs is a platform for users around the world to share their Stories and Memories around the world. With a Map view and Year indicator
 GeoMemoirs keeps users memories alive, and accessible to others to read and react to !
</div>

<div>

</div>
</div>
    );
  

}

export default About;
