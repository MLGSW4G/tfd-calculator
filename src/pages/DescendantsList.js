// src/pages/DescendantsList.js
import { React, useState } from "react";
import { Grid, TextField, Autocomplete, Slider } from "@mui/material";
import data from "../api/descendant.json";

const DescendantStats = () => {
  const [descendant, setDescendant] = useState(null);
  const [level, setLevel] = useState(1);
  const [stats, setStats] = useState({});

  const handleDescendantChange = (event, newValue) => {
    if (!newValue) {
      setDescendant(null);
      setStats({});
      return;
    }

    const selectedDescendant = data.find((descendant) => descendant.descendant_name === newValue.descendant_name);
    if (selectedDescendant) {
      setDescendant(selectedDescendant);
      setLevel(1);
      setStats(selectedDescendant.descendant_stat.find((stat) => stat.level === 1).stat_detail.reduce((acc, curr) => ({ ...acc, [curr.stat_type]: curr.stat_value }), {}));
    }
  };

  const handleLevelChange = (event, newValue) => {
    if (descendant) {
      setLevel(newValue);
      const selectedStat = descendant.descendant_stat.find((stat) => stat.level === newValue);
      if (selectedStat) {
        setStats(selectedStat.stat_detail.reduce((acc, curr) => ({ ...acc, [curr.stat_type]: curr.stat_value }), {}));
      }
    }
  };

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            options={data}
            getOptionLabel={(option) => option.descendant_name}
            value={descendant || null} // Update to match the entire object
            onChange={handleDescendantChange}
            renderInput={(params) => <TextField {...params} placeholder="Choose descendant" label="Descendant Name" variant="outlined" />}
          />
        </Grid>
        <Grid item xs={12}>
          {descendant && <Slider fullWidth valueLabelDisplay="auto" value={level} min={1} max={Math.max(...(descendant?.descendant_stat.map((stat) => stat.level) || [1]))} onChange={handleLevelChange} label="Level" />}
        </Grid>
        {Object.keys(stats).map((statType) => (
          <Grid item xs={12} key={statType}>
            <TextField
              fullWidth
              label={statType}
              value={stats[statType]}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default DescendantStats;
