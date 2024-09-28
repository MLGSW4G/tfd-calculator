// pages/Modules.js
import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import "../styles/styles.css";
import { Module } from "../components/Module";
import { ModuleSlot } from "../components/ModuleSlot";
import modulesData from "./Modules.json";
import { MODULE_SOCKET_TYPES, MODULE_CLASSES } from "../const";

const Modules = () => {
  const [moduleList, setModuleList] = useState(modulesData);
  const [equippedModules, setEquippedModules] = useState(() => {
    const cachedEquippedModules = localStorage.getItem("equippedModules");
    return cachedEquippedModules ? JSON.parse(cachedEquippedModules) : Array(12).fill({ module: {}, moduleLevel: 0 });
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSocketTypes, setSelectedSocketTypes] = useState([]);
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

  const handleClassChange = (e) => {
    const value = e.target.value;
    setSelectedClasses(typeof value === "string" ? value.split(",") : value);
  };

  const filteredModules = moduleList.filter((module) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesName = module.moduleName.toLowerCase().includes(lowerCaseSearchTerm);

    const matchesSocketType = selectedSocketTypes.length > 0 ? selectedSocketTypes.includes(module.moduleSocketType) : true;
    const matchesClass = selectedClasses.length > 0 ? selectedClasses.includes(module.moduleClass) : true;

    return matchesName && matchesSocketType && matchesClass;
  });

  const getFilteredModules = () => {
    return moduleList.filter((module) => {
      const matchesSocketType = selectedSocketTypes.length === 0 || selectedSocketTypes.includes(module.moduleSocketType);
      const matchesClass = selectedClasses.length === 0 || selectedClasses.includes(module.moduleClass);
      return matchesSocketType && matchesClass;
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
        return "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_004.png";
      default:
        return null;
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
      case "Heavy Rounds":
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

  const calculateTotalBonuses = (equippedModules) => {
    const totalBonuses = {};
    equippedModules.forEach((equippedModule) => {
      if (equippedModule.module.moduleStat && equippedModule.moduleLevel < equippedModule.module.moduleStat.length) {
        const stat = equippedModule.module.moduleStat[equippedModule.moduleLevel];
        Object.keys(stat).forEach((key) => {
          if (key !== "level" && key !== "moduleCapacity") {
            if (totalBonuses[key]) {
              totalBonuses[key] += stat[key];
            } else {
              totalBonuses[key] = stat[key];
            }
          }
        });
      }
    });
    return totalBonuses;
  };

  const totalBonuses = calculateTotalBonuses(equippedModules);

  useEffect(() => {
    localStorage.setItem("totalBonuses", JSON.stringify(totalBonuses));
  }, [totalBonuses]);

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
          <Select multiple value={selectedSocketTypes} label="Socket Type" onChange={handleSocketTypeChange}>
            {MODULE_SOCKET_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                <img src={getSocketTypeIcon(type)} alt={`${type} icon`} style={{ width: "20px", height: "20px", marginRight: "8px", background: "gray" }} />
                {type} ({getSocketTypeCounts()[type] || 0})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="module-class-filter" sx={{ margin: 2, minWidth: 200 }}>
          <InputLabel>Module Class</InputLabel>
          <Select multiple value={selectedClasses} label="Module Class" onChange={handleClassChange}>
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
