// src/pages/Modules.js
import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import "../styles/styles.css";
import { Module } from "../components/Module";
import { ModuleSlot } from "../components/ModuleSlot";
import moduleData from "../api/module.json";
import { MODULE_SOCKET_TYPES, MODULE_TIERS, MODULE_CLASSES, colorStandard, colorRare, colorUltimate, colorTranscendent } from "../const";
import { parseModuleEffect } from "../Utils";

const Modules = () => {
  const [moduleList, setModuleList] = useState(
    moduleData
      .sort((a, b) => a.module_id - b.module_id)
      .map((module) => ({
        id: module.module_id,
        moduleName: module.module_name,
        moduleIcon: module.image_url,
        moduleType: module.module_type,
        moduleTier: module.module_tier,
        moduleClass: module.module_class,
        moduleSocketType: module.module_socket_type,
        moduleStat: module.module_stat,
        moduleEffects: parseModuleEffect(module, module.moduleLevel),
      }))
  );

  const [equippedModules, setEquippedModules] = useState(() => {
    const cachedEquippedModules = localStorage.getItem("equippedModules");
    return cachedEquippedModules ? JSON.parse(cachedEquippedModules) : Array(12).fill({ module: {}, moduleLevel: 0 });
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
    const currentModule = equippedModules[index];
    setEquippedModules((prevEquippedModules) => {
      const newEquippedModules = [...prevEquippedModules];
      newEquippedModules[index] = { module, moduleLevel: 0 };
      // Remove the module from its previous slot if it exists
      const previousIndex = prevEquippedModules.findIndex((m) => m.module.id === module.id);
      if (previousIndex !== -1 && previousIndex !== index) {
        newEquippedModules[previousIndex] = { module: {}, moduleLevel: 0 };
      }
      localStorage.setItem("equippedModules", JSON.stringify(newEquippedModules));
      return newEquippedModules;
    });
    // If the ModuleSlot already has a Module, move it to the module list
    if (currentModule.module.id) {
      setModuleList((prevModuleList) => {
        const newModuleList = [...prevModuleList];
        const currentIndex = newModuleList.findIndex((m) => m.id > currentModule.module.id);
        if (currentIndex === -1) {
          newModuleList.push(currentModule.module);
        } else {
          newModuleList.splice(currentIndex, 0, currentModule.module);
        }
        // Sort the newModuleList
        newModuleList.sort((a, b) => a.id - b.id);
        return newModuleList;
      });
    }
    // Remove the module from the module list
    setModuleList((prevModuleList) => prevModuleList.filter((c) => c.id !== module.id));
  };

  const handleModuleDrop = (e) => {
    e.preventDefault();
    const moduleData = e.dataTransfer.getData("module");
    if (moduleData) {
      const module = JSON.parse(moduleData);
      // Check if the module is already in the module-zone
      if (!moduleList.find((m) => m.id === module.id)) {
        // Remove the module from its previous slot if it exists
        const index = equippedModules.findIndex((m) => m.module.id === module.id);
        if (index !== -1) {
          setEquippedModules((prevEquippedModules) => {
            const newEquippedModules = [...prevEquippedModules];
            newEquippedModules[index] = { module: {}, moduleLevel: 0 };
            localStorage.setItem("equippedModules", JSON.stringify(newEquippedModules));
            return newEquippedModules;
          });
        }
        // Add the module back to the module list
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
    const matchesName = module.moduleName.toLowerCase().includes(lowerCaseSearchTerm) + module.moduleStat[0]["value"].toLowerCase().includes(lowerCaseSearchTerm);

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
      setModuleList((prevModuleList) => prevModuleList.filter((module) => !parsedEquippedModules.some((equippedModule) => equippedModule.module.id === module.id)));
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
                <ModuleSlot
                  equippedModule={equippedModule}
                  onDrop={(e) => handleDrop(e, index)}
                  index={index}
                  onDragStart={handleDragStart}
                  onLevelChange={handleLevelChange}
                  onModuleDrop={handleModuleDrop} // Pass the onModuleDrop callback
                />
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
              <Module module={module} onDragStart={handleDragStart} onModuleDrop={handleModuleDrop} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Modules;
