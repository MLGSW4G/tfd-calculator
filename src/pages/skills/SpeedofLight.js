// src/pages/skills/SpeedofLight.js
import jsonData from "../SkillsList.json";

const skillStats = jsonData.find((skill) => skill.skillName === "Speed of Light");

skillStats.cooldownLabel = "Cooldown";
skillStats.cost1Label = "Cost";
skillStats.duration1Label = "Duration";
skillStats.range1Label = "Range";

export default skillStats;
