// pages/Modules.js
import React, { useState } from "react";
import { Box, Grid, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material"; // Import necessary MUI components
import "../styles/styles.css";
import { Module } from "../components/Module";
import { ModuleSlot } from "../components/ModuleSlot";
import modulesData from "./Modules.json";

const Modules = () => {
  const [moduleList, setModuleList] = useState(modulesData);
  const [equippedModules, setEquippedModules] = useState(Array(12).fill({}));
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [selectedSocketTypes, setSelectedSocketTypes] = useState([]); // State for socket types
  const [selectedClasses, setSelectedClasses] = useState([]); // State for module classes

  const handleDragStart = (e, module) => {
    e.dataTransfer.setData("module", JSON.stringify(module));
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const module = JSON.parse(e.dataTransfer.getData("module"));
    setEquippedModules((prevEquippedModules) => {
      const newEquippedModules = [...prevEquippedModules];
      newEquippedModules[index] = module;
      return newEquippedModules;
    });
    setModuleList((prevModuleList) => prevModuleList.filter((c) => c.id !== module.id));
  };

  const handleModuleDrop = (e) => {
    e.preventDefault();
    const moduleData = e.dataTransfer.getData("module");
    if (moduleData) {
      const module = JSON.parse(moduleData);
      setModuleList((prevModuleList) => [...prevModuleList, module]);
      setEquippedModules((prevEquippedModules) => prevEquippedModules.map((c) => (c.id === module.id ? { id: c.id, moduleName: "" } : c)));
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term on change
  };

  const handleSocketTypeChange = (e) => {
    const value = e.target.value;
    setSelectedSocketTypes(typeof value === "string" ? value.split(",") : value);
  };

  const handleClassChange = (e) => {
    const value = e.target.value;
    setSelectedClasses(typeof value === "string" ? value.split(",") : value);
  };

  // Filter modules based on search term and selected filters
  const filteredModules = moduleList.filter((module) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesName = module.moduleName.toLowerCase().includes(lowerCaseSearchTerm);

    const matchesSocketType = selectedSocketTypes.length > 0 ? selectedSocketTypes.includes(module.moduleSocketType) : true;
    const matchesClass = selectedClasses.length > 0 ? selectedClasses.includes(module.moduleClass) : true;

    return matchesName && matchesSocketType && matchesClass;
  });

  // Function to get the socket type icon
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
        return null; // Return null if no match found
    }
  };

  // Function to get the class icon
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
        return null; // Return null if no match found
    }
  };

  // Get unique socket types and moduleClasses for dropdowns
  const moduleSocketTypes = [...new Set(moduleList.map((module) => module.moduleSocketType))];
  const moduleClasses = [...new Set(moduleList.map((module) => module.moduleClass))];

  return (
    <>
      <Box className="equippedModules" marginLeft="10%" marginRight="10%">
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
              <Grid item margin={"40px"} marginBottom={"0px"} key={equippedModule.id}>
                <ModuleSlot
                  equippedModule={equippedModule}
                  onDrop={(e) => handleDrop(e, index)}
                  index={index}
                  onDragStart={handleDragStart}
                  key={equippedModule ? equippedModule.id : index} // Add a unique key prop
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>

      <Box
        className="moduleZone"
        width="100%"
        height={300}
        sx={{
          background: "grey",
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 1000,
          overflow: "auto",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleModuleDrop}
      >
        <div className="searchBar">
          <TextField variant="outlined" placeholder="Search by module name..." value={searchTerm} onChange={handleSearchChange} sx={{ margin: 2 }} />

          <FormControl sx={{ margin: 2, minWidth: 200 }}>
            <InputLabel>Socket Type</InputLabel>
            <Select multiple value={selectedSocketTypes} label="Socket Type" onChange={handleSocketTypeChange}>
              {moduleSocketTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  <img src={getSocketTypeIcon(type)} alt={`${type} icon`} style={{ width: "20px", height: "20px", marginRight: "8px", background: "gray" }} />
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ margin: 2, minWidth: 200 }}>
            <InputLabel>Module Class</InputLabel>
            <Select multiple value={selectedClasses} label="Module Class" onChange={handleClassChange}>
              {moduleClasses.map((cls) => (
                <MenuItem key={cls} value={cls}>
                  <img src={getClassIcon(cls)} alt={`${cls} icon`} style={{ width: "20px", height: "20px", marginRight: "8px", background: "gray" }} />
                  {cls}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

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
