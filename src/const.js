// src/const.js

export const MODULE_WIDTH = 149,
  MODULE_HEIGHT = 202,
  MODULE_ICON_WIDTH = 72,
  MODULE_ICON_HEIGHT = 72,
  SKILL_MODULE_COLOR = "rgb(13, 164, 137)",
  SUB_MODULE_COLOR = "rgb(164, 91, 13)",
  SKILL_MODULE_COLOR_HEX = "#0DA489",
  SUB_MODULE_COLOR_HEX = "#A45B0D",
  colorStandard = "#52b7f7",
  colorRare = "#d687f7",
  colorUltimate = "#f7db79",
  colorTranscendent = "#ff7a5d",
  filterStandard = "brightness(0) saturate(100%) invert(65%) sepia(14%) saturate(1982%) hue-rotate(167deg) brightness(99%) contrast(95%)",
  filterRare = "brightness(0) saturate(100%) invert(62%) sepia(98%) saturate(2254%) hue-rotate(226deg) brightness(105%) contrast(94%)",
  filterUltimate = "brightness(0) saturate(100%) invert(89%) sepia(71%) saturate(598%) hue-rotate(314deg) brightness(110%) contrast(94%)",
  filterTranscendent = "invert(53%) sepia(8%) saturate(5469%) hue-rotate(322deg) brightness(119%) contrast(100%)",
  MODULE_SOCKET_TYPES = ["Almandine", "Malachite", "Cerulean", "Rutile", "Xantic"],
  MODULE_TIERS = ["Standard", "Rare", "Ultimate", "Transcendent"],
  MODULE_CLASSES = ["Descendant", "General Rounds", "Impact Rounds", "Special Rounds", "High-Power Rounds"],
  MODULE_TYPES = [null, "Attack", "Battle", "HP", "Shield", "Defense", "MP", "Control", "Resource", "Guard", "Cooldown", "Range", "Luck", "Medical", "Strike", "Fortitude", "Support Tech", "Arche Tech", "Final Hand"],
  specialCases = {
    "Thrill Bomb": {
      modifier1: (skillStats, value) => skillStats.modifier1 + value,
      modifier2: (skillStats, value) => skillStats.modifier1 * 2.35,
      modifier3: (skillStats, value) => skillStats.modifier3 + value,
      modifier4: (skillStats, value) => skillStats.modifier4 + value,
    },
    "HV Thrill Bomb": {
      modifier1: (skillStats, value) => skillStats.modifier1 + value,
      modifier2: (skillStats, value) => skillStats.modifier1 * 2.35,
      modifier3: (skillStats, value) => skillStats.modifier3 + value,
      modifier4: (skillStats, value) => skillStats.modifier4 + value,
    },
    "Lightning Emission": {
      modifier1: (skillStats, value) => skillStats.modifier1 + value,
      modifier2: (skillStats, value) => skillStats.modifier1 * 2.35,
      modifier3: (skillStats, value) => skillStats.modifier3 + value,
      modifier4: (skillStats, value) => skillStats.modifier4 + value,
    },
    "HV Lightning Emission": {
      modifier1: (skillStats, value) => skillStats.modifier1 + value,
      modifier2: (skillStats, value) => skillStats.modifier1 * 2.35,
      modifier3: (skillStats, value) => skillStats.modifier3 + value,
      modifier4: (skillStats, value) => skillStats.modifier4 + value,
    },
  },
  effectsMapping = {
    skillPowerModifier: {
      modifier1: (value) => (skillStats) => specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier1(skillStats, value) : skillStats.modifier1 + value,
      modifier2: (value) => (skillStats) => specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier2(skillStats, value) : skillStats.modifier2 + value,
      modifier3: (value) => (skillStats) => specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier3(skillStats, value) : skillStats.modifier3 + value,
      modifier4: (value) => (skillStats) => specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier4(skillStats, value) : skillStats.modifier4 + value,
    },
    fusionSkillPowerModifier: {
      modifier1: (value) => (skillStats) => skillStats.skillType === "Fusion" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier1(skillStats, value) : skillStats.modifier1 + value) : skillStats.modifier1,
      modifier2: (value) => (skillStats) => skillStats.skillType === "Fusion" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier2(skillStats, value) : skillStats.modifier2 + value) : skillStats.modifier2,
      modifier3: (value) => (skillStats) => skillStats.skillType === "Fusion" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier3(skillStats, value) : skillStats.modifier3 + value) : skillStats.modifier3,
      modifier4: (value) => (skillStats) => skillStats.skillType === "Fusion" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier4(skillStats, value) : skillStats.modifier4 + value) : skillStats.modifier4,
    },
    singularSkillPowerModifier: {
      modifier1: (value) => (skillStats) => skillStats.skillType === "Singular" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier1(skillStats, value) : skillStats.modifier1 + value) : skillStats.modifier1,
      modifier2: (value) => (skillStats) => skillStats.skillType === "Singular" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier2(skillStats, value) : skillStats.modifier2 + value) : skillStats.modifier2,
      modifier3: (value) => (skillStats) => skillStats.skillType === "Singular" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier3(skillStats, value) : skillStats.modifier3 + value) : skillStats.modifier3,
      modifier4: (value) => (skillStats) => skillStats.skillType === "Singular" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier4(skillStats, value) : skillStats.modifier4 + value) : skillStats.modifier4,
    },
    dimensionSkillPowerModifier: {
      modifier1: (value) => (skillStats) => skillStats.skillType === "Dimension" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier1(skillStats, value) : skillStats.modifier1 + value) : skillStats.modifier1,
      modifier2: (value) => (skillStats) => skillStats.skillType === "Dimension" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier2(skillStats, value) : skillStats.modifier2 + value) : skillStats.modifier2,
      modifier3: (value) => (skillStats) => skillStats.skillType === "Dimension" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier3(skillStats, value) : skillStats.modifier3 + value) : skillStats.modifier3,
      modifier4: (value) => (skillStats) => skillStats.skillType === "Dimension" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier4(skillStats, value) : skillStats.modifier4 + value) : skillStats.modifier4,
    },
    techSkillPowerModifier: {
      modifier1: (value) => (skillStats) => skillStats.skillType === "Tech" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier1(skillStats, value) : skillStats.modifier1 + value) : skillStats.modifier1,
      modifier2: (value) => (skillStats) => skillStats.skillType === "Tech" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier2(skillStats, value) : skillStats.modifier2 + value) : skillStats.modifier2,
      modifier3: (value) => (skillStats) => skillStats.skillType === "Tech" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier3(skillStats, value) : skillStats.modifier3 + value) : skillStats.modifier3,
      modifier4: (value) => (skillStats) => skillStats.skillType === "Tech" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier4(skillStats, value) : skillStats.modifier4 + value) : skillStats.modifier4,
    },
    skillPower: {
      skillPower: (value) => (skillStats) => skillStats.skillPower * (1 + value),
    },
    nonAttributeSkillPower: {
      skillPower: (value) => (skillStats) => skillStats.skillElement === "Non-Attribute" ? skillStats.skillPower * (1 + value) : skillStats.skillPower,
    },
    chillSkillPower: {
      skillPower: (value) => (skillStats) => skillStats.skillElement === "Chill" ? skillStats.skillPower * (1 + value) : skillStats.skiltPower,
    },
    fireSkillPower: {
      skillPower: (value) => (skillStats) => skillStats.skillElement === "Fire" ? skillStats.skillPower * (1 + value) : skillStats.skillPower,
    },
    toxinSkillPower: {
      skillPower: (value) => (skillStats) => skillStats.skillElement === "Toxin" ? skillStats.skillPower * (1 + value) : skillStats.skillPower,
    },
    electricSkillPower: {
      skillPower: (value) => (skillStats) => skillStats.skillElement === "Electric" ? skillStats.skillPower * (1 + value) : skillStats.skillPower,
    },
    skillCooldown: {
      cooldown: (value) => (skillStats) => skillStats.cooldown * (1 + value),
    },
    skillCost: {
      cost1: (value) => (skillStats) => skillStats.cost1 * (1 + value),
      cost2: (value) => (skillStats) => skillStats.cost2 * (1 + value),
    },
    skillDuration: {
      duration1: (value) => (skillStats) => skillStats.duration1 * (1 + value),
      duration2: (value) => (skillStats) => skillStats.duration2 * (1 + value),
    },
    skillEffectRange: {
      range1: (value) => (skillStats) => skillStats.range1 * (1 + value),
      range2: (value) => (skillStats) => skillStats.range2 * (1 + value),
    },
  };
