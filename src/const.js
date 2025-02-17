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
    colorFire = "#3c1103",
    colorElectric = "#03385a",
    colorToxic = "#103e00",
    colorChill = "#131853",
    colorRare = "#d687f7",
    colorUltimate = "#f7db79",
    colorTranscendent = "#ff7a5d",
    filterStandard = "brightness(0) saturate(100%) invert(65%) sepia(14%) saturate(1982%) hue-rotate(167deg) brightness(99%) contrast(95%)",
    filterRare = "brightness(0) saturate(100%) invert(62%) sepia(98%) saturate(2254%) hue-rotate(226deg) brightness(105%) contrast(94%)",
    filterUltimate = "brightness(0) saturate(100%) invert(89%) sepia(71%) saturate(598%) hue-rotate(314deg) brightness(110%) contrast(94%)",
    filterTranscendent = "invert(53%) sepia(8%) saturate(5469%) hue-rotate(322deg) brightness(119%) contrast(100%)",
    MODULE_SOCKET_TYPES = ["Almandine", "Malachite", "Cerulean", "Rutile", "Xantic"],
    MODULE_TIERS = ["Normal", "Rare", "Ultimate", "Transcendent"],
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
            modifier1: (value) => (skillStats) =>
                skillStats.skillType === "Fusion" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier1(skillStats, value) : skillStats.modifier1 + value) : skillStats.modifier1,
            modifier2: (value) => (skillStats) =>
                skillStats.skillType === "Fusion" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier2(skillStats, value) : skillStats.modifier2 + value) : skillStats.modifier2,
            modifier3: (value) => (skillStats) =>
                skillStats.skillType === "Fusion" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier3(skillStats, value) : skillStats.modifier3 + value) : skillStats.modifier3,
            modifier4: (value) => (skillStats) =>
                skillStats.skillType === "Fusion" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier4(skillStats, value) : skillStats.modifier4 + value) : skillStats.modifier4,
        },
        singularSkillPowerModifier: {
            modifier1: (value) => (skillStats) =>
                skillStats.skillType === "Singular" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier1(skillStats, value) : skillStats.modifier1 + value) : skillStats.modifier1,
            modifier2: (value) => (skillStats) =>
                skillStats.skillType === "Singular" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier2(skillStats, value) : skillStats.modifier2 + value) : skillStats.modifier2,
            modifier3: (value) => (skillStats) =>
                skillStats.skillType === "Singular" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier3(skillStats, value) : skillStats.modifier3 + value) : skillStats.modifier3,
            modifier4: (value) => (skillStats) =>
                skillStats.skillType === "Singular" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier4(skillStats, value) : skillStats.modifier4 + value) : skillStats.modifier4,
        },
        dimensionSkillPowerModifier: {
            modifier1: (value) => (skillStats) =>
                skillStats.skillType === "Dimension" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier1(skillStats, value) : skillStats.modifier1 + value) : skillStats.modifier1,
            modifier2: (value) => (skillStats) =>
                skillStats.skillType === "Dimension" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier2(skillStats, value) : skillStats.modifier2 + value) : skillStats.modifier2,
            modifier3: (value) => (skillStats) =>
                skillStats.skillType === "Dimension" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier3(skillStats, value) : skillStats.modifier3 + value) : skillStats.modifier3,
            modifier4: (value) => (skillStats) =>
                skillStats.skillType === "Dimension" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier4(skillStats, value) : skillStats.modifier4 + value) : skillStats.modifier4,
        },
        techSkillPowerModifier: {
            modifier1: (value) => (skillStats) =>
                skillStats.skillType === "Tech" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier1(skillStats, value) : skillStats.modifier1 + value) : skillStats.modifier1,
            modifier2: (value) => (skillStats) =>
                skillStats.skillType === "Tech" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier2(skillStats, value) : skillStats.modifier2 + value) : skillStats.modifier2,
            modifier3: (value) => (skillStats) =>
                skillStats.skillType === "Tech" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier3(skillStats, value) : skillStats.modifier3 + value) : skillStats.modifier3,
            modifier4: (value) => (skillStats) =>
                skillStats.skillType === "Tech" ? (specialCases[skillStats.skillName] ? specialCases[skillStats.skillName].modifier4(skillStats, value) : skillStats.modifier4 + value) : skillStats.modifier4,
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
    },
    imageMapping = {
        Vespers: "url(assets/Image_RotationDrop/Image_RotationDrop_F01.png)",
        Kingston: "url(assets/Image_RotationDrop/Image_RotationDrop_F02.png)",
        "Agna Desert": "url(assets/Image_RotationDrop/Image_RotationDrop_F03.png)",
        "Echo Swamp": "url(assets/Image_RotationDrop/Image_RotationDrop_F04.png)",
        Fortress: "url(assets/Image_RotationDrop/Image_RotationDrop_F05.png)",
        "Sterile Land": "url(assets/Image_RotationDrop/Image_RotationDrop_F06.png)",
        Hagios: "url(assets/Image_RotationDrop/Image_RotationDrop_F07.png)",
        "White-night Gulch": "url(assets/Image_RotationDrop/Image_RotationDrop_F08.png)",
    },
    typeMapping = {
        "Auxiliary Power": "assets/Icons/Icon_Acc_01_Big.png",
        Sensor: "assets/Icons/Icon_Acc_02_Big.png",
        Memory: "assets/Icons/Icon_Acc_03_Big.png",
        Processor: "assets/Icons/Icon_Acc_04_Big.png",
        Reactor: "assets/Icons/Icon_Tab_Reactor_Big.png",
    },
    rewardTypeOrder = ["Reactor", "Processor", "Memory", "Sensor", "Auxiliary Power"],
    reactorElementTypeOrder = ["Toxic", "Electric", "Chill", "Non-Attribute", "Fire"],
    archeTypeOrder = ["Tech", "Dimension", "Singular", "Fusion"],
    battleZoneOrder = [
        "Defense Line",
        "Convertor Facility",
        "Fallen Ark",
        "Frozen Valley",
        "The Aurora Forest",
        "Starfall Road",
        "Forward Base",
        "Fractured Monolith",
        "The Corrupted Zone",
        "Dune Base",
        "Hatchery",
        "Shipment Base",
        "Observatory",
        "Moongrave Basin",
        "The Mountaintops",
        "Miragestone",
        "The Mining Site",
        "The Storage",
        "Remnant",
        "Vermilion Waste",
        "Derelict Covert",
        "Muskeg Swamp",
        "Abandoned Zone",
        "Misty Woods",
        "Timbefall",
        "Moonlight Lake",
        "Lost Supply Depot",
        "The Ruins",
        "The Lumber Yard",
        "Classified Area",
        "Ironworks",
        "Restricted Zone",
        "Repository",
        "Rockfall",
        "Grand Square",
        "The Fallen Theater",
        "The Destruction",
    ],
    PAGE_TITLE_FORMAT = "{name} - TFD Calculator";
