import React, { useState } from "react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ParkIcon from "@mui/icons-material/Park";
import SpaIcon from "@mui/icons-material/Spa";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const SeasonSelection = ({ handleFilter }) => {
  const [selectedSeason, setSelectedSeason] = useState("");

  const seasons = [
    {
      name: "All Seasons",
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      icon: <AcUnitIcon />,
    },
    { name: "Spring", months: [3, 4, 5], icon: <SpaIcon /> },
    { name: "Summer", months: [6, 7, 8], icon: <WbSunnyIcon /> },
    { name: "Autumn", months: [9, 10, 11], icon: <ParkIcon /> },
    { name: "Winter", months: [12, 1, 2], icon: <AcUnitIcon /> },
  ];

  const handleSeasonChange = (event) => {
    const selectedSeason = event.target.value;
    setSelectedSeason(selectedSeason);
    const selectedMonths =
      seasons.find((season) => season.name === selectedSeason)?.months || [];
    handleFilter(selectedMonths);
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Season</InputLabel>
        <Select
          className="bg-white w-36"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedSeason}
          label="Select Season"
          onChange={handleSeasonChange}
        >
          {seasons.map((season) => (
            <MenuItem key={season.name} value={season.name}>
              {season.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SeasonSelection;
