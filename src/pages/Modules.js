// pages/Modules.js
import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import "../styles/styles.css";
import { Module } from "../components/Module";
import { ModuleSlot } from "../components/ModuleSlot";
import moduleData from "../api/module.json";
import { MODULE_SOCKET_TYPES, MODULE_TIERS, MODULE_CLASSES, colorStandard, colorRare, colorUltimate, colorTranscendent } from "../const";

// Helper function to convert percentage string to float
function percentageToFloat(value) {
  const sign = value[0] === "+" || value[0] === "-" ? value.slice(0, 1) : "";
  const percentIndex = value.indexOf("%");
  const floatValue = Number(value.slice(sign.length, percentIndex)) / 100;
  return sign === "-" ? -floatValue : floatValue;
}

// Helper function to parse module effects
function parseModuleEffect(module, moduleLevel) {
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

const Modules = () => {
  const [moduleList, setModuleList] = useState(
    moduleData.map((module) => ({
      id: module.module_id,
      moduleName: module.module_name,
      moduleIcon: module.image_url,
      moduleType: module.module_type,
      moduleTier: module.module_tier,
      moduleClass: module.module_class,
      moduleSocketType: module.module_socket_type,
      moduleStat: module.module_stat,
      moduleEffects: parseModuleEffect(module, 0), // Initialize moduleEffects with level 0
    }))
  );

  const [equippedModules, setEquippedModules] = useState(() => {
    const cachedEquippedModules = localStorage.getItem("equippedModules");
    if (cachedEquippedModules) {
      const parsedEquippedModules = JSON.parse(cachedEquippedModules);
      return parsedEquippedModules.map((module) => ({
        module: {
          id: module.module.id,
          moduleName: module.module.moduleName,
          moduleIcon: module.module.moduleIcon,
          moduleType: module.module.moduleType,
          moduleTier: module.module.moduleTier,
          moduleClass: module.module.moduleClass,
          moduleSocketType: module.module.moduleSocketType,
          moduleStat: module.module.moduleStat,
        },
        moduleLevel: module.moduleLevel,
      }));
    } else {
      return Array(12).fill({ module: {}, moduleLevel: 0 });
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSocketTypes, setSelectedSocketTypes] = useState([]);
  const [selectedTiers, setSelectedTiers] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);

  const handleDragStart = (e, module) => {
    e.dataTransfer.setData("module", JSON.stringify(module));
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const module = JSON.parse(e.dataTransfer.getData("module"));
    setEquippedModules((prevEquippedModules) => {
      const newEquippedModules = [...prevEquippedModules];
      newEquippedModules[index] = { module, moduleLevel: 0 };
      localStorage.setItem("equippedModules", JSON.stringify(newEquippedModules));
      return newEquippedModules;
    });
    setModuleList((prevModuleList) => prevModuleList.filter((c) => c.id !== module.id));
  };

  const handleModuleDrop = (e) => {
    e.preventDefault();
    const moduleData = e.dataTransfer.getData("module");
    if (moduleData) {
      const module = JSON.parse(moduleData);
      if (!module.moduleStat) {
        module.moduleStat = [];
      }
      const index = equippedModules.findIndex((m) => m.module.id === module.id);
      if (index !== -1) {
        setEquippedModules((prevEquippedModules) => {
          const newEquippedModules = [...prevEquippedModules];
          newEquippedModules[index] = { module: {}, moduleLevel: 0 };
          localStorage.setItem("equippedModules", JSON.stringify(newEquippedModules));
          return newEquippedModules;
        });
      }
      setModuleList((prevModuleList) => {
        const newModuleList = [...prevModuleList];
        const index = newModuleList.findIndex((m) => m.id > module.id);
        if (index === -1) {
          newModuleList.push(module);
        } else {
          newModuleList.splice(index, 0, module);
        }
        return newModuleList;
      });
    }
  };

  const handleLevelChange = (index, module, level) => {
    setEquippedModules((prevEquippedModules) => {
      const newEquippedModules = [...prevEquippedModules];
      newEquippedModules[index] = { module, moduleLevel: level };
      localStorage.setItem("equippedModules", JSON.stringify(newEquippedModules));
      return newEquippedModules;
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSocketTypeChange = (e) => {
    const value = e.target.value;
    setSelectedSocketTypes(typeof value === "string" ? value.split(",") : value);
  };

  const handleTierChange = (e) => {
    const value = e.target.value;
    setSelectedTiers(typeof value === "string" ? value.split(",") : value);
  };

  const handleClassChange = (e) => {
    const value = e.target.value;
    setSelectedClasses(typeof value === "string" ? value.split(",") : value);
  };

  const filteredModules = moduleList.filter((module) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesName = module.moduleName.toLowerCase().includes(lowerCaseSearchTerm);

    const matchesSocketType = selectedSocketTypes.length > 0 ? selectedSocketTypes.includes(module.moduleSocketType) : true;
    const matchesTier = selectedTiers.length > 0 ? selectedTiers.includes(module.moduleTier) : true;
    const matchesClass = module.moduleClass === "Descendant"; // Only allow "Descendant" class

    return matchesName && matchesSocketType && matchesTier && matchesClass;
  });

  const getFilteredModules = () => {
    return moduleList.filter((module) => {
      const matchesSocketType = selectedSocketTypes.length === 0 || selectedSocketTypes.includes(module.moduleSocketType);
      const matchesTier = selectedTiers.length === 0 || selectedTiers.includes(module.moduleTier);
      const matchesClass = module.moduleClass === "Descendant"; // Only allow "Descendant" class
      return matchesSocketType && matchesTier && matchesClass;
    });
  };

  const getSocketTypeIcon = (socketType) => {
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
      default:
        return null;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "Standard":
        return colorStandard;
      case "Rare":
        return colorRare;
      case "Ultimate":
        return colorUltimate;
      case "Transcendent":
        return colorTranscendent;
      default:
        return "gray";
    }
  };

  const getClassIcon = (moduleClass) => {
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
      default:
        return null;
    }
  };

  const getSocketTypeCounts = () => {
    const counts = {};
    const filteredModules = getFilteredModules();

    filteredModules.forEach((module) => {
      if (counts[module.moduleSocketType]) {
        counts[module.moduleSocketType]++;
      } else {
        counts[module.moduleSocketType] = 1;
      }
    });

    return counts;
  };

  const getTierCounts = () => {
    const counts = {};
    const filteredModules = getFilteredModules();

    filteredModules.forEach((module) => {
      if (counts[module.moduleTier]) {
        counts[module.moduleTier]++;
      } else {
        counts[module.moduleTier] = 1;
      }
    });

    return counts;
  };

  const getClassCounts = () => {
    const counts = {};
    const filteredModules = getFilteredModules();

    filteredModules.forEach((module) => {
      if (counts[module.moduleClass]) {
        counts[module.moduleClass]++;
      } else {
        counts[module.moduleClass] = 1;
      }
    });

    return counts;
  };

  const calculateTotalEffects = (equippedModules) => {
    const totalEffects = {};
    equippedModules.forEach((equippedModule) => {
      const effects = parseModuleEffect(equippedModule.module, equippedModule.moduleLevel);
      Object.keys(effects).forEach((effectName) => {
        if (totalEffects[effectName]) {
          if (typeof effects[effectName] === "number") {
            totalEffects[effectName] += effects[effectName];
          } else {
            totalEffects[effectName] = effects[effectName];
          }
        } else {
          totalEffects[effectName] = effects[effectName];
        }
      });
    });
    return totalEffects;
  };

  const totalEffects = calculateTotalEffects(equippedModules);

  useEffect(() => {
    localStorage.setItem("totalEffects", JSON.stringify(totalEffects));
  }, [totalEffects]);

  useEffect(() => {
    const cachedEquippedModules = localStorage.getItem("equippedModules");
    if (cachedEquippedModules) {
      const parsedEquippedModules = JSON.parse(cachedEquippedModules);
      setEquippedModules(parsedEquippedModules);
    }
  }, []);

  return (
    <>
      <Box className="equipped-modules" margin="0" marginLeft="10%" marginRight="10%">
        <Grid container style={{ display: "flex", alignItems: "flex-start" }}>
          <Grid
            container
            item
            style={{
              marginRight: "10%",
              flex: 1,
            }}
          >
            {equippedModules.map((equippedModule, index) => (
              <Grid item margin={"40px"} marginBottom={"0px"} key={equippedModule.module.id}>
                <ModuleSlot equippedModule={equippedModule} onDrop={(e) => handleDrop(e, index)} index={index} onDragStart={handleDragStart} onLevelChange={handleLevelChange} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>

      <Box
        className="module-zone"
        width="100%"
        height={250}
        sx={{
          background: "grey",
          position: "fixed",
          bottom: 0,
          zIndex: 1000,
          overflow: "auto",
          borderTop: "2px solid black",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleModuleDrop}
      >
        <TextField className="search-bar" variant="outlined" placeholder="Search by module name..." value={searchTerm} onChange={handleSearchChange} sx={{ margin: 2 }} />

        <FormControl className="module-socket-type-filter" sx={{ margin: 2, minWidth: 200 }}>
          <InputLabel>Socket Type</InputLabel>
          <Select
            multiple
            value={selectedSocketTypes}
            label="Socket Type"
            onChange={handleSocketTypeChange}
            MenuProps={{ sx: { marginTop: "10px" } }}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selected
                  .sort((a, b) => MODULE_SOCKET_TYPES.indexOf(a) - MODULE_SOCKET_TYPES.indexOf(b))
                  .map((value) => (
                    <Box
                      key={value}
                      sx={{
                        width: "20px",
                        height: "20px",
                        backgroundImage: `url(${getSocketTypeIcon(value)})`,
                        backgroundSize: "cover",
                        borderRadius: "2px",
                      }}
                    />
                  ))}
              </Box>
            )}
          >
            {MODULE_SOCKET_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                <img src={getSocketTypeIcon(type)} alt={`${type} icon`} style={{ width: "20px", height: "20px", marginRight: "8px", background: "gray" }} />
                {type} ({getSocketTypeCounts()[type] || 0})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="module-tier-filter" sx={{ margin: 2, minWidth: 200 }}>
          <InputLabel>Tier</InputLabel>
          <Select
            multiple
            value={selectedTiers}
            label="Tier"
            onChange={handleTierChange}
            MenuProps={{ sx: { marginTop: "10px" } }}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selected
                  .sort((a, b) => MODULE_TIERS.indexOf(a) - MODULE_TIERS.indexOf(b))
                  .map((value) => (
                    <Box
                      key={value}
                      sx={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: getTierColor(value),
                        borderRadius: "2px",
                      }}
                    />
                  ))}
              </Box>
            )}
          >
            {MODULE_TIERS.map((tier) => (
              <MenuItem key={tier} value={tier}>
                <div
                  alt={`${tier} icon`}
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "8px",
                    backgroundColor: getTierColor(tier),
                  }}
                />
                {tier} ({getTierCounts()[tier] || 0})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="module-class-filter" sx={{ margin: 2, minWidth: 200 }}>
          <InputLabel>Module Class</InputLabel>
          <Select
            multiple
            value={selectedClasses}
            label="Module Class"
            onChange={handleClassChange}
            MenuProps={{ sx: { marginTop: "10px" } }}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selected
                  .sort((a, b) => MODULE_CLASSES.indexOf(a) - MODULE_CLASSES.indexOf(b))
                  .map((value) => (
                    <Box
                      key={value}
                      sx={{
                        width: "20px",
                        height: "20px",
                        backgroundImage: `url(${getClassIcon(value)})`,
                        backgroundSize: "cover",
                        borderRadius: "2px",
                      }}
                    />
                  ))}
              </Box>
            )}
          >
            {MODULE_CLASSES.map((cls) => (
              <MenuItem key={cls} value={cls}>
                <img src={getClassIcon(cls)} alt={`${cls} icon`} style={{ width: "20px", height: "20px", marginRight: "8px", background: "gray" }} />
                {cls} ({getClassCounts()[cls] || 0})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid container justifyContent="left" alignItems="center">
          {/* Render only filtered modules */}
          {filteredModules.map((module) => (
            <Grid item key={module.id} padding={1.5} marginTop={2} marginBottom={1}>
              <Module module={module} onDragStart={handleDragStart} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Modules;
