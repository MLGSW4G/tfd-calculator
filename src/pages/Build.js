// pages/Build.js
import React, { useState, useEffect } from "react";
import { Box, TextField, Grid, Checkbox, Select, MenuItem, Autocomplete, Tooltip, FormControlLabel } from "@mui/material";
import { sortedRows } from "./SkillsList";
import { colorRare, colorUltimate } from "../const";
import "../styles/styles.css";
import { numberToPercents, numberToMeters, numberToSeconds, numberToMPs } from "../components/ValueFormatters";

export default function BasicGrid() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillStats, setSkillStats] = useState(null);
  const [element, setElement] = useState(false);
  const [skill, setSkill] = useState(false);
  const [optimizationCondition, setOptimizationCondition] = useState(false);
  const [skillPower, setSkillPower] = useState("");
  const [totalSkillPower, setTotalSkillPower] = useState("");
  const [dropdownValue, setDropdownValue] = useState("140%");

  // Calculate total skill power based on reactor skill power, optimization condition, element checkbox, and type checkbox
  useEffect(() => {
    const optimizationConditionMultiplier = optimizationCondition ? parseFloat(dropdownValue) / 100 : 1;
    const appliedElementSkillPower = element ? 1.2 : 1;
    const appliedTypeSkillPower = skill ? 1.2 : 1;
    const totalSkillPowerValue = skillPower * optimizationConditionMultiplier * appliedElementSkillPower * appliedTypeSkillPower;
    setTotalSkillPower(totalSkillPowerValue);
  }, [skillPower, optimizationCondition, dropdownValue, element, skill]);

  useEffect(() => {
    if (selectedSkill) {
      import(`../pages/skills/${selectedSkill.skillName.replaceAll(" ", "")}.js`)
        .then((module) => {
          setSkillStats(module.default);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setSkillStats({}); // Reset skillStats to an empty object when selectedSkill is null
    }
  }, [selectedSkill]);

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

  // Define your magic numbers with corresponding tooltips
  const skillPowerOptions = [
    { value: 11060.963, tooltip: "Level 100 reactor" },
    { value: 11724.62078, tooltip: "Upgraded level 100 reactor (1.06x)" },
  ];

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
            id="combo-box-skill"
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
          <Tooltip title="Element skill power +20%">
            <FormControlLabel control={<Checkbox checked={element} onChange={(event) => setElement(event.target.checked)} />} label="Matching skill element" />
          </Tooltip>
        </Grid>

        <Grid item xs={6} display="flex">
          <Tooltip title="Type skill power +20%">
            <FormControlLabel control={<Checkbox checked={skill} onChange={(event) => setSkill(event.target.checked)} />} label="Matching skill type" />
          </Tooltip>
        </Grid>

        <Grid xs={12} item display="flex">
          <FormControlLabel control={<Checkbox checked={optimizationCondition} onChange={(event) => setOptimizationCondition(event.target.checked)} />} label="Optimization condition" />

          {optimizationCondition && (
            <Select
              size="small"
              value={dropdownValue}
              onChange={(event) => setDropdownValue(event.target.value)}
              sx={{
                "& .MuiSelect-select": {
                  backgroundColor: dropdownValue === "140%" ? colorRare : dropdownValue === "160%" ? colorUltimate : null,
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

        <Grid item className="grid-item" xs={12} display="flex">
          <Autocomplete
            freeSolo
            fullWidth
            disableClearable
            options={skillPowerOptions.map((option) => option.value)}
            onChange={(event, newValue) => {
              setSkillPower(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                id="reactor-skill-power"
                label="Reactor Skill Power"
                variant="standard"
                value={skillPower}
                onChange={(event) => setSkillPower(event.target.value)}
                InputProps={{
                  ...params.InputProps,
                  style: { textAlign: "right" }, // Right-align the text inside the input
                }}
                inputProps={{
                  ...params.inputProps,
                  style: { textAlign: "right" }, // Also align the actual input text
                }}
              />
            )}
            renderOption={(props, option) => {
              const optionObj = skillPowerOptions.find((opt) => opt.value === option);
              return (
                <Tooltip title={optionObj.tooltip} arrow>
                  <li {...props}>{option}</li>
                </Tooltip>
              );
            }}
          />
        </Grid>

        <Grid item className="grid-item" xs={12} display="flex">
          <TextField
            fullWidth
            id="total-skill-power"
            label="Total Skill Power"
            variant="standard"
            value={totalSkillPower != 0 ? totalSkillPower.toFixed(2) : null}
            InputProps={{
              readOnly: true,
              inputProps: {
                style: { textAlign: "right" },
              },
            }}
          />
        </Grid>

        {skillStats && Object.keys(skillStats).includes("cooldown") && (
          <Grid item className="grid-item" xs={12} display="flex">
            <TextField
              fullWidth
              id="cooldown"
              label={skillStats.cooldownLabel}
              variant="standard"
              value={numberToSeconds(skillStats.cooldown)}
              InputProps={{
                readOnly: true,
                inputProps: {
                  style: { textAlign: "right" },
                },
              }}
            />
          </Grid>
        )}

        {skillStats && Object.keys(skillStats).includes("cost1") && (
          <Grid item className="grid-item" xs={12} display="flex">
            <TextField
              fullWidth
              id="cost1"
              label={skillStats.cost1Label}
              variant="standard"
              value={numberToMPs(skillStats.cost1)}
              InputProps={{
                readOnly: true,
                inputProps: {
                  style: { textAlign: "right" },
                },
              }}
            />
          </Grid>
        )}

        {skillStats && Object.keys(skillStats).includes("duration1") && (
          <Grid item className="grid-item" xs={12} display="flex">
            <TextField
              fullWidth
              id="duration1"
              label={skillStats.duration1Label}
              variant="standard"
              value={numberToSeconds(skillStats.duration1)}
              InputProps={{
                readOnly: true,
                inputProps: {
                  style: { textAlign: "right" },
                },
              }}
            />
          </Grid>
        )}

        {skillStats && Object.keys(skillStats).includes("duration2") && (
          <Grid item className="grid-item" xs={12} display="flex">
            <TextField
              fullWidth
              id="duration2"
              label={skillStats.duration2Label}
              variant="standard"
              value={numberToSeconds(skillStats.duration2)}
              InputProps={{
                readOnly: true,
                inputProps: {
                  style: { textAlign: "right" },
                },
              }}
            />
          </Grid>
        )}

        {skillStats && Object.keys(skillStats).includes("interval") && (
          <Grid item className="grid-item" xs={12} display="flex">
            <TextField
              fullWidth
              id="interval"
              label={skillStats.intervalLabel}
              variant="standard"
              value={numberToSeconds(skillStats.interval)}
              InputProps={{
                readOnly: true,
                inputProps: {
                  style: { textAlign: "right" },
                },
              }}
            />
          </Grid>
        )}

        {skillStats && Object.keys(skillStats).includes("range1") && (
          <Grid item className="grid-item" xs={12} display="flex">
            <TextField
              fullWidth
              id="range1"
              label={skillStats.range1Label}
              variant="standard"
              value={numberToMeters(skillStats.range1)}
              InputProps={{
                readOnly: true,
                inputProps: {
                  style: { textAlign: "right" },
                },
              }}
            />
          </Grid>
        )}

        {skillStats && Object.keys(skillStats).includes("range2") && (
          <Grid item className="grid-item" xs={12} display="flex">
            <TextField
              fullWidth
              id="range2"
              label={skillStats.range2Label}
              variant="standard"
              value={numberToMeters(skillStats.range2)}
              InputProps={{
                readOnly: true,
                inputProps: {
                  style: { textAlign: "right" },
                },
              }}
            />
          </Grid>
        )}

        {/* todo: Add blank string display when reactor-skill-power is blank */}
        {skillStats && skillStats.modifier1 && (
          <Grid item className="grid-item" xs={12} display="flex">
            <Tooltip title={`Modifier1: ${numberToPercents(skillStats.modifier1)}`}>
              <TextField
                fullWidth
                id="skillDamage1"
                label={skillStats.skillDamage1Label}
                variant="standard"
                value={Math.floor(calculateSkillDamage(skillPower, skillStats.modifier1, element, skill, optimizationCondition ? parseFloat(dropdownValue) / 100 : 1))}
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

        {skillStats && skillStats.modifier2 && (
          <Grid item className="grid-item" xs={12} display="flex">
            <Tooltip title={`Modifier2: ${numberToPercents(skillStats.modifier2)}`}>
              <TextField
                fullWidth
                id="skillDamage2"
                label={skillStats.skillDamage2Label}
                variant="standard"
                value={Math.floor(calculateSkillDamage(skillPower, skillStats.modifier2, element, skill, optimizationCondition ? parseFloat(dropdownValue) / 100 : 1))}
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

        {skillStats && skillStats.modifier3 && (
          <Grid item className="grid-item" xs={12} display="flex">
            <Tooltip title={`Modifier3: ${numberToPercents(skillStats.modifier3)}`}>
              <TextField
                fullWidth
                id="skillDamage3"
                label={skillStats.skillDamage3Label}
                variant="standard"
                value={Math.floor(calculateSkillDamage(skillPower, skillStats.modifier3, element, skill, optimizationCondition ? parseFloat(dropdownValue) / 100 : 1))}
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
