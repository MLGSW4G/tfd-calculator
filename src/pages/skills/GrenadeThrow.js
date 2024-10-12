// src/pages/skills/GrenadeThrow.js
import jsonData from "../SkillsList.json";

const skillStats = jsonData.find((skill) => skill.skillName === "Grenade Throw");

export default skillStats;
