// src/pages/skills/CloseCall.js
import jsonData from "../SkillsList.json";

const skillStats = jsonData.find((skill) => skill.skillName === "Close Call");

export default skillStats;
