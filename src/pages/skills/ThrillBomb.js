import jsonData from '../SkillsList.json';

const skillStats = jsonData.find((skill) => skill.skillName === "Thrill Bomb");

skillStats.cooldownLabel = 'Cooldown';
skillStats.cost1Label = 'Cost';
skillStats.duration1Label = 'Electrocution duration';
skillStats.intervalLabel = 'Electrocution interval';
skillStats.range1Label = 'Range';
skillStats.skillDamage1Label = `0% electricity damage`;
skillStats.skillDamage2Label = `100% electricity damage`;
skillStats.skillDamage3Label = `Electrocution damage`;

export default skillStats;