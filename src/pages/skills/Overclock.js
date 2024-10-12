// src/pages/skills/Overclock.js
import jsonData from "../SkillsList.json";

const skillStats = jsonData.find((skill) => skill.skillName === "Overclock");

export default skillStats;
