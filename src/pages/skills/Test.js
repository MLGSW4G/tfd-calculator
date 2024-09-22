import jsonData from '../SkillsList.json';

const skillStats = jsonData.find((skill) => skill.skillName === 'Test');

skillStats.cooldownLabel = 'Cooldown';
skillStats.cost1Label = 'Cost';
skillStats.duration1Label = 'Duration';
skillStats.intervalLabel = 'Interval';
skillStats.range1Label = 'Range';
skillStats.skillDamage1Label = `Test damage`;
skillStats.skillDamage2Label = `Test 2 damage`;
skillStats.skillDamage3Label = `Test 3 damage`;

export default skillStats;