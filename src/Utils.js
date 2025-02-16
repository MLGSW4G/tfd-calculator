// src/Utils.js
import { useNumberFormatter } from "./components/NumberFormatter";
import { getTranslation } from "./translations";
import {
    colorStandard,
    colorRare,
    colorUltimate,
    colorTranscendent,
    filterStandard,
    filterRare,
    filterUltimate,
    filterTranscendent,
    reactorElementTypeOrder,
    rewardTypeOrder,
    archeTypeOrder,
    battleZoneOrder,
} from "./const";

export const getSkillElementTypeIcon = (element) => {
    switch (element) {
        case "Fire":
            return "assets/Icons/Icon_Tag_Blazer.png";
        case "Electric":
            return "assets/Icons/Icon_Tag_Electricity.png";
        case "Chill":
            return "assets/Icons/Icon_Tag_Glacier.png";
        case "Toxic":
            return "assets/Icons/Icon_Tag_Demonic.png";
        case "Non-Attribute":
            return "assets/Icons/Icon_Tag_Plain.png";
    }
};
export const getSkillArcheTypeIcon = (archeType) => {
    return `assets/Icons/Icon_Tag_Arche${archeType}.png`;
};

export function percentageToFloat(value) {
    const sign = value[0] === "+" || value[0] === "-" ? value.slice(0, 1) : "";
    const percentIndex = value.indexOf("%");
    const floatValue = Number(value.slice(sign.length, percentIndex)) / 100;
    return sign === "-" ? -floatValue : floatValue;
}

export function parseModuleEffect(module, moduleLevel) {
    if (!module.moduleStat || module.moduleStat.length === 0) {
        return {};
    }

    let value = module.moduleStat[moduleLevel]["value"].replace("&", "and");
    if (value.includes("Non-Attribute")) {
        value = value.replace("-", " ");
    }
    let effects = {};

    // Handle transcendent modules
    if (module.moduleTier === "Transcendent") {
        effects[module.moduleName.replace("-", " ").replace("'", "").camelCase()] = true;
        return effects;
    }

    // Handle element immunity modules
    if (value.includes("Immunity")) {
        const effectName = value.split("\n")[0].camelCase();
        effects[effectName] = true;
        const effectString = value.split("\n")[1];
        const splitValue = effectString.trim().split(" ");
        if (splitValue.length > 1) {
            const effectName2 = splitValue.slice(0, -1).joinCamelCase() + "2";
            effects[effectName2] = percentageToFloat(splitValue[splitValue.length - 1]);
        }
        return effects;
    }

    // Handle sub modules (+capacity)
    if (value.includes("Max Module Capacity")) {
        const effectName = "maxCapacity";
        const maxCapacity = moduleLevel;
        module.moduleStat[moduleLevel].module_capacity = maxCapacity; // module_capacity is equal to moduleLevel
        effects[effectName] = maxCapacity;
        return effects;
    }

    // Handle "Overwhelming..." modules
    if (value.startsWith("Fixes")) {
        effects[module.moduleName.camelCase()] = true;
        return effects;
    }

    // Handle "Mass Purification" and "Absolute Curse" modules
    if (value.startsWith("Upon Colossus Part")) {
        effects[module.moduleName.camelCase()] = true;
        return effects;
    }

    // Handle general cases with multiple effects
    const effectStrings = value.split(/[\n,]+/);
    effectStrings.forEach((effectString) => {
        const splitValue = effectString.trim().split(" ");
        if (splitValue.length < 2) return;
        const lastPart = splitValue[splitValue.length - 1];
        let effectValue;
        if (lastPart.includes("%")) {
            effectValue = percentageToFloat(lastPart);
        } else {
            effectValue = Number(lastPart.substring(1));
            if (lastPart.startsWith("-")) {
                effectValue = -effectValue;
            }
        }
        const effectName = splitValue.slice(0, -1).joinCamelCase();
        effects[effectName] = Number(effectValue.toFixed(8));
    });
    return effects;
}

Array.prototype.joinCamelCase = function () {
    if (this.length === 0) return "";
    return this.map((str, index) => {
        const lowercased = str.toLowerCase();
        return index === 0 ? lowercased : lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
    }).join("");
};

String.prototype.camelCase = function () {
    return this.toLowerCase()
        .replace(/\s(.)/g, (match) => match.toUpperCase())
        .replace(/\s/g, "");
};

export const getSocketTypeIcon = (socketType) => {
    switch (socketType) {
        case "Cerulean":
            return "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_001.png";
        case "Almandine":
            return "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_002.png";
        case "Malachite":
            return "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_003.png";
        case "Xantic":
            return "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_004.png";
        case "Rutile":
            return "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_005.png";
    }
};

export const getTierColor = (tier) => {
    switch (tier) {
        case "Normal":
            return colorStandard;
        case "Rare":
            return colorRare;
        case "Ultimate":
            return colorUltimate;
        case "Transcendent":
            return colorTranscendent;
    }
};

export const getTierFilter = (tier) => {
    switch (tier) {
        case "Normal":
            return filterStandard;
        case "Rare":
            return filterRare;
        case "Ultimate":
            return filterUltimate;
        case "Transcendent":
            return filterTranscendent;
    }
};

export const getClassIcon = (moduleClass) => {
    switch (moduleClass) {
        case "Descendant":
            return "assets/Modules/Icon_Runes/Icon_RunesClass_Mini_0_Color.png";
        case "General Rounds":
            return "assets/Modules/Icon_Runes/Icon_RunesClass_Mini_A_Color.png";
        case "Special Rounds":
            return "assets/Modules/Icon_Runes/Icon_RunesClass_Mini_B_Color.png";
        case "Impact Rounds":
            return "assets/Modules/Icon_Runes/Icon_RunesClass_Mini_C_Color.png";
        case "High-Power Rounds":
            return "assets/Modules/Icon_Runes/Icon_RunesClass_Mini_D_Color.png";
    }
};

export const getClassIcon2 = (className) => {
    switch (className) {
        case "General Rounds":
            return "assets/Icons/Icon_MagnumPicto_001.png";
        case "Enhanced Ammo":
            return "assets/Icons/Icon_MagnumPicto_002.png";
        case "Impact Rounds":
            return "assets/Icons/Icon_MagnumPicto_003.png";
        case "High-Power Rounds":
            return "assets/Icons/Icon_MagnumPicto_004.png";
    }
};

export const sortRewards = (rewards, sortOption) => {
    if (sortOption === "type") {
        return rewards.sort((a, b) => {
            // Sort by reward_type
            const aRewardTypeIndex = rewardTypeOrder.indexOf(a.reward_type);
            const bRewardTypeIndex = rewardTypeOrder.indexOf(b.reward_type);
            if (aRewardTypeIndex !== bRewardTypeIndex) return aRewardTypeIndex - bRewardTypeIndex;

            // Sort by reactor_element_type
            const aElementTypeIndex = reactorElementTypeOrder.indexOf(a.reactor_element_type);
            const bElementTypeIndex = reactorElementTypeOrder.indexOf(b.reactor_element_type);
            if (aElementTypeIndex !== bElementTypeIndex) return aElementTypeIndex - bElementTypeIndex;

            // Sort by arche_type
            const aArcheTypeIndex = archeTypeOrder.indexOf(a.arche_type);
            const bArcheTypeIndex = archeTypeOrder.indexOf(b.arche_type);
            return aArcheTypeIndex - bArcheTypeIndex;
        });
    } else if (sortOption === "battlezone") {
        return rewards.sort((a, b) => {
            const aBattleZoneIndex = battleZoneOrder.indexOf(a.battle_zone_name);
            const bBattleZoneIndex = battleZoneOrder.indexOf(b.battle_zone_name);
            return aBattleZoneIndex - bBattleZoneIndex;
        });
    }
    // If no sorting option is selected, return the rewards as is (no sorting)
    return rewards;
};

export const useNumberFormatters = (language) => {
    const formatNumber = useNumberFormatter();
    const translations = getTranslation(language, "units");

    const numberToPercents = (value) => {
        if (value == null) {
            return null;
        }
        return `${formatNumber((value * 100).toFixed(1))}%`;
    };

    const numberToPlusPercents = (value) => {
        if (value == null) {
            return null;
        }
        return `+${formatNumber((value * 100).toFixed(1))}%`;
    };

    const numberToSeconds = (value) => {
        if (value == null) {
            return null;
        }
        return `${formatNumber(value)} ${translations.seconds}`;
    };

    const numberToMeters = (value) => {
        if (value == null) {
            return null;
        }
        return `${formatNumber(value)} ${translations.meters}`;
    };

    return {
        numberToPercents,
        numberToPlusPercents,
        numberToSeconds,
        numberToMeters,
    };
};
