import jsonData from '../SkillsList.json';

const skillStats = jsonData.find((skill) => skill.skillName === "Lightning Emission");

skillStats.cooldownLabel = 'Cooldown';
skillStats.cost1Label = 'Cost';
skillStats.duration1Label = 'Duration';
skillStats.duration2Label = 'Electrocution duration';
skillStats.intervalLabel = 'Electrocution interval';
skillStats.range1Label = 'Range';
skillStats.skillDamage1Label = `0% electricity damage`;
skillStats.skillDamage2Label = `100% electricity damage`;
skillStats.skillDamage3Label = `Electrocution damage`;

export default skillStats;