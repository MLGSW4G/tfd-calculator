// src/Utils.js

export const getSkillElementIcon = (element) => {
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

export const numberToPercents = (value) => {
  if (value == null) {
    return null;
  }
  return `${(value * 100).toFixed(1)}%`;
};

export const numberToPlusPercents = (value) => {
  if (value == null) {
    return null;
  }
  return `+${(value * 100).toFixed(1)}%`;
};

export const numberToSeconds = (value) => {
  if (value == null) {
    return null;
  }
  return `${value.toFixed(1)} s.`;
};

export const numberToMeters = (value) => {
  if (value == null) {
    return null;
  }
  return `${value.toFixed(1)} m.`;
};

export const numberToMPs = (value) => {
  if (value == null) {
    return null;
  }
  return `${value.toFixed(1)} MP`;
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
