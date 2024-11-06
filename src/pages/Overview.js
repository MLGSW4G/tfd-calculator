// src/pages/Overview.js
import React, { useState, useEffect, useContext } from "react";
import { LocalizationContext } from "../components/LocalizationContext";
import { Box, TextField, Grid, Select, MenuItem, Autocomplete, Tooltip, Slider, Typography } from "@mui/material";
import { rows } from "./SkillsList";
import data from "../api/descendant.json";
import jsonData from "./SkillsList.json";
import { colorRare, colorUltimate, colorChill, colorToxic, colorElectric, colorFire, effectsMapping } from "../const";
import { numberToPercents, numberToMeters, numberToSeconds, numberToMPs, getSkillArcheTypeIcon, getSkillElementIcon } from "../Utils";
import ReactorLevels from "./ReactorLevels.json";
import { getTranslation } from "../translations";
import "../styles/styles.css";

const Overview = () => {
  const { language } = useContext(LocalizationContext);
  const translations = getTranslation(language, "overview");
  const translationsDescendantsList = getTranslation(language, "descendantsList");

  const skillElements = [...new Set(jsonData.map((skill) => skill.skillElement))];
  const skillTypes = [...new Set(jsonData.map((skill) => skill.skillType).filter((type) => type !== null))]; // Exclude null types

  const descendantNames = data.map((item) => item.descendant_name);
  const descendantImageUrls = data.map((item) => item.descendant_image_url);
  const descendantSkills = data.map((item) => item.descendant_skill);

  const groupedOptions = descendantNames.reduce((acc, name) => {
    const options = rows.filter((option) => option.descendantName === name);
    options.sort((a, b) => a.skillNumber - b.skillNumber);

    acc[name] = options;
    return acc;
  }, {});

  const reactorLevels = Object.keys(ReactorLevels).map((level) => ({
    value: parseInt(level),
    skillPower: ReactorLevels[level].skill_atk_power,
    subSkillPower: ReactorLevels[level].sub_skill_atk_power,
  }));

  const [selectedSkill, setSelectedSkill] = useState(() => {
    const cachedSelectedSkill = localStorage.getItem("selectedSkill");
    return cachedSelectedSkill ? JSON.parse(cachedSelectedSkill) : null;
  });
  const [skillStats, setSkillStats] = useState(null);
  const [totalSkillPower, setTotalSkillPower] = useState("");
  const [skillStatsWithEffects, setSkillStatsWithEffects] = useState({});

  const [totalEffects, setTotalEffects] = useState(() => {
    const cachedtotalEffects = localStorage.getItem("totalEffects");
    return cachedtotalEffects ? JSON.parse(cachedtotalEffects) : {};
  });

  const [element, setElement] = useState(() => {
    const cachedElement = localStorage.getItem("element");
    return cachedElement ? JSON.parse(cachedElement) : "";
  });
  const [skill, setSkill] = useState(() => {
    const cachedSkill = localStorage.getItem("skill");
    return cachedSkill ? JSON.parse(cachedSkill) : "";
  });

  const appliedElementSkillPower = selectedSkill && selectedSkill.skillElement === element;
  const appliedTypeSkillPower = selectedSkill && selectedSkill.skillType === skill;

  const [optimizationConditionMultiplier, setOptimizationConditionMultiplier] = useState(() => {
    const cachedOptimizationConditionMultiplier = localStorage.getItem("optimizationConditionMultiplier");
    return cachedOptimizationConditionMultiplier ? cachedOptimizationConditionMultiplier : 1;
  });

  const [reactorLevel, setReactorLevel] = useState(() => {
    const cachedReactorLevel = localStorage.getItem("reactorLevel");
    return cachedReactorLevel ? JSON.parse(cachedReactorLevel) : 1;
  });
  const [reactorSkillPower, setReactorSkillPower] = useState(reactorLevels[reactorLevel - 1].skillPower);
  const [subSkillPower, setSubSkillPower] = useState(reactorLevels[reactorLevel - 1].subSkillPower);

  const [reactorEnhancementLevel, setReactorEnhancementLevel] = useState(() => {
    const cachedReactorEnhancementLevel = localStorage.getItem("reactorEnhancementLevel");
    return cachedReactorEnhancementLevel ? parseInt(cachedReactorEnhancementLevel) : 0;
  });

  useEffect(() => {
    const appliedElementSkillPower = selectedSkill && selectedSkill.skillElement === element ? 1.2 : 1;
    const appliedTypeSkillPower = selectedSkill && selectedSkill.skillType === skill ? 1.2 : 1;
    const reactorEnhancementMultiplier = [1, 1.03, 1.06][reactorEnhancementLevel];
    const skillPower = skillStats ? (skillStats.skillPower ? skillStats.skillPower : 1) : 1;
    let totalSkillPowerValue = reactorSkillPower * reactorEnhancementMultiplier * optimizationConditionMultiplier * appliedElementSkillPower * appliedTypeSkillPower * skillPower;

    // Calculate the total skill power with effects
    let elementSkillPowerEffect = 1;

    if (!selectedSkill) {
      Object.keys(totalEffects).forEach((effectKey) => {
        if (effectsMapping[effectKey]) {
          Object.keys(effectsMapping[effectKey]).forEach((statKey) => {
            if (statKey === "skillPower") {
              if (effectKey === "skillPower") {
                const effectValue = totalEffects[effectKey];
                totalSkillPowerValue *= 1 + effectValue;
              }
            }
          });
        }
      });
    } else {
      Object.keys(totalEffects).forEach((effectKey) => {
        if (effectsMapping[effectKey]) {
          Object.keys(effectsMapping[effectKey]).forEach((statKey) => {
            if (statKey === "skillPower") {
              if (effectKey === "nonAttributeSkillPower" || effectKey === "chillSkillPower" || effectKey === "fireSkillPower" || effectKey === "toxinSkillPower" || effectKey === "electricSkillPower") {
                if (skillStats && skillStats.skillElement === effectKey.replace("SkillPower", "")) {
                  const effectValue = totalEffects[effectKey];
                  elementSkillPowerEffect *= 1 + effectValue;
                }
              }
            }
          });
        }
      });
    }

    totalSkillPowerValue *= elementSkillPowerEffect;

    setTotalSkillPower(totalSkillPowerValue);
  }, [reactorSkillPower, reactorEnhancementLevel, optimizationConditionMultiplier, element, skill, totalEffects, skillStats, selectedSkill]);

  useEffect(() => {
    if (selectedSkill) {
      const skillStats = jsonData.find((skill) => skill.skillName === selectedSkill.skillName);
      const skillStatsWithEffects = calculateSkillStatsWithEffects(skillStats, totalEffects);
      setSkillStats(skillStatsWithEffects);
      setSkillStatsWithEffects(skillStatsWithEffects);
    } else {
      setSkillStats({});
      setSkillStatsWithEffects({}); // Reset skillStatsWithEffects to an empty object when selectedSkill is null
    }
  }, [selectedSkill, totalEffects]);

  useEffect(() => {
    localStorage.setItem("selectedSkill", JSON.stringify(selectedSkill));
    localStorage.setItem("element", JSON.stringify(element));
    localStorage.setItem("skill", JSON.stringify(skill));
    localStorage.setItem("optimizationConditionMultiplier", optimizationConditionMultiplier);
    localStorage.setItem("reactorEnhancementLevel", reactorEnhancementLevel);
    localStorage.setItem("reactorLevel", JSON.stringify(reactorLevel));
  }, [selectedSkill, element, skill, optimizationConditionMultiplier, reactorEnhancementLevel, reactorLevel]);

  const handleComboBoxChange = (event, value) => {
    setSelectedSkill(value);
  };

  const filterOptions = (options, { inputValue }) => {
    const lowercasedInput = inputValue.toLowerCase();
    return options.filter((option) => {
      const translatedDescendantName = translationsDescendantsList.descendants[option.descendantName];
      const translatedSkillName = translations.skillNames[option.skillName];
      const skillImageUrl = descendantSkills.find((skill) => skill.descendant_name === option.descendantName && skill.skill_name === option.skillName)?.skill_image_url;
      return (
        (translatedDescendantName && translatedDescendantName.toLowerCase().includes(lowercasedInput)) ||
        (translatedSkillName && translatedSkillName.toLowerCase().includes(lowercasedInput)) ||
        (skillImageUrl && skillImageUrl.toLowerCase().includes(lowercasedInput))
      );
    });
  };

  const calculateSkillDamage = (skillPower, modifier, optimizationConditionMultiplier) => {
    return skillPower * appliedElementSkillPower * appliedTypeSkillPower * (modifier || 0) * optimizationConditionMultiplier;
  };

  const calculateSkillStatsWithEffects = (skillStats, totalEffects) => {
    const skillStatsWithEffects = { ...skillStats };

    Object.keys(totalEffects).forEach((effectKey) => {
      if (effectsMapping[effectKey]) {
        Object.keys(effectsMapping[effectKey]).forEach((statKey) => {
          if (skillStatsWithEffects[statKey] !== undefined) {
            const effectValue = totalEffects[effectKey];
            const effectFunction = effectsMapping[effectKey][statKey](effectValue);
            skillStatsWithEffects[statKey] = effectFunction(skillStatsWithEffects); // Apply the effect to skillStatsWithEffects
          }
        });
      }
    });

    return skillStatsWithEffects;
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
            id="selected-skill"
            options={Object.values(groupedOptions).flat()}
            groupBy={(option) => {
              const descendantName = Object.keys(groupedOptions).find((key) => groupedOptions[key].includes(option));
              return descendantName;
            }}
            getOptionLabel={(option) => `${option.skillNumber}. ${translations.skillNames[option.skillName] || option.skillName}`}
            renderGroup={(params) => {
              const descendantImageUrl = descendantImageUrls[descendantNames.indexOf(params.group)];
              return (
                <Tooltip
                  title={
                    <div style={{ fontSize: 16 }}>
                      <div>{translationsDescendantsList.descendants[params.group]}</div>
                      <div>
                        {translations.descendantIndex}: {descendantNames.indexOf(params.group)}
                      </div>
                      <div>
                        {translations.descendantId}: {data[descendantNames.indexOf(params.group)].descendant_id}
                      </div>
                    </div>
                  }
                  enterDelay={0}
                  placement="top"
                  followCursor
                >
                  <Box key={params.key}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 0,
                        boxShadow: "inset 0px 0px 0px 2px black",
                        borderRadius: "4px",
                        padding: "8px",
                        fontWeight: "bold",
                        pointerEvents: "none",
                      }}
                    >
                      <img src={descendantImageUrl} style={{ width: 48, height: 48, padding: "0px", margin: "0px", marginLeft: "12px", marginRight: "24px" }} alt={params.group} />
                      <Typography fontSize={24}>{translationsDescendantsList.descendants[params.group]}</Typography>
                    </Box>
                    {params.children}
                  </Box>
                </Tooltip>
              );
            }}
            renderOption={(props, option) => {
              const descendantIndex = descendantNames.indexOf(option.descendantName);
              const skillImageUrl = descendantSkills[descendantIndex].find((skill) => skill.skill_name === option.skillName)?.skill_image_url;
              const skillElement = descendantSkills[descendantIndex].find((skill) => skill.skill_name === option.skillName)?.element_type;
              const skillArcheType = descendantSkills[descendantIndex].find((skill) => skill.skill_name === option.skillName)?.arche_type;

              return (
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: `${skillElement === "Fire" ? colorFire : skillElement === "Electric" ? colorElectric : skillElement === "Toxic" ? colorToxic : skillElement === "Chill" ? colorChill : "#404040"}`,
                        border: "2px solid black",
                        borderRadius: "4px",
                        filter: "brightness(0.8) grayscale(30%)",
                        color: "white",
                      },
                    },
                  }}
                  enterDelay={0}
                  renderOption
                  title={
                    skillImageUrl && (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <img src={skillImageUrl} style={{ width: 48, height: 48, border: "2px solid white", borderRadius: "4px" }} alt={option.skillName} />

                        <Grid container spacing={1} alignItems="left">
                          <Grid item>
                            <Typography variant="body2">
                              <img src={getSkillElementIcon(skillElement)} style={{ verticalAlign: "bottom", width: 24, height: 24, marginRight: 0 }} />
                              {translations.skillElements[skillElement]}
                            </Typography>
                          </Grid>

                          {skillArcheType && (
                            <Grid item>
                              <Typography variant="body2">
                                <img src={getSkillArcheTypeIcon(skillArcheType)} style={{ verticalAlign: "bottom", width: 24, height: 24, marginRight: 0 }} />
                                {translations.skillArcheTypes[skillArcheType]}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>

                        <Typography variant="body2" style={{ fontSize: 24, textAlign: "left", width: "100%" }}>
                          {translations.skillNames[option.skillName]}
                        </Typography>

                        <hr style={{ width: "100%" }}></hr>

                        <Typography variant="body2">{translations.skillDescriptions[option.skillName]}</Typography>
                      </div>
                    )
                  }
                  placement="top"
                  followCursor
                >
                  <li {...props}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img src={skillImageUrl} style={{ width: 48, height: 48, marginRight: 24, filter: "brightness(0)" }} alt={option.skillName} />
                      <div style={{ fontSize: 20 }}>{`${option.skillNumber}. ${translations.skillNames[option.skillName] || option.skillName}`}</div>
                    </div>
                  </li>
                </Tooltip>
              );
            }}
            value={selectedSkill}
            onChange={handleComboBoxChange}
            filterOptions={filterOptions}
            renderInput={(params) => <TextField {...params} label={translations.selectedSkillPlaceholder} />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography>{translations.element}</Typography>
          <Tooltip title={appliedElementSkillPower ? translations.elementTooltip : ""} arrow>
            <Select
              value={element}
              onChange={(event) => setElement(event.target.value)}
              style={{
                minWidth: 200,
                border: element === selectedSkill?.skillElement ? "2px dashed lightblue" : "2px solid transparent",
                transition: "border 0.3s ease", // Smooth transition for border
              }}
            >
              <MenuItem value="">
                <div style={{ marginLeft: "28px" }}>{translations.none}</div>
              </MenuItem>
              {skillElements.map((element) => (
                <MenuItem
                  key={element}
                  value={element}
                  style={{
                    border: element === selectedSkill?.skillElement ? "2px solid lightblue" : "none",
                  }}
                >
                  <img src={getSkillElementIcon(element)} alt={element} style={{ width: 24, height: 24, marginRight: 4, verticalAlign: "bottom" }} />
                  {translations.skillElements[element] || element}
                </MenuItem>
              ))}
            </Select>
          </Tooltip>
        </Grid>

        <Grid item xs={6}>
          <Typography>{translations.type}</Typography>
          <Tooltip title={appliedTypeSkillPower ? translations.typeTooltip : ""} arrow>
            <Select
              value={skill}
              onChange={(event) => setSkill(event.target.value)}
              style={{
                minWidth: 200,
                border: skill === selectedSkill?.skillType ? "2px dashed lightblue" : "2px solid transparent",
                transition: "border 0.3s ease", // Smooth transition for border
              }}
            >
              <MenuItem value="">
                <div style={{ marginLeft: "28px" }}>{translations.none}</div>
              </MenuItem>
              {skillTypes.map((type) => (
                <MenuItem
                  key={type}
                  value={type}
                  style={{
                    border: type === selectedSkill?.skillType ? "2px solid lightblue" : "none",
                  }}
                >
                  <img src={getSkillArcheTypeIcon(type)} alt={type} style={{ width: 24, height: 24, marginRight: 4, verticalAlign: "bottom" }} />
                  {translations.skillArcheTypes[type] || type}
                </MenuItem>
              ))}
            </Select>
          </Tooltip>
        </Grid>

        <Grid item xs={6}>
          <Typography>{translations.optimizationCondition}</Typography>
          <Select
            value={optimizationConditionMultiplier}
            onChange={(event) => setOptimizationConditionMultiplier(event.target.value)}
            sx={{
              "& .MuiSelect-select": {
                backgroundColor: optimizationConditionMultiplier === "1.4" ? colorRare : optimizationConditionMultiplier === "1.6" ? colorUltimate : null,
              },
            }}
            style={{ minWidth: 200 }}
          >
            <MenuItem value="1">100%</MenuItem>

            <MenuItem value="1.4" sx={{ color: colorRare }}>
              140%
            </MenuItem>

            <MenuItem value="1.6" sx={{ color: colorUltimate }}>
              160%
            </MenuItem>
          </Select>
        </Grid>

        <Grid item xs={6}>
          <Typography>{translations.reactorEnhancement}</Typography>
          <Select value={reactorEnhancementLevel} onChange={(event) => setReactorEnhancementLevel(event.target.value)} style={{ minWidth: 200 }}>
            <MenuItem value={0}>{translations.none}</MenuItem>

            <MenuItem value={1}>
              <Tooltip enterDelay={0} title={translations.reactorUpgrade1Tooltip} placement="right">
                <div>{translations.reactorUpgrade1}</div>
              </Tooltip>
            </MenuItem>

            <MenuItem value={2}>
              <Tooltip enterDelay={0} title={translations.reactorUpgrade2Tooltip} placement="right">
                <div>{translations.reactorUpgrade2}</div>
              </Tooltip>
            </MenuItem>
          </Select>
        </Grid>

        <Grid item xs={12} display="flex">
          <Typography id="reactor-level-label" style={{ width: "100%" }}>
            {translations.reactorLevel}
            <Slider
              id="reactor-level"
              valueLabelDisplay="auto"
              value={reactorLevel}
              onChange={(event, newValue) => {
                setReactorLevel(newValue);
                const selectedReactorLevel = reactorLevels.find((level) => level.value === newValue);
                if (selectedReactorLevel) {
                  setReactorSkillPower(selectedReactorLevel.skillPower);
                  setSubSkillPower(selectedReactorLevel.subSkillPower);
                }
              }}
              min={Math.min(...reactorLevels.map((level) => level.value))}
              max={100}
            />
          </Typography>
        </Grid>

        <Grid item xs={12} display="flex">
          <TextField
            fullWidth
            id="total-skill-power"
            label={translations.totalSkillPower}
            variant="standard"
            value={totalSkillPower != null ? Number(totalSkillPower).toFixed(2) : null}
            InputProps={{
              readOnly: true,
              inputProps: {
                style: { textAlign: "right" },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} display="flex">
          <TextField
            fullWidth
            id="total-effects"
            label={translations.totalEffects}
            variant="standard"
            multiline
            rows={Object.keys(totalEffects).length}
            value={Object.keys(totalEffects)
              .map((key) => `${key}: ${totalEffects[key]}`)
              .join("\n")}
            InputProps={{
              readOnly: true,
              inputProps: {
                style: { textAlign: "left" },
              },
            }}
          />
        </Grid>
        {skillStatsWithEffects && Object.keys(skillStatsWithEffects).includes("cooldown") && (
          <Grid item className="stat-field" xs={12} display="flex">
            <TextField
              fullWidth
              id="cooldown"
              label={translations.cooldown}
              variant="standard"
              value={numberToSeconds(skillStatsWithEffects.cooldown)}
              InputProps={{
                readOnly: true,
                inputProps: {
                  style: { textAlign: "right" },
                },
              }}
            />
          </Grid>
        )}

        {skillStatsWithEffects && Object.keys(skillStatsWithEffects).includes("cost1") && (
          <Grid item className="stat-field" xs={12} display="flex">
            <TextField
              fullWidth
              id="cost1"
              label={translations.cost1}
              variant="standard"
              value={numberToMPs(skillStatsWithEffects.cost1)}
              InputProps={{
                readOnly: true,
                inputProps: {
                  style: { textAlign: "right" },
                },
              }}
            />
          </Grid>
        )}

        {skillStatsWithEffects && Object.keys(skillStatsWithEffects).includes("cost2") && (
          <Grid item className="stat-field" xs={12} display="flex">
            <TextField
              fullWidth
              id="cost2"
              label={translations.cost2}
              variant="standard"
              value={numberToMPs(skillStatsWithEffects.cost2)}
              InputProps={{
                readOnly: true,
                inputProps: {
                  style: { textAlign: "right" },
                },
              }}
            />
          </Grid>
        )}

        {skillStatsWithEffects && Object.keys(skillStatsWithEffects).includes("duration1") && (
          <Grid item className="stat-field" xs={12} display="flex">
            <TextField
              fullWidth
              id="duration1"
              label={translations.duration1}
              variant="standard"
              value={numberToSeconds(skillStatsWithEffects.duration1)}
              InputProps={{
                readOnly: true,
                inputProps: {
                  style: { textAlign: "right" },
                },
              }}
            />
          </Grid>
        )}

        {skillStatsWithEffects && Object.keys(skillStatsWithEffects).includes("duration2") && (
          <Grid item className="stat-field" xs={12} display="flex">
            <TextField
              fullWidth
              id="duration2"
              label={translations.duration2}
              variant="standard"
              value={numberToSeconds(skillStatsWithEffects.duration2)}
              InputProps={{
                readOnly: true,
                inputProps: {
                  style: { textAlign: "right" },
                },
              }}
            />
          </Grid>
        )}

        {skillStatsWithEffects && Object.keys(skillStatsWithEffects).includes("interval") && (
          <Grid item className="stat-field" xs={12} display="flex">
            <TextField
              fullWidth
              id="interval"
              label={translations.interval}
              variant="standard"
              value={numberToSeconds(skillStatsWithEffects.interval)}
              InputProps={{
                readOnly: true,
                inputProps: {
                  style: { textAlign: "right" },
                },
              }}
            />
          </Grid>
        )}

        {skillStatsWithEffects && Object.keys(skillStatsWithEffects).includes("range1") && (
          <Grid item className="stat-field" xs={12} display="flex">
            <TextField
              fullWidth
              id="range1"
              label={translations.range1}
              variant="standard"
              value={numberToMeters(skillStatsWithEffects.range1)}
              InputProps={{
                readOnly: true,
                inputProps: {
                  style: { textAlign: "right" },
                },
              }}
            />
          </Grid>
        )}

        {skillStatsWithEffects && Object.keys(skillStatsWithEffects).includes("range2") && (
          <Grid item className="stat-field" xs={12} display="flex">
            <TextField
              fullWidth
              id="range2"
              label={translations.range2}
              variant="standard"
              value={numberToMeters(skillStatsWithEffects.range2)}
              InputProps={{
                readOnly: true,
                inputProps: {
                  style: { textAlign: "right" },
                },
              }}
            />
          </Grid>
        )}

        {skillStatsWithEffects && skillStatsWithEffects.modifier1 && (
          <Grid item className="stat-field" xs={12} display="flex">
            <Tooltip enterDelay={0} title={`${translations.modifier}: ${numberToPercents(skillStatsWithEffects.modifier1)}`}>
              <TextField
                fullWidth
                id="skill-damage1"
                label={translations.skillDamage1}
                variant="standard"
                value={Math.floor(calculateSkillDamage(totalSkillPower, skillStatsWithEffects.modifier1, optimizationConditionMultiplier))}
                InputProps={{
                  readOnly: true,
                  inputProps: {
                    style: { textAlign: "right" },
                  },
                }}
              />
            </Tooltip>
          </Grid>
        )}

        {skillStatsWithEffects && skillStatsWithEffects.modifier2 && (
          <Grid item className="stat-field" xs={12} display="flex">
            <Tooltip enterDelay={0} title={`${translations.modifier}: ${numberToPercents(skillStatsWithEffects.modifier2)}`}>
              <TextField
                fullWidth
                id="skill-damage2"
                label={translations.skillDamage2}
                variant="standard"
                value={Math.floor(calculateSkillDamage(totalSkillPower, skillStatsWithEffects.modifier2, optimizationConditionMultiplier))}
                InputProps={{
                  readOnly: true,
                  inputProps: {
                    style: { textAlign: "right" },
                  },
                }}
              />
            </Tooltip>
          </Grid>
        )}

        {skillStatsWithEffects && skillStatsWithEffects.modifier3 && (
          <Grid item className="stat-field" xs={12} display="flex">
            <Tooltip enterDelay={0} title={`${translations.modifier}: ${numberToPercents(skillStatsWithEffects.modifier3)}`}>
              <TextField
                fullWidth
                id="skill-damage3"
                label={translations.skillDamage3}
                variant="standard"
                value={Math.floor(calculateSkillDamage(totalSkillPower, skillStatsWithEffects.modifier3, optimizationConditionMultiplier))}
                InputProps={{
                  readOnly: true,
                  inputProps: {
                    style: { textAlign: "right" },
                  },
                }}
              />
            </Tooltip>
          </Grid>
        )}

        {skillStatsWithEffects && skillStatsWithEffects.modifier4 && (
          <Grid item className="stat-field" xs={12} display="flex">
            <Tooltip enterDelay={0} title={`${translations.modifier}: ${numberToPercents(skillStatsWithEffects.modifier4)}`}>
              <TextField
                fullWidth
                id="skill-damage4"
                label={translations.skillDamage4}
                variant="standard"
                value={Math.floor(calculateSkillDamage(totalSkillPower, skillStatsWithEffects.modifier4, optimizationConditionMultiplier))}
                InputProps={{
                  readOnly: true,
                  inputProps: {
                    style: { textAlign: "right" },
                  },
                }}
              />
            </Tooltip>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Overview;
