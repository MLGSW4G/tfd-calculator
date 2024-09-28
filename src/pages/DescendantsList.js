import { React, useState } from "react";
import { Grid, MenuItem, Select, Slider, TextField } from "@mui/material";
import data from "./DescendantsList.json";

const DescendantStats = () => {
  const [descendant, setDescendant] = useState(null);
  const [level, setLevel] = useState(1);
  const [stats, setStats] = useState({});

  const handleDescendantChange = (event) => {
    const selectedDescendant = data.find((descendant) => descendant.descendant_name === event.target.value);
    setDescendant(selectedDescendant);
    setLevel(1);
    setStats(selectedDescendant.descendant_stat.find((stat) => stat.level === 1).stat_detail.reduce((acc, curr) => ({ ...acc, [curr.stat_type]: curr.stat_value }), {}));
  };

  const handleLevelChange = (event, newValue) => {
    setLevel(newValue);
    const selectedStat = descendant.descendant_stat.find((stat) => stat.level === newValue);
    setStats(selectedStat.stat_detail.reduce((acc, curr) => ({ ...acc, [curr.stat_type]: curr.stat_value }), {}));
  };

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Select fullWidth placeholder="Choose descendant" value={descendant ? descendant.descendant_name : ""} onChange={handleDescendantChange} label="Descendant Name">
            {data.map((descendant) => (
              <MenuItem key={descendant.descendant_id} value={descendant.descendant_name}>
                {descendant.descendant_name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <Slider fullWidth valueLabelDisplay="auto" value={level} min={1} max={Math.max(...(descendant?.descendant_stat.map((stat) => stat.level) || [1]))} onChange={handleLevelChange} label="Level" />
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
