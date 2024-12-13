// src/pages/DescendantsList.js
import React, { useState, useContext, useEffect } from "react";
import { LocalizationContext } from "../components/LocalizationContext";
import { Grid, TextField, Autocomplete, Slider, Typography, Box } from "@mui/material";
import data from "../api/descendant.json";
import { getTranslation } from "../translations";
import { useNumberFormatter } from "../components/NumberFormatter";
import "../styles/styles.css";
import { PAGE_TITLE_FORMAT } from "../const";
import { Helmet } from "react-helmet";

const DescendantsList = () => {
  const { language } = useContext(LocalizationContext);
  const formatNumber = useNumberFormatter();
  const translations = getTranslation(language, "descendantsList");

  const pageTitleFormat = localStorage.getItem("pageTitleFormat") || PAGE_TITLE_FORMAT;
  const pageTitle = pageTitleFormat.replaceAll("{name}", getTranslation(language, "navTabs").descendantsList);

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
    localStorage.setItem("descendantLevel", JSON.stringify(descendantLevel));
  }, [descendant, descendantLevel]);

  useEffect(() => {
    if (descendant) {
      const initialStats = descendant.descendant_stat.find((stat) => stat.level === descendantLevel).stat_detail.reduce((acc, curr) => ({ ...acc, [curr.stat_type]: curr.stat_value }), {});
      setStats(initialStats);
    }
  }, [descendant, descendantLevel]);

  const handleDescendantChange = (event, newValue) => {
    if (!newValue) {
      setDescendant(null);
      setStats({});
      return;
    }

    const selectedDescendant = data.find((descendant) => descendant.descendant_name === newValue.descendant_name);
    if (selectedDescendant) {
      setDescendant(selectedDescendant);
      setStats(selectedDescendant.descendant_stat.find((stat) => stat.level === 1).stat_detail.reduce((acc, curr) => ({ ...acc, [curr.stat_type]: curr.stat_value }), {}));
    }
  };

  const handleDescendantLevelChange = (event, newValue) => {
    if (descendant) {
      setDescendantLevel(newValue);
      const selectedStat = descendant.descendant_stat.find((stat) => stat.level === newValue);
      if (selectedStat) {
        const updatedStats = selectedStat.stat_detail.reduce((acc, curr) => ({ ...acc, [curr.stat_type]: curr.stat_value }), {});
        if (JSON.stringify(updatedStats) !== JSON.stringify(stats)) {
          setStats(updatedStats);
        }
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
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
              getOptionLabel={(option) => translations.descendants[option.descendant_name]}
              value={descendant || null}
              onChange={handleDescendantChange}
              renderInput={(params) => <TextField {...params} label={translations.descendantLabel} />}
              renderOption={(props, option) => (
                <Box component="li" sx={{ display: "flex", alignItems: "center" }} {...props}>
                  <img src={option.descendant_image_url} alt={option.descendant_name} style={{ width: 48, height: 48, marginRight: 24 }} />
                  <Typography sx={{ fontSize: 20, fontWeight: 500 }}>{translations.descendants[option.descendant_name]}</Typography>
                </Box>
              )}
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
                label={translations[statType]} // Use localized label if available, otherwise use statType
                value={formatNumber(stats[statType])}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default DescendantsList;
