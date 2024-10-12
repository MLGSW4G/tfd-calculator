// src/pages/skills/ElectricCondense.js
import jsonData from "../SkillsList.json";

const skillStats = jsonData.find((skill) => skill.skillName === "Electric Condense");

skillStats.cooldownLabel = "Cooldown";
skillStats.cost1Label = "Cost";
skillStats.duration1Label = "Max charge time";
skillStats.range1Label = "Range";
skillStats.range2Label = "Charged range";
skillStats.skillDamage1Label = `0% electricity damage`;
skillStats.skillDamage2Label = `100% electricity damage`;

export default skillStats;
