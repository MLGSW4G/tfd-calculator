// src/pages/skills/CutoffBeam.js
import jsonData from "../SkillsList.json";

const skillStats = jsonData.find((skill) => skill.skillName === "Cutoff Beam");

skillStats.cooldownLabel = "Cooldown";
skillStats.cost1Label = "Cost";
skillStats.duration1Label = "Duration";
skillStats.intervalLabel = "Interval";
skillStats.range1Label = "Range";
skillStats.skillDamage1Label = `Cutoff Beam damage`;
skillStats.skillDamage2Label = `Electrocution damage`;

export default skillStats;
