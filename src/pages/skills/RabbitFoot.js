import jsonData from '../SkillsList.json';

const skillStats = jsonData.find((skill) => skill.skillName === "Rabbit Foot");

skillStats.cooldownLabel = 'Cooldown';
skillStats.cost1Label = 'Cost';
skillStats.duration1Label = 'Duration';
skillStats.intervalLabel = 'Interval';
skillStats.range1Label = 'Range';
skillStats.skillDamage1Label = `Damage`;

export default skillStats;