// src/pages/skills/TractionGrenade.js
import jsonData from "../SkillsList.json";

const skillStats = jsonData.find((skill) => skill.skillName === "Traction Grenade");

export default skillStats;
