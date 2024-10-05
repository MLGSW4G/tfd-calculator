// src/pages/Overview.js
import React, { useState, useEffect } from "react";
import { Box, TextField, Grid, Checkbox, Select, MenuItem, Autocomplete, Tooltip, FormControlLabel, Slider, Typography } from "@mui/material";
import { sortedRows } from "./SkillsList";
import { colorRare, colorUltimate } from "../const";
import "../styles/styles.css";
import { numberToPercents, numberToMeters, numberToSeconds, numberToMPs } from "../Utils";
import ReactorLevels from "./ReactorLevels.json";

export default function Overview() {
  const reactorLevels = Object.keys(ReactorLevels).map((level) => ({
    value: parseInt(level),
    skillPower: ReactorLevels[level].skill_atk_power,
    subSkillPower: ReactorLevels[level].sub_skill_atk_power,
  }));

  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillStats, setSkillStats] = useState(null);
  const [totalSkillPower, setTotalSkillPower] = useState("");
  const [skillStatsWithEffects, setSkillStatsWithEffects] = useState({});

  const [totalEffects, setTotalEffects] = useState(() => {
    const cachedtotalEffects = localStorage.getItem("totalEffects");
    return cachedtotalEffects ? JSON.parse(cachedtotalEffects) : {};
  });

  const [element, setElement] = useState(() => {
    const cachedElement = localStorage.getItem("element");
    return cachedElement ? JSON.parse(cachedElement) : false;
  });
  const [skill, setSkill] = useState(() => {
    const cachedSkill = localStorage.getItem("skill");
    return cachedSkill ? JSON.parse(cachedSkill) : false;
  });

  const [optimizationCondition, setOptimizationCondition] = useState(() => {
    const cachedOptimizationCondition = localStorage.getItem("optimizationCondition");
    return cachedOptimizationCondition ? JSON.parse(cachedOptimizationCondition) : false;
  });

  const [optimizationConditionMultiplier, setOptimizationConditionMultiplier] = useState(() => {
    const cachedOptimizationConditionMultiplier = localStorage.getItem("optimizationConditionMultiplier");
    return cachedOptimizationConditionMultiplier ? cachedOptimizationConditionMultiplier : "140%";
  });

  const [reactorLevel, setReactorLevel] = useState(() => {
    const cachedReactorLevel = localStorage.getItem("reactorLevel");
    return cachedReactorLevel ? JSON.parse(cachedReactorLevel) : 1;
  });
  const [reactorSkillPower, setReactorSkillPower] = useState(reactorLevels[reactorLevel - 1].skillPower);
  const [subSkillPower, setSubSkillPower] = useState(reactorLevels[reactorLevel - 1].subSkillPower);

  const [reactorEnhancement, setReactorEnhancement] = useState(() => {
    const cachedReactorEnhancement = localStorage.getItem("reactorEnhancement");
    return cachedReactorEnhancement ? JSON.parse(cachedReactorEnhancement) : false;
  });

  const [reactorEnhancementLevel, setReactorEnhancementLevel] = useState(() => {
    const cachedReactorEnhancementLevel = localStorage.getItem("reactorEnhancementLevel");
    return cachedReactorEnhancementLevel ? parseInt(cachedReactorEnhancementLevel) : 1;
  });

  const specialCases = {
    "Lightning Emission": {
      modifier1: (skillStats, value) => skillStats.modifier1 + value,
      modifier2: (skillStats, value) => skillStats.modifier1 * 2.35,
      modifier3: (skillStats, value) => skillStats.modifier3 + value,
      modifier4: (skillStats, value) => skillStats.modifier4 + value,
    },
    "HV Lightning Emission": {
      modifier1: (skillStats, value) => skillStats.modifier1 + value,
      modifier2: (skillStats, value) => skillStats.modifier1 * 2.35,
      modifier3: (skillStats, value) => skillStats.modifier3 + value,
      modifier4: (skillStats, value) => skillStats.modifier4 + value,
    },
  };

  const effectsMapping = {
    skillPowerModifier: {
      modifier1: (value) => (skillStats) => specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier1(skillStats, value) : skillStats.modifier1 + value,
      modifier2: (value) => (skillStats) => specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier2(skillStats, value) : skillStats.modifier2 + value,
      modifier3: (value) => (skillStats) => specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier3(skillStats, value) : skillStats.modifier3 + value,
      modifier4: (value) => (skillStats) => specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier4(skillStats, value) : skillStats.modifier4 + value,
    },
    fusionSkillPowerModifier: {
      modifier1: (value) => (skillStats) => skillStats.skillType === "Fusion" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier1(skillStats, value) : skillStats.modifier1 + value) : skillStats.modifier1,
      modifier2: (value) => (skillStats) => skillStats.skillType === "Fusion" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier2(skillStats, value) : skillStats.modifier2 + value) : skillStats.modifier2,
      modifier3: (value) => (skillStats) => skillStats.skillType === "Fusion" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier3(skillStats, value) : skillStats.modifier3 + value) : skillStats.modifier3,
      modifier4: (value) => (skillStats) => skillStats.skillType === "Fusion" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier4(skillStats, value) : skillStats.modifier4 + value) : skillStats.modifier4,
    },
    singularSkillPowerModifier: {
      modifier1: (value) => (skillStats) => skillStats.skillType === "Singular" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier1(skillStats, value) : skillStats.modifier1 + value) : skillStats.modifier1,
      modifier2: (value) => (skillStats) => skillStats.skillType === "Singular" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier2(skillStats, value) : skillStats.modifier2 + value) : skillStats.modifier2,
      modifier3: (value) => (skillStats) => skillStats.skillType === "Singular" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier3(skillStats, value) : skillStats.modifier3 + value) : skillStats.modifier3,
      modifier4: (value) => (skillStats) => skillStats.skillType === "Singular" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier4(skillStats, value) : skillStats.modifier4 + value) : skillStats.modifier4,
    },
    dimensionSkillPowerModifier: {
      modifier1: (value) => (skillStats) => skillStats.skillType === "Dimension" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier1(skillStats, value) : skillStats.modifier1 + value) : skillStats.modifier1,
      modifier2: (value) => (skillStats) => skillStats.skillType === "Dimension" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier2(skillStats, value) : skillStats.modifier2 + value) : skillStats.modifier2,
      modifier3: (value) => (skillStats) => skillStats.skillType === "Dimension" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier3(skillStats, value) : skillStats.modifier3 + value) : skillStats.modifier3,
      modifier4: (value) => (skillStats) => skillStats.skillType === "Dimension" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier4(skillStats, value) : skillStats.modifier4 + value) : skillStats.modifier4,
    },
    techSkillPowerModifier: {
      modifier1: (value) => (skillStats) => skillStats.skillType === "Tech" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier1(skillStats, value) : skillStats.modifier1 + value) : skillStats.modifier1,
      modifier2: (value) => (skillStats) => skillStats.skillType === "Tech" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier2(skillStats, value) : skillStats.modifier2 + value) : skillStats.modifier2,
      modifier3: (value) => (skillStats) => skillStats.skillType === "Tech" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier3(skillStats, value) : skillStats.modifier3 + value) : skillStats.modifier3,
      modifier4: (value) => (skillStats) => skillStats.skillType === "Tech" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier4(skillStats, value) : skillStats.modifier4 + value) : skillStats.modifier4,
    },
    skillPower: {
      skillPower: (value) => (skillStats) => skillStats.skillPower * (1 + value),
    },
    nonAttributeSkillPower: {
      skillPower: (value) => (skillStats) => skillStats.skillElement === "Non-Attribute" ? skillStats.skillPower * (1 + value) : skillStats.skillPower,
    },
    chillSkillPower: {
      skillPower: (value) => (skillStats) => skillStats.skillElement === "Chill" ? skillStats.skillPower * (1 + value) : skillStats.skiltPower,
    },
    fireSkillPower: {
      skillPower: (value) => (skillStats) => skillStats.skillElement === "Fire" ? skillStats.skillPower * (1 + value) : skillStats.skillPower,
    },
    toxinSkillPower: {
      skillPower: (value) => (skillStats) => skillStats.skillElement === "Toxin" ? skillStats.skillPower * (1 + value) : skillStats.skillPower,
    },
    electricSkillPower: {
      skillPower: (value) => (skillStats) => skillStats.skillElement === "Electric" ? skillStats.skillPower * (1 + value) : skillStats.skillPower,
    },
    skillCooldown: {
      cooldown: (value) => (skillStats) => skillStats.cooldown * (1 + value),
    },
    skillCost: {
      cost1: (value) => (skillStats) => skillStats.cost1 * (1 + value),
      cost2: (value) => (skillStats) => skillStats.cost2 * (1 + value),
    },
    skillDuration: {
      duration1: (value) => (skillStats) => skillStats.duration1 * (1 + value),
      duration2: (value) => (skillStats) => skillStats.duration2 * (1 + value),
    },
    skillEffectRange: {
      range1: (value) => (skillStats) => skillStats.range1 * (1 + value),
      range2: (value) => (skillStats) => skillStats.range2 * (1 + value),
    },
  };

  useEffect(() => {
    const optimizationConditionMultiplierValue = optimizationCondition ? parseFloat(optimizationConditionMultiplier) / 100 : 1;
    const appliedElementSkillPower = element ? 1.2 : 1;
    const appliedTypeSkillPower = skill ? 1.2 : 1;
    const reactorEnhancementMultiplier = reactorEnhancement ? [1.03, 1.06][reactorEnhancementLevel - 1] : 1;
    const skillPower = skillStats ? (skillStats.skillPower ? skillStats.skillPower : 1) : 1;
    let totalSkillPowerValue = reactorSkillPower * reactorEnhancementMultiplier * optimizationConditionMultiplierValue * appliedElementSkillPower * appliedTypeSkillPower * skillPower;

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
  }, [reactorSkillPower, reactorEnhancementLevel, reactorEnhancement, optimizationCondition, optimizationConditionMultiplier, element, skill, totalEffects, skillStats, selectedSkill]);

  useEffect(() => {
    if (selectedSkill) {
      import(`../pages/skills/${selectedSkill.skillName.replaceAll(" ", "")}.js`)
        .then((module) => {
          const skillStatsWithEffects = calculateSkillStatsWithEffects(module.default, totalEffects);
          setSkillStats(skillStatsWithEffects);
          setSkillStatsWithEffects(skillStatsWithEffects);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setSkillStats({});
      setSkillStatsWithEffects({}); // Reset skillStatsWithEffects to an empty object when selectedSkill is null
    }
  }, [selectedSkill, totalEffects]);

  useEffect(() => {
    localStorage.setItem("element", JSON.stringify(element));
  }, [element]);

  useEffect(() => {
    localStorage.setItem("skill", JSON.stringify(skill));
  }, [skill]);

  useEffect(() => {
    localStorage.setItem("optimizationCondition", JSON.stringify(optimizationCondition));
  }, [optimizationCondition]);

  useEffect(() => {
    localStorage.setItem("optimizationConditionMultiplier", optimizationConditionMultiplier);
  }, [optimizationConditionMultiplier]);

  useEffect(() => {
    localStorage.setItem("reactorLevel", JSON.stringify(reactorLevel));
  }, [reactorLevel]);

  useEffect(() => {
    localStorage.setItem("reactorEnhancement", JSON.stringify(reactorEnhancement));
  }, [reactorEnhancement]);

  useEffect(() => {
    localStorage.setItem("reactorEnhancementLevel", reactorEnhancementLevel.toString());
  }, [reactorEnhancementLevel]);

  const handleComboBoxChange = (event, value) => {
    setSelectedSkill(value);
  };

  const filterOptions = (options, { inputValue }) => {
    const lowercasedInput = inputValue.toLowerCase();
    return options.filter((option) => option.skillName.toLowerCase().includes(lowercasedInput) || option.descendant.toLowerCase().includes(lowercasedInput));
  };

  const calculateSkillDamage = (skillPower, modifier, elementChecked, typeChecked, optimizationConditionMultiplier) => {
    let appliedElementSkillPower = elementChecked ? 1.2 : 1;
    let appliedTypeSkillPower = typeChecked ? 1.2 : 1;
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
        left: "20%",
        width: "60%",
        backgroundColor: "inherit",
        justifyItems: "left",
      }}
    >
      <Grid className="grid-container" container>
        <Grid item xs={12} display="flex">
          <Autocomplete
            id="selectedSkill"
            options={sortedRows}
            groupBy={(option) => option.descendant}
            getOptionLabel={(option) => `${option.skillNumber}. ${option.skillName}`}
            onChange={handleComboBoxChange}
            filterOptions={filterOptions}
            sx={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} label="Skill" />}
          />
        </Grid>
      </Grid>

      <Grid className="grid-container" container>
        <Grid item xs={6} display="flex">
          <Tooltip title="Element skill power +20%" placement="top">
            <FormControlLabel control={<Checkbox checked={element} onChange={(event) => setElement(event.target.checked)} />} label="Matching skill element" />
          </Tooltip>
        </Grid>

        <Grid item xs={6} display="flex">
          <Tooltip title="Type skill power +20%" placement="top">
            <FormControlLabel control={<Checkbox checked={skill} onChange={(event) => setSkill(event.target.checked)} />} label="Matching skill type" />
          </Tooltip>
        </Grid>

        <Grid xs={12} item display="flex">
          <Grid item xs={12} display="flex">
            <FormControlLabel control={<Checkbox checked={optimizationCondition} onChange={(event) => setOptimizationCondition(event.target.checked)} />} label="Optimization condition" />
            {optimizationCondition && (
              <Select
                size="small"
                value={optimizationConditionMultiplier}
                onChange={(event) => setOptimizationConditionMultiplier(event.target.value)}
                sx={{
                  "& .MuiSelect-select": {
                    backgroundColor: optimizationConditionMultiplier === "140%" ? colorRare : optimizationConditionMultiplier === "160%" ? colorUltimate : null,
                  },
                }}
              >
                <MenuItem value="140%" sx={{ color: colorRare }}>
                  140%
                </MenuItem>
                <MenuItem value="160%" sx={{ color: colorUltimate }}>
                  160%
                </MenuItem>
              </Select>
            )}
          </Grid>

          <Grid item xs={12} display="flex">
            <FormControlLabel control={<Checkbox checked={reactorEnhancement} onChange={(event) => setReactorEnhancement(event.target.checked)} />} label="Reactor enhancement" />
            {reactorEnhancement && (
              <Select size="small" value={reactorEnhancementLevel} onChange={(event) => setReactorEnhancementLevel(event.target.value)}>
                <MenuItem value={1} title="Reactor skill power +3%">
                  Upgrade 1
                </MenuItem>
                <MenuItem value={2} title="Reactor skill power +6%">
                  Upgrade 2
                </MenuItem>
              </Select>
            )}
          </Grid>
        </Grid>

        <Grid item className="grid-item" xs={12} display="flex">
          <Typography id="reactor-level-label" style={{ width: "100%" }}>
            Reactor Level
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

        <Grid item className="grid-item" xs={12} display="flex">
          <TextField
            fullWidth
            id="total-skill-power"
            label="Total Skill Power"
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

        <Grid item className="grid-item" xs={12} display="flex">
          <TextField
            fullWidth
            id="total-bonuses"
            label="Total Bonuses"
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
          <Grid item className="grid-item" xs={12} display="flex">
            <TextField
              fullWidth
              id="cooldown"
              label={skillStatsWithEffects.cooldownLabel}
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
          <Grid item className="grid-item" xs={12} display="flex">
            <TextField
              fullWidth
              id="cost1"
              label={skillStatsWithEffects.cost1Label}
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
          <Grid item className="grid-item" xs={12} display="flex">
            <TextField
              fullWidth
              id="cost2"
              label={skillStatsWithEffects.cost2Label}
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
          <Grid item className="grid-item" xs={12} display="flex">
            <TextField
              fullWidth
              id="duration1"
              label={skillStatsWithEffects.duration1Label}
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
          <Grid item className="grid-item" xs={12} display="flex">
            <TextField
              fullWidth
              id="duration2"
              label={skillStatsWithEffects.duration2Label}
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
          <Grid item className="grid-item" xs={12} display="flex">
            <TextField
              fullWidth
              id="interval"
              label={skillStatsWithEffects.intervalLabel}
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
          <Grid item className="grid-item" xs={12} display="flex">
            <TextField
              fullWidth
              id="range1"
              label={skillStatsWithEffects.range1Label}
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
          <Grid item className="grid-item" xs={12} display="flex">
            <TextField
              fullWidth
              id="range2"
              label={skillStatsWithEffects.range2Label}
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
          <Grid item className="grid-item" xs={12} display="flex">
            <Tooltip title={`Modifier: ${numberToPercents(skillStatsWithEffects.modifier1)}`}>
              <TextField
                fullWidth
                id="skillDamage1"
                label={skillStatsWithEffects.skillDamage1Label}
                variant="standard"
                value={Math.floor(calculateSkillDamage(totalSkillPower, skillStatsWithEffects.modifier1, element, skill, optimizationCondition ? parseFloat(optimizationConditionMultiplier) / 100 : 1))}
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
          <Grid item className="grid-item" xs={12} display="flex">
            <Tooltip title={`Modifier: ${numberToPercents(skillStatsWithEffects.modifier2)}`}>
              <TextField
                fullWidth
                id="skillDamage2"
                label={skillStatsWithEffects.skillDamage2Label}
                variant="standard"
                value={Math.floor(calculateSkillDamage(totalSkillPower, skillStatsWithEffects.modifier2, element, skill, optimizationCondition ? parseFloat(optimizationConditionMultiplier) / 100 : 1))}
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
          <Grid item className="grid-item" xs={12} display="flex">
            <Tooltip title={`Modifier: ${numberToPercents(skillStatsWithEffects.modifier3)}`}>
              <TextField
                fullWidth
                id="skillDamage3"
                label={skillStatsWithEffects.skillDamage3Label}
                variant="standard"
                value={Math.floor(calculateSkillDamage(totalSkillPower, skillStatsWithEffects.modifier3, element, skill, optimizationCondition ? parseFloat(optimizationConditionMultiplier) / 100 : 1))}
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
          <Grid item className="grid-item" xs={12} display="flex">
            <Tooltip title={`Modifier: ${numberToPercents(skillStatsWithEffects.modifier4)}`}>
              <TextField
                fullWidth
                id="skillDamage4"
                label={skillStatsWithEffects.skillDamage4Label}
                variant="standard"
                value={Math.floor(calculateSkillDamage(totalSkillPower, skillStatsWithEffects.modifier4, element, skill, optimizationCondition ? parseFloat(optimizationConditionMultiplier) / 100 : 1))}
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
}
