// parseModules.js
const moduleData = require("./src/api/module.json");

const moduleList = moduleData.map((module) => ({
  id: module.module_id,
  moduleName: module.module_name,
  moduleIcon: module.image_url,
  moduleType: module.module_type,
  moduleTier: module.module_tier,
  moduleClass: module.module_class,
  moduleSocketType: module.module_socket_type,
  moduleStat: module.module_stat,
}));

// Helper function to convert percentage string to float
function percentageToFloat(value) {
  const sign = value[0] === "+" || value[0] === "-" ? value.slice(0, 1) : "";
  const percentIndex = value.indexOf("%");
  const floatValue = Number(value.slice(sign.length, percentIndex)) / 100;
  return sign === "-" ? -floatValue : floatValue;
}

// Helper function to parse module effects
function parseModuleEffect(module, moduleLevel) {
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

// Add custom prototype methods for camelCase conversion
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

const moduleLevel = 3;
const excludedIndices = [
  [51, 57],
  [59, 71],
  [134, 139],
  [142, 143],
  [146, 149],
  [150, 333],
  [363, 533],
  [556, 557],
  [561, 563],
];

const excluded = excludedIndices.flatMap((range) => Array.from({ length: range[1] - range[0] + 1 }, (_, i) => range[0] + i));

const filteredModuleList = moduleList.filter((_, index) => !excluded.includes(index));

filteredModuleList.forEach((module) => {
  try {
    console.log(parseModuleEffect(module, moduleLevel));
  } catch (error) {
    console.log(error);
    console.log(module.moduleName);
  }
});
