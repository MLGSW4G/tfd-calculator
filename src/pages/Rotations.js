// src/pages/Rotations.js
import React, { useState, useContext, useEffect } from "react";
import jsonRotations from "../api/reward.json";
import missions from "../data/Missions.json";
import "../styles/styles.css";
import { Grid2, Select, MenuItem, FormControl, FormControlLabel, InputLabel, Box, Button, Slider, Typography, Checkbox, ListItemText, Tooltip, Paper, Modal } from "@mui/material";
import { getSkillElementTypeIcon, getSkillArcheTypeIcon, sortRewards } from "../Utils";
import { imageMapping, typeMapping, PAGE_TITLE_FORMAT } from "../const";
import { LocalizationContext } from "../components/LocalizationContext";
import { getTranslation } from "../translations";
import { Helmet } from "react-helmet";
import { DataGridPro } from "@mui/x-data-grid-pro";

const SelectableButton = React.memo(({ key, selected, onClick, tooltipTitle, imgSrc, imgAlt, disabled }) => (
    <Tooltip title={tooltipTitle} key={key}>
        <Button variant={selected ? "contained" : "outlined"} onClick={onClick} sx={{ margin: "1%" }} disabled={disabled}>
            <img src={imgSrc} style={{ height: 40, width: 40, filter: "drop-shadow(0 0 1px rgba(0, 0, 0, 1))" }} alt={imgAlt} />
        </Button>
    </Tooltip>
));

const RotationCard = ({ reward, displayRotation, advancedView, translations, translationsOverview }) => {
    const battleZone = missions[reward.map_name][reward.battle_zone_name];
    return advancedView ? (
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
            <div style={{ background: "#00000077", color: "white", height: "100%", display: "flex", flexDirection: "column", padding: "0 5% 0 5%", justifyContent: "center" }}>
                <div style={{ textAlign: "center", width: "100%", fontSize: 12 }}>
                    {translations.missions[battleZone.missionName]} ({secsToTime(battleZone.duration)}) <br /> {Math.round((battleZone.reactorPerMin + battleZone.staticReactorPerMin) * 100) / 100} {/* round to 2 decimals */}
                </div>
                <div style={{ display: "flex", padding: "5%" }}>
                    <div style={{ flex: 1, className: "rotation-info" }}>
                        <div style={{ display: "flex" }}>{battleZone.reactorPerMin}</div>
                        {reward.reward_type === "Reactor" ? (
                            <>
                                <div style={{ display: "flex" }}>
                                    <img src={getSkillElementTypeIcon(reward.reactor_element_type)} style={{ height: 20, width: 20 }} alt={reward.reactor_element_type} />
                                    <p style={{ margin: "0 0 0 4px" }}>{translationsOverview.skillElementTypes[reward.reactor_element_type]}</p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <img src={getSkillArcheTypeIcon(reward.arche_type)} style={{ height: 20, width: 20 }} alt={reward.arche_type} />
                                    <p style={{ margin: "0 0 0 4px" }}>{translationsOverview.skillArcheTypes[reward.arche_type]}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <img src={typeMapping[reward.reward_type]} style={{ height: 16, width: 16, filter: "drop-shadow(0 0 1px rgba(255, 255, 255, 1))" }} alt={reward.reward_type} />
                                <div style={{ fontSize: 12 }}>{translations.rewardTypes[reward.reward_type]}</div>
                            </>
                        )}
                    </div>
                    <div style={{ flex: 1, className: "static-info" }}>
                        <div style={{ display: "flex" }}>{battleZone.staticReactorPerMin}</div>
                        <div style={{ display: "flex" }}>
                            <img src={getSkillElementTypeIcon(battleZone.staticElementType)} style={{ height: 20, width: 20 }} alt="Element Type Icon" />
                            <p style={{ margin: "0 0 0 4px" }}>{translationsOverview.skillElementTypes[battleZone.staticElementType]}</p>
                        </div>
                        <div style={{ display: "flex" }}>
                            <img src={getSkillArcheTypeIcon(battleZone.staticArcheType)} style={{ height: 20, width: 20 }} alt="Arche Type Icon" />
                            <p style={{ margin: "0 0 0 4px" }}>{translationsOverview.skillArcheTypes[battleZone.staticArcheType]}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    ) : (
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
            {reward.reward_type === "Reactor" ? (
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
                        <img src="assets/Icons/Icon_Tab_Reactor_Big.png" alt="Reactor Icon" style={{ height: 78, width: 78, margin: 0, padding: 0, filter: "drop-shadow(0 0 1px rgba(255, 255, 255, 1))" }} />
                        <p style={{ fontSize: 20, margin: 0 }}>{translations.rewardTypes[reward.reward_type]}</p>
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
                            gap: 5,
                            marginTop: -48,
                            paddingLeft: "2.5%",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <img src={getSkillElementTypeIcon(reward.reactor_element_type)} style={{ height: 26, width: 26 }} alt="Element Type Icon" />
                            <p style={{ margin: "0 0 0 4px" }}>{translationsOverview.skillElementTypes[reward.reactor_element_type]}</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <img src={getSkillArcheTypeIcon(reward.arche_type)} style={{ height: 26, width: 26 }} alt="Arche Type Icon" />
                            <p style={{ margin: "0 0 0 4px" }}>{translationsOverview.skillArcheTypes[reward.arche_type]}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        height: "100%",
                        textShadow: "1px 1px 0px #000",
                        fontFamily: "Falling Sky, NotoSans",
                        color: "white",
                        background: "#00000077",
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
                        <img src={typeMapping[reward.reward_type]} style={{ height: 78, width: 78, filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 1))" }} alt={reward.reward_type} />
                        <p style={{ fontSize: 20, margin: 0 }}>{translations.rewardTypes[reward.reward_type]}</p>
                    </div>
                </div>
            )}
        </Box>
    );
};

const secsToTime = (seconds) => {
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};

const Rotations = () => {
    const { language } = useContext(LocalizationContext);
    const translations = getTranslation(language, "rotations");
    const translationsOverview = getTranslation(language, "overview");
    const translationsUnits = getTranslation(language, "units");

    const pageTitleFormat = localStorage.getItem("pageTitleFormat") || PAGE_TITLE_FORMAT;
    const pageTitle = pageTitleFormat.replaceAll("{name}", getTranslation(language, "navTabs").rotations);

    const [advancedView, setAdvancedView] = useState(() => {
        const saved = localStorage.getItem("advancedView");
        return saved !== null ? JSON.parse(saved) : false; // Parse the saved value or default to false
    });
    const [dataGridView, setDataGridView] = useState(() => {
        const saved = localStorage.getItem("dataGridView");
        return saved !== null ? JSON.parse(saved) : false; // Parse the saved value or default to false
    });

    const [selectedRewardTypes, setSelectedRewardTypes] = useState([]);
    const [selectedReactorElements, setSelectedReactorElements] = useState([]);
    const [selectedArcheTypes, setSelectedArcheTypes] = useState([]);
    const [selectedMaps, setSelectedMaps] = useState([]);
    const [selectedBattleZones, setSelectedBattleZones] = useState([]);
    const [selectedRotation, setSelectedRotation] = useState(0); // Default to 0 for showing all rotations
    const [sortOption, setSortOption] = useState("type");
    const [openModal, setOpenModal] = useState(false);

    const [timeInSeconds, setTimeInSeconds] = useState(0);

    const uniqueRewardTypes = [...new Set(jsonRotations.flatMap((map) => map.battle_zone.flatMap((bz) => bz.reward.map((r) => r.reward_type))))];
    const uniqueReactorElements = [...new Set(jsonRotations.flatMap((map) => map.battle_zone.flatMap((bz) => bz.reward.map((r) => r.reactor_element_type))))].filter(Boolean);
    const uniqueArcheTypes = [...new Set(jsonRotations.flatMap((map) => map.battle_zone.flatMap((bz) => bz.reward.map((r) => r.arche_type))))].filter(Boolean);
    const uniqueMaps = [
        ...new Set(
            jsonRotations
                .filter(
                    (map) => map.battle_zone.some((bz) => bz.reward.length > 0) // Include only maps with at least one battle zone that has rewards
                )
                .map((map) => map.map_name)
        ),
    ];
    const uniqueBattleZones = [
        ...new Set(
            jsonRotations.flatMap(
                (map) =>
                    map.battle_zone
                        .filter((bz) => bz.reward.length > 0) // Include only battle zones with rewards
                        .map((bz) => bz.battle_zone_name) // Map to get the battle zone names
            )
        ),
    ];

    const filteredBattleZones = uniqueBattleZones.filter((bz) => selectedMaps.length === 0 || jsonRotations.some((map) => selectedMaps.includes(map.map_name) && map.battle_zone.some((b) => b.battle_zone_name === bz)));

    const maxRotation = Math.max(...jsonRotations.flatMap((map) => map.battle_zone.flatMap((bz) => bz.reward.map((r) => r.rotation))));

    // Define the base start date for rotation 1 in UTC
    const baseStartDate = new Date(Date.UTC(2024, 11, 3, 7, 0)); // 11.03 fits current rotation, so I'll just leave it like this ¯\_(ツ)_/¯
    const rotationDuration = 7; // 7 days for each rotation

    const daysSinceStart = Math.floor((Date.now() - baseStartDate) / (1000 * 60 * 60 * 24));
    const currentRotation = Math.min(Math.floor(daysSinceStart / rotationDuration) + 1, maxRotation);

    const dataGridRows = [];

    jsonRotations.forEach((map) => {
        const mapName = map.map_name;

        map.battle_zone.forEach((bz) => {
            const battleZoneName = bz.battle_zone_name;

            if (bz.reward.length === 0) {
                return; // Skip if no rewards
            }

            for (let rotation = 1; rotation <= maxRotation; rotation++) {
                const reward = bz.reward.find((r) => r.rotation === rotation);
                const missionDetails = missions[mapName][battleZoneName];

                if (reward && missionDetails) {
                    // Only include rows that match the selectedRotation
                    if (selectedRotation === 0 || reward.rotation === selectedRotation) {
                        dataGridRows.push({
                            id: `${mapName}-${battleZoneName}-${rotation}`,
                            mapName: translations.maps[mapName] || mapName,
                            battleZone: translations.battleZones[battleZoneName] || battleZoneName,
                            missionName: translations.missions[missionDetails.missionName],
                            completionTime: secsToTime(missionDetails.duration),
                            rotation,
                            reactorPerMin: missionDetails.reactorPerMin,
                            staticReactorPerMin: missionDetails.staticReactorPerMin,
                            totalReactorPerMin: Math.round((missionDetails.reactorPerMin + missionDetails.staticReactorPerMin) * 100) / 100,
                            rewardType: translations.rewardTypes[reward.reward_type],
                            reactorElementType: translationsOverview.skillElementTypes[reward.reactor_element_type],
                            archeType: translationsOverview.skillArcheTypes[reward.arche_type],
                            staticElementType: translationsOverview.skillElementTypes[missionDetails.staticElementType],
                            staticArcheType: translationsOverview.skillArcheTypes[missionDetails.staticArcheType],
                        });
                    }
                }
            }
        });
    });

    // Define columns for the DataGrid
    const columns = [
        { field: "id", headerName: translations.id, width: 50 },
        { field: "mapName", headerName: translations.mapName, width: 150 },
        { field: "battleZone", headerName: translations.battleZone, width: 150 },
        { field: "missionName", headerName: translations.missionName, width: 150 },
        { field: "completionTime", headerName: translations.completionTime, width: 150 },
        { field: "rotation", headerName: translations.rotation, width: 50 },
        { field: "totalReactorPerMin", headerName: translations.totalReactorPerMin, width: 200 },
        { field: "reactorPerMin", headerName: translations.reactorPerMin, width: 200 },
        { field: "staticReactorPerMin", headerName: translations.staticReactorPerMin, width: 200 },
        { field: "rewardType", headerName: translations.rewardType, width: 150 },
        { field: "reactorElementType", headerName: translations.reactorElementType, width: 200 },
        { field: "archeType", headerName: translations.archeType, width: 150 },
        { field: "staticElementType", headerName: translations.staticElementType, width: 150 },
        { field: "staticArcheType", headerName: translations.staticArcheType, width: 150 },
    ];

    // Filter the rewards based on selected filters and rotation
    const filteredRewards = jsonRotations.flatMap((map) =>
        map.battle_zone.flatMap((bz) =>
            bz.reward
                .filter(
                    (r) =>
                        (selectedRewardTypes.length ? selectedRewardTypes.includes(r.reward_type) : true) &&
                        (selectedReactorElements.length ? selectedReactorElements.includes(r.reactor_element_type) : true) &&
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

    useEffect(() => {
        localStorage.setItem("advancedView", JSON.stringify(advancedView));
        localStorage.setItem("dataGridView", JSON.stringify(dataGridView));
    }, [advancedView, dataGridView]);

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
                    <FormControlLabel
                        control={
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
                        }
                        label={translations.currentRotation}
                        sx={{ width: "fit-content" }}
                    />
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
                        <MenuItem value="type">{translations.sortByType}</MenuItem>
                        <MenuItem value="battlezone">{translations.sortByBattleZone}</MenuItem>
                    </Select>
                    <FormControlLabel control={<Checkbox checked={dataGridView} onChange={(e) => setDataGridView(!dataGridView)} />} label={translations.dataGridView} sx={{ width: "fit-content" }} />
                    <FormControlLabel control={<Checkbox checked={advancedView} onChange={(e) => setAdvancedView(e.target.checked)} disabled={dataGridView} />} label={translations.showMissionCards} sx={{ width: "fit-content" }} />
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setOpenModal(true);
                        }}
                        sx={{ marginTop: 8 }}
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
            <Box sx={{ marginLeft: "25%", paddingX: 8, marginTop: "-100vh" }}>
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
                {dataGridView ? (
                    <DataGridPro
                        rows={dataGridRows}
                        columns={columns}
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    id: false,
                                },
                            },
                            sorting: {
                                sortModel: [{ field: "mapName", sort: "asc" }],
                            },
                        }}
                        hideFooter
                        sx={{ padding: 1 }}
                    />
                ) : (
                    <Grid2 container sx={{ border: "2px solid black", padding: 0, margin: "1% 0 0", justifyContent: "center" }}>
                        {sortedRewards.map((reward, index) => (
                            <Grid2 item xs={4} key={index} sx={{ justifyContent: "center", padding: 1 }}>
                                <RotationCard
                                    reward={reward}
                                    displayRotation={selectedRotation === 0}
                                    advancedView={advancedView}
                                    translations={translations}
                                    translationsOverview={translationsOverview}
                                    translationsUnits={translationsUnits}
                                />
                            </Grid2>
                        ))}
                    </Grid2>
                )}
            </Box>
        </>
    );
};

export default Rotations;
