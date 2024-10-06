// src/pages/DescendantsList.js
import { React, useState, useContext, useEffect } from "react";
import { LocalizationContext } from "../components/LocalizationContext";
import { Grid, TextField, Autocomplete, Slider, Typography, Box } from "@mui/material";
import data from "../api/descendant.json";
import { getTranslation } from "../translations";
import "../styles/styles.css";

const DescendantStats = () => {
  const { language } = useContext(LocalizationContext);
  const translations = getTranslation(language, "descendantList");

  const [descendant, setDescendant] = useState(() => {
    const cachedDescendant = localStorage.getItem("descendant");
    return cachedDescendant ? JSON.parse(cachedDescendant) : null;
  });
  const [descendantLevel, setDescendantLevel] = useState(() => {
    const cachedDescendantLevel = localStorage.getItem("descendantLevel");
    return cachedDescendantLevel ? JSON.parse(cachedDescendantLevel) : 1;
  });
  const [stats, setStats] = useState({});

  useEffect(() => {
    localStorage.setItem("descendant", JSON.stringify(descendant));
  }, [descendant]);

  useEffect(() => {
    localStorage.setItem("descendantLevel", JSON.stringify(descendantLevel));
  }, [descendantLevel]);

  const handleDescendantChange = (event, newValue) => {
    if (!newValue) {
      setDescendant(null);
      setStats({});
      return;
    }

    const selectedDescendant = data.find((descendant) => descendant.descendant_name === newValue.descendant_name);
    if (selectedDescendant) {
      setDescendant(selectedDescendant);
      setDescendantLevel(1);
      setStats(selectedDescendant.descendant_stat.find((stat) => stat.level === 1).stat_detail.reduce((acc, curr) => ({ ...acc, [curr.stat_type]: curr.stat_value }), {}));
    }
  };

  const handleDescendantLevelChange = (event, newValue) => {
    if (descendant) {
      setDescendantLevel(newValue);
      const selectedStat = descendant.descendant_stat.find((stat) => stat.level === newValue);
      if (selectedStat) {
        setStats(selectedStat.stat_detail.reduce((acc, curr) => ({ ...acc, [curr.stat_type]: curr.stat_value }), {}));
      }
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        left: "10%",
        width: "80%",
        backgroundColor: "inherit",
        justifyItems: "left",
        marginTop: "3%",
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            id="selected-descendant"
            options={data}
            getOptionLabel={(option) => option.descendant_name}
            value={descendant || null} // Update to match the entire object
            onChange={handleDescendantChange}
            renderInput={(params) => <TextField {...params} label={translations.descendantLabel} />}
          />
        </Grid>
        <Grid item xs={12}>
          {descendant && (
            <>
              <Typography id="descendant-level-label" style={{ width: "100%" }}>
                {translations.descendantLevel}
              </Typography>
              <Slider fullWidth valueLabelDisplay="auto" value={descendantLevel} min={1} max={Math.max(...(descendant?.descendant_stat.map((stat) => stat.level) || [1]))} onChange={handleDescendantLevelChange} />
            </>
          )}
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
    </Box>
  );
};

export default DescendantStats;
