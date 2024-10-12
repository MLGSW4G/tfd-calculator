// src/pages/skills/Overkill.js
import jsonData from "../SkillsList.json";

const skillStats = jsonData.find((skill) => skill.skillName === "Overkill");

export default skillStats;
