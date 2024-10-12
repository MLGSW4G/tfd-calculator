// src/pages/Overview.js
import React, { useState, useEffect, useContext } from "react";
import { LocalizationContext } from "../components/LocalizationContext";
import { Box, TextField, Grid, Checkbox, Select, MenuItem, Autocomplete, Tooltip, FormControlLabel, Slider, Typography } from "@mui/material";
import { sortedRows } from "./SkillsList";
import { colorRare, colorUltimate } from "../const";
import { numberToPercents, numberToMeters, numberToSeconds, numberToMPs } from "../Utils";
import ReactorLevels from "./ReactorLevels.json";
import { getTranslation } from "../translations";
import "../styles/styles.css";

const Overview = () => {
  const { language } = useContext(LocalizationContext);
  const translations = getTranslation(language, "overview");

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

  const specialCases = {
    "Thrill Bomb": {
      modifier1: (skillStats, value) => skillStats.modifier1 + value,
      modifier2: (skillStats, value) => skillStats.modifier1 * 2.35,
      modifier3: (skillStats, value) => skillStats.modifier3 + value,
      modifier4: (skillStats, value) => skillStats.modifier4 + value,
    },
    "HV Thrill Bomb": {
      modifier1: (skillStats, value) => skillStats.modifier1 + value,
      modifier2: (skillStats, value) => skillStats.modifier1 * 2.35,
      modifier3: (skillStats, value) => skillStats.modifier3 + value,
      modifier4: (skillStats, value) => skillStats.modifier4 + value,
    },
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
    const appliedElementSkillPower = element ? 1.2 : 1;
    const appliedTypeSkillPower = skill ? 1.2 : 1;
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
    localStorage.setItem("skill", JSON.stringify(skill));
    localStorage.setItem("optimizationConditionMultiplier", optimizationConditionMultiplier);
    localStorage.setItem("reactorEnhancementLevel", reactorEnhancementLevel);
    localStorage.setItem("reactorLevel", JSON.stringify(reactorLevel));
  }, [element, skill, optimizationConditionMultiplier, reactorEnhancementLevel, reactorLevel]);

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
            options={sortedRows}
            groupBy={(option) => option.descendant}
            getOptionLabel={(option) => `${option.skillNumber}. ${option.skillName}`}
            onChange={handleComboBoxChange}
            filterOptions={filterOptions}
            renderInput={(params) => <TextField {...params} label={translations.selectedSkillPlaceholder} />}
          />
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <Tooltip enterDelay={0} title={translations.elementTooltip} placement="top">
            <FormControlLabel control={<Checkbox checked={element} onChange={(event) => setElement(event.target.checked)} />} label={translations.element} />
          </Tooltip>
        </Grid>

        <Grid item xs={6}>
          <Tooltip enterDelay={0} title={translations.typeTooltip} placement="top">
            <FormControlLabel control={<Checkbox checked={skill} onChange={(event) => setSkill(event.target.checked)} />} label={translations.type} />
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
            <MenuItem value={0}>{translations.reactorUpgrade0}</MenuItem>

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
                value={Math.floor(calculateSkillDamage(totalSkillPower, skillStatsWithEffects.modifier1, element, skill, optimizationConditionMultiplier))}
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
                value={Math.floor(calculateSkillDamage(totalSkillPower, skillStatsWithEffects.modifier2, element, skill, optimizationConditionMultiplier))}
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
                value={Math.floor(calculateSkillDamage(totalSkillPower, skillStatsWithEffects.modifier3, element, skill, optimizationConditionMultiplier))}
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
                value={Math.floor(calculateSkillDamage(totalSkillPower, skillStatsWithEffects.modifier4, element, skill, optimizationConditionMultiplier))}
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
