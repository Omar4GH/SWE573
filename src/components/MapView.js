import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ onCoordinatesChange }) => {
  let map;
  let marker;

  useEffect(() => {
    map = L.map("map").setView([51.505, -0.09], 13);

    L.tileLayer("https://{s}.tile.jawg.io/5a646c26-4702-40b1-8fed-671eacbf1892/{z}/{x}/{y}{r}.png?access-token=Jsz7VZAnkb84aX0p5Oq8HwK57Vu4YmeRlNf1t7TUaujVsv3eOgqX8IWMoeUQ5DRU", {
      attribution: "<a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors",
    }).addTo(map);

    const handleClick = (e) => {
      const { lat, lng } = e.latlng;
      console.log("Selected location:", lat, lng);

      // Remove the previously added marker from the map
      if (marker) {
        marker.removeFrom(map);
      }

      // Create a marker at the clicked location with a custom icon and add it to the map
      marker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl:
            "https://cdn-icons-png.flaticon.com/512/2377/2377874.png", // Update with a valid icon URL
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        }),
      }).addTo(map);

      // Call the callback function with the clicked coordinates
      onCoordinatesChange({ lat, lng });
    };

    map.on("click", handleClick);

    return () => {
      // Clean up the map and event listener when the component unmounts
      if (map) {
        map.off("click", handleClick);
        map.remove();
      }
    };
  }, []);

  return <div id="map" style={{ height: "400px" }}></div>;
};

export default Map;
