// src/pages/Rotations.js
import React, { useState, useContext, useEffect } from "react";
import jsonRotations from "../api/reward.json";
import "../styles/styles.css";
import { Grid, Select, MenuItem, FormControl, InputLabel, Box, Button, Slider, Typography, Checkbox, ListItemText, Tooltip, Paper, Modal } from "@mui/material";
import { getSkillElementTypeIcon, getSkillArcheTypeIcon, getClassIcon2, sortRewards } from "../Utils";
import { imageMapping, typeMapping, PAGE_TITLE_FORMAT } from "../const";
import { LocalizationContext } from "../components/LocalizationContext";
import { getTranslation } from "../translations";
import { Helmet } from "react-helmet";

const SelectableButton = ({ key, selected, onClick, tooltipTitle, imgSrc, imgAlt, disabled }) => (
  <Tooltip title={tooltipTitle} key={key}>
    <Button variant={selected ? "contained" : "outlined"} onClick={onClick} sx={{ margin: "1%" }} disabled={disabled}>
      <img src={imgSrc} style={{ height: 40, width: 40, filter: "drop-shadow(0 0 1px rgba(0, 0, 0, 1))" }} alt={imgAlt} />
    </Button>
  </Tooltip>
);

const RotationContent = ({ type, elementType, ammoType, archeType, size, translations, translationsOverview, translationsModule }) => {
  if (type === "Reactor") {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          height: "100%",
          textShadow: "1px 1px 0px #000",
          fontFamily: "Falling Sky, NotoSans",
          color: "white",
          background: "#00000077",
        }}
      >
        <div
          style={{
            flex: "0 0 35%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src="assets/Icons/Icon_Tab_Reactor_Big.png" alt="Reactor Icon" style={{ height: size * 3, width: size * 3, margin: 0, padding: 0, filter: "drop-shadow(0 0 1px rgba(255, 255, 255, 1))" }} />
          <p style={{ fontSize: 20, margin: 0 }}>{translations.rewardTypes[type]}</p>
        </div>

        <div
          style={{
            position: "absolute",
            width: 2,
            backgroundColor: "#999999aa",
            height: "100px",
            margin: "16px 0px 16px",
            left: "35%",
          }}
        />

        <div
          style={{
            flex: "0 0 65%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "5px",
            marginTop: -16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", paddingLeft: "5%" }}>
            <img src={getSkillElementTypeIcon(elementType)} style={{ height: size, width: size }} alt="Element Type Icon" />
            <p style={{ margin: 0, marginLeft: "4px" }}>{translationsOverview.skillElementTypes[elementType]}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", paddingLeft: "5%" }}>
            <img src={getClassIcon2(ammoType)} style={{ height: size, width: size }} alt="Ammo Type Icon" />
            <p style={{ margin: 0, marginLeft: "4px" }}>{translationsModule.classes[ammoType]}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", paddingLeft: "5%" }}>
            <img src={getSkillArcheTypeIcon(archeType)} style={{ height: size, width: size }} alt="Arche Type Icon" />
            <p style={{ margin: 0, marginLeft: "4px" }}>{translationsOverview.skillArcheTypes[archeType]}</p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
          textShadow: "1px 1px 0px #000",
          fontFamily: "Falling Sky, NotoSans",
          color: "white",
          background: "#00000066",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={typeMapping[type]} style={{ height: size * 3, width: size * 3, margin: 0, padding: 0, filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 1))" }} alt="Default Icon" />
          <p style={{ fontSize: 20, margin: 0 }}>{translations.rewardTypes[type]}</p>
        </div>
      </div>
    );
  }
};

const RotationCard = ({ reward, displayRotation, translations, translationsModule, translationsOverview, translationsUnits }) => {
  return (
    <Box
      sx={{
        background: imageMapping[reward.map_name],
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        height: "190px",
        width: "403px",
        boxShadow: "0 0 0 1px #000, 0 0 0 2px #999, 0 0 0 3px #000",
        display: "flex",
        fontFamily: "Falling Sky, NotoSans",
        flexDirection: "column",
        transition: "box-shadow 0.2s",
        "&:hover": {
          boxShadow: "0 0 0 1px #000, 0 0 0 2px #999, 0 0 0 3px #000, 0 0 0 4px rgb(161, 161, 161), 0 0 0 6px rgba(255, 255, 255, 0.8)",
        },
      }}
    >
      <div
        style={{
          background: "#000000bb",
          height: "48px",
          color: "white",
          display: "flex",
        }}
      >
        <div
          style={{
            fontSize: 24,
            textShadow: "1px 1px 0px #000",
            padding: 8,
          }}
        >
          {translations.battleZones[reward.battle_zone_name]}
        </div>
        {displayRotation && (
          <div
            style={{
              fontSize: 24,
              textShadow: "1px 1px 0px #000",
              padding: 8,
              marginLeft: "auto",
            }}
          >
            {reward.rotation}
          </div>
        )}
      </div>
      <RotationContent
        type={reward.reward_type}
        elementType={reward.reactor_element_type}
        ammoType={reward.weapon_rounds_type}
        archeType={reward.arche_type}
        size={27}
        translations={translations}
        translationsModule={translationsModule}
        translationsOverview={translationsOverview}
        translationsUnits={translationsUnits}
      />
    </Box>
  );
};

const Rotations = () => {
  const { language } = useContext(LocalizationContext);
  const translations = getTranslation(language, "rotations");
  const translationsOverview = getTranslation(language, "overview");
  const translationsModule = getTranslation(language, "module");
  const translationsUnits = getTranslation(language, "units");

  const pageTitleFormat = localStorage.getItem("pageTitleFormat") || PAGE_TITLE_FORMAT;
  const pageTitle = pageTitleFormat.replaceAll("{name}", getTranslation(language, "navTabs").rotations);

  const [selectedRewardTypes, setSelectedRewardTypes] = useState([]);
  const [selectedReactorElements, setSelectedReactorElements] = useState([]);
  const [selectedWeaponRounds, setSelectedWeaponRounds] = useState([]);
  const [selectedArcheTypes, setSelectedArcheTypes] = useState([]);
  const [selectedMaps, setSelectedMaps] = useState([]);
  const [selectedBattleZones, setSelectedBattleZones] = useState([]);
  const [selectedRotation, setSelectedRotation] = useState(0); // Default to 0 for showing all rotations
  const [sortOption, setSortOption] = useState("type");
  const [openModal, setOpenModal] = useState(false);

  const [timeInSeconds, setTimeInSeconds] = useState(0);

  const uniqueRewardTypes = [...new Set(jsonRotations.flatMap((map) => map.battle_zone.flatMap((bz) => bz.reward.map((r) => r.reward_type))))];
  const uniqueReactorElements = [...new Set(jsonRotations.flatMap((map) => map.battle_zone.flatMap((bz) => bz.reward.map((r) => r.reactor_element_type))))].filter(Boolean);
  const uniqueWeaponRounds = [...new Set(jsonRotations.flatMap((map) => map.battle_zone.flatMap((bz) => bz.reward.map((r) => r.weapon_rounds_type))))].filter(Boolean);
  const uniqueArcheTypes = [...new Set(jsonRotations.flatMap((map) => map.battle_zone.flatMap((bz) => bz.reward.map((r) => r.arche_type))))].filter(Boolean);
  const uniqueMaps = [...new Set(jsonRotations.map((map) => (map.battle_zone.length !== 0 ? map.map_name : null)).filter((name) => name !== null))]; // only show maps with rewards
  const uniqueBattleZones = [...new Set(jsonRotations.flatMap((map) => map.battle_zone.map((bz) => bz.battle_zone_name)))];

  const filteredBattleZones = uniqueBattleZones.filter((bz) => selectedMaps.length === 0 || jsonRotations.some((map) => selectedMaps.includes(map.map_name) && map.battle_zone.some((b) => b.battle_zone_name === bz)));

  const maxRotation = Math.max(...jsonRotations.flatMap((map) => map.battle_zone.flatMap((bz) => bz.reward.map((r) => r.rotation))));

  // Define the base start and end dates for rotation 1// Define the base start date for rotation 1 in UTC
  const baseStartDate = new Date(Date.UTC(2024, 6, 30, 7, 0)); // July is month 6 (0-indexed), set to 07:00 UTC
  const rotationDuration = 7; // 7 days for each rotation

  const daysSinceStart = Math.floor((Date.now() - baseStartDate) / (1000 * 60 * 60 * 24));
  const currentRotation = Math.min(Math.floor(daysSinceStart / rotationDuration) + 1, maxRotation);

  // Filter the rewards based on selected filters and rotation
  const filteredRewards = jsonRotations.flatMap((map) =>
    map.battle_zone.flatMap((bz) =>
      bz.reward
        .filter(
          (r) =>
            (selectedRewardTypes.length ? selectedRewardTypes.includes(r.reward_type) : true) &&
            (selectedReactorElements.length ? selectedReactorElements.includes(r.reactor_element_type) : true) &&
            (selectedWeaponRounds.length ? selectedWeaponRounds.includes(r.weapon_rounds_type) : true) &&
            (selectedArcheTypes.length ? selectedArcheTypes.includes(r.arche_type) : true) &&
            (selectedMaps.length ? selectedMaps.includes(map.map_name) : true) &&
            (selectedBattleZones.length ? selectedBattleZones.includes(bz.battle_zone_name) : true) &&
            (selectedRotation === 0 ? true : r.rotation === selectedRotation) // Show all if 0, otherwise filter by rotation
        )
        .map((r) => ({ ...r, map_name: map.map_name, battle_zone_name: bz.battle_zone_name }))
    )
  );

  // Sort the filtered rewards based on the selected sort option
  const sortedRewards = sortRewards(filteredRewards, sortOption);

  const rotationDates = Array.from({ length: maxRotation }, (_, i) => {
    const rotationNumber = i + 1;
    const startDate = new Date(baseStartDate);
    startDate.setDate(startDate.getDate() + (rotationNumber - 1) * rotationDuration);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + rotationDuration - 1);

    return {
      rotation: rotationNumber,
      start: startDate.toLocaleDateString(),
      end: endDate.toLocaleDateString(),
    };
  });

  // Function to calculate the time until the next rotation
  const calculateTimeUntilNextRotation = () => {
    const now = Date.now();
    const nextRotationStartDate = new Date(baseStartDate);
    nextRotationStartDate.setDate(baseStartDate.getDate() + Math.floor((now - baseStartDate) / (1000 * 60 * 60 * 24 * rotationDuration)) * rotationDuration + rotationDuration);

    const timeDifference = nextRotationStartDate - now;

    const timeInSeconds = Math.floor(timeDifference / 1000);
    return timeInSeconds;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const seconds = calculateTimeUntilNextRotation();
      setTimeInSeconds(seconds);
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div
        className="sidebar"
        style={{
          width: "25%",
          position: "sticky",
          top: 0,
          height: "100vh",
          background: "linear-gradient(to bottom, white 95%, rgb(161, 161, 161) 100%)",
          zIndex: 1000,
          overflowY: "auto",
          borderRight: "2px solid black",
        }}
      >
        <Box display="flex" flexDirection="column" padding="2%">
          <Typography>{translations.map}</Typography>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={0.5}>
            {uniqueMaps.map((map) => (
              <Button key={map} variant={selectedMaps.includes(map) ? "contained" : "outlined"} onClick={() => setSelectedMaps((prev) => (prev.includes(map) ? prev.filter((m) => m !== map) : [...prev, map]))}>
                {translations.maps[map]}
              </Button>
            ))}
          </Box>
          <Typography>{translations.rotation}</Typography>
          <Slider
            value={selectedRotation}
            onChange={(e, newValue) => setSelectedRotation(newValue)}
            min={0}
            max={maxRotation}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => {
              return value || translations.all;
            }}
          />
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={selectedRotation === currentRotation}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRotation(currentRotation);
                } else {
                  setSelectedRotation(0); // Reset to show all rotations when unchecked
                }
              }}
            />
            <Typography>{translations.currentRotation}</Typography>
          </Box>
          <Typography>{translations.selectedBattleZones}:</Typography>
          <FormControl>
            <InputLabel>{translations.battleZonesLabel}</InputLabel>
            <Select
              multiple
              value={selectedBattleZones}
              onChange={(e) => setSelectedBattleZones(e.target.value)}
              label={translations.battleZonesLabel}
              renderValue={
                (selected) => selected.map((bz) => translations.battleZones[bz]).join(", ") // Display translated values as a comma-separated string
              }
            >
              {filteredBattleZones.map((bz) => (
                <MenuItem key={bz} value={bz}>
                  <Checkbox checked={selectedBattleZones.indexOf(bz) > -1} />
                  <ListItemText primary={translations.battleZones[bz]} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Typography>{translations.rewardTypesLabel}:</Typography>
            {uniqueRewardTypes.map((rewardType) => (
              <SelectableButton
                key={rewardType}
                selected={selectedRewardTypes.includes(rewardType)}
                onClick={() => {
                  setSelectedRewardTypes((prev) => (prev.includes(rewardType) ? prev.filter((r) => r !== rewardType) : [...prev, rewardType]));
                }}
                tooltipTitle={translations.rewardTypes[rewardType]}
                imgSrc={typeMapping[rewardType]}
                imgAlt={rewardType}
                disabled={!filteredRewards.some((reward) => reward.reward_type === rewardType)}
              />
            ))}
          </Box>
          <Box>
            <Typography>{translations.reactorElements}:</Typography>
            {uniqueReactorElements.map((element) => (
              <SelectableButton
                key={element}
                selected={selectedReactorElements.includes(element)}
                onClick={() => {
                  setSelectedReactorElements((prev) => (prev.includes(element) ? prev.filter((r) => r !== element) : [...prev, element]));
                }}
                tooltipTitle={translationsOverview.skillElementTypes[element]}
                imgSrc={getSkillElementTypeIcon(element)}
                imgAlt={element}
                disabled={!selectedRewardTypes.includes("Reactor") && selectedRewardTypes.length > 0}
              />
            ))}
          </Box>
          <Box>
            <Typography>{translations.weaponRounds}:</Typography>
            {uniqueWeaponRounds.map((round) => (
              <SelectableButton
                key={round}
                selected={selectedWeaponRounds.includes(round)}
                onClick={() => {
                  setSelectedWeaponRounds((prev) => (prev.includes(round) ? prev.filter((r) => r !== round) : [...prev, round]));
                }}
                tooltipTitle={translationsModule.classes[round]}
                imgSrc={getClassIcon2(round)}
                imgAlt={round}
                disabled={!selectedRewardTypes.includes("Reactor") && selectedRewardTypes.length > 0}
              />
            ))}
          </Box>
          <Box>
            <Typography>{translations.archeTypes}:</Typography>
            {uniqueArcheTypes.map((arche) => (
              <SelectableButton
                key={arche}
                selected={selectedArcheTypes.includes(arche)}
                onClick={() => {
                  setSelectedArcheTypes((prev) => (prev.includes(arche) ? prev.filter((a) => a !== arche) : [...prev, arche]));
                }}
                tooltipTitle={translationsOverview.skillArcheTypes[arche]}
                imgSrc={getSkillArcheTypeIcon(arche)}
                imgAlt={arche}
                disabled={!selectedRewardTypes.includes("Reactor") && selectedRewardTypes.length > 0}
              />
            ))}
          </Box>
          <Typography>{translations.sortBy}</Typography>
          <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <MenuItem value="type">{translations.type}</MenuItem>
            <MenuItem value="battlezone">{translations.battleZone}</MenuItem>
          </Select>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenModal(true);
            }}
            sx={{ marginTop: "8px" }}
          >
            {translations.viewRotationDates}
          </Button>
          {openModal && (
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", boxShadow: 24, p: 2, borderRadius: 2 }}>
                <Typography variant="h5" component="h2" textAlign="center">
                  {translations.viewRotationDates}
                </Typography>
                {rotationDates.map(({ rotation, start, end }) => (
                  <Typography key={rotation}>
                    {translations.rotation} {rotation}: {start} - {end}
                  </Typography>
                ))}
              </Box>
            </Modal>
          )}
        </Box>
      </div>
      <Box sx={{ marginLeft: "25%", paddingX: "5%", marginTop: "-100vh" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {translations.currentRotation}:
          </Typography>
          <Paper
            sx={{
              padding: "8px",
              textAlign: "center",
              cursor: "pointer",
              width: "30px",
              height: "30px",
              transition: "outline 100ms ease-in-out",
              "&:hover": {
                outline: "2px solid grey",
              },
            }}
            onClick={() => setSelectedRotation(currentRotation)}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: "24px",
                fontWeight: "bold",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
              }}
            >
              {currentRotation}
            </Typography>
          </Paper>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {translations.countdownLabel}:
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1, // Add space between the boxes
              textAlign: "center",
            }}
          >
            <Paper
              sx={{
                padding: "8px",
                width: "60px",
                height: "60px",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                }}
              >
                {String(Math.floor(timeInSeconds / 3600)).padStart(2, "0")}
              </Typography>
              <Typography variant="body2">{translations.hours}</Typography>
            </Paper>

            <Paper
              sx={{
                padding: "8px",
                width: "60px",
                height: "60px",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                }}
              >
                {String(Math.floor((timeInSeconds % 3600) / 60)).padStart(2, "0")}
              </Typography>
              <Typography variant="body2">{translations.minutes}</Typography>
            </Paper>

            <Paper
              sx={{
                padding: "8px",
                width: "60px",
                height: "60px",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                }}
              >
                {String(timeInSeconds % 60).padStart(2, "0")}
              </Typography>
              <Typography variant="body2">{translations.seconds}</Typography>
            </Paper>
          </Box>
        </Box>
        <Grid container sx={{ border: "2px solid black", padding: 0, margin: "1% 0 0" }}>
          {sortedRewards.map((reward, index) => (
            <Grid item xs={4} key={index} sx={{ display: "flex", justifyContent: "center", paddingX: 1, paddingY: 1 }}>
              <RotationCard reward={reward} displayRotation={selectedRotation === 0} translations={translations} translationsModule={translationsModule} translationsOverview={translationsOverview} translationsUnits={translationsUnits} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Rotations;
