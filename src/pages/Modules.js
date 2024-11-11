// src/pages/Modules.js
import React, { useState, useEffect, useContext } from "react";
import { LocalizationContext } from "../components/LocalizationContext";
import { Box, Grid, TextField, MenuItem, Select, InputLabel, FormControl, Button, Snackbar } from "@mui/material";
import "../styles/styles.css";
import { Module } from "../components/Module";
import { ModuleSlot } from "../components/ModuleSlot";
import moduleData from "../api/module.json";
import { MODULE_SOCKET_TYPES, MODULE_TIERS, MODULE_CLASSES, MODULE_TYPES } from "../const";
import { parseModuleEffect, getClassIcon, getSocketTypeIcon, getTierColor } from "../Utils";
import { getTranslation } from "../translations";

const Modules = () => {
  const { language } = useContext(LocalizationContext);
  const translations = getTranslation(language, "modules");
  const translationsModule = getTranslation(language, "module");

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
    }))
  );

  const [equippedModules, setEquippedModules] = useState(() => {
    const cachedEquippedModules = localStorage.getItem("equippedModules");
    return cachedEquippedModules ? JSON.parse(cachedEquippedModules) : Array(12).fill({ module: {}, moduleLevel: 0 });
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSocketTypes, setSelectedSocketTypes] = useState([]);
  const [selectedTiers, setSelectedTiers] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState(["Descendant"]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState("id");

  const [pasteData, setPasteData] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleCopyModules = () => {
    const equippedModulesData = JSON.stringify(equippedModules);
    console.log(`Copied modules: \n${equippedModulesData}`);
    navigator.clipboard.writeText(equippedModulesData);
    setSnackbar({ open: true, message: translations.modulesCopied });
  };

  const handlePasteModules = () => {
    try {
      const parsedModules = JSON.parse(pasteData);
      console.log(`Pasted modules: \n${pasteData}`);
      setEquippedModules(parsedModules);
      localStorage.setItem("equippedModules", JSON.stringify(parsedModules));
      setSnackbar({ open: true, message: translations.modulesPasted });
    } catch (error) {
      setSnackbar({ open: true, message: translations.modulesPastedError });
    }
  };

  const handleDragStart = (e, module) => {
    e.dataTransfer.setData("module", JSON.stringify(module));
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const module = JSON.parse(e.dataTransfer.getData("module"));
    const currentModule = equippedModules[index];

    // Check if the module can be equipped onto the current slot
    if (
      (index === 0 && module.moduleTier === "Transcendent") ||
      (index === 6 && module.moduleStat[0].value.includes("Max Module Capacity")) ||
      (index !== 6 && index !== 0 && !module.moduleStat[0].value.includes("Max Module Capacity") && module.moduleTier !== "Transcendent")
    ) {
      setEquippedModules((prevEquippedModules) => {
        const newEquippedModules = [...prevEquippedModules];
        // Remove the module from its previous slot if it exists
        const previousIndex = prevEquippedModules.findIndex((m) => m.module.id === module.id);
        newEquippedModules[index] = { module: module, moduleLevel: prevEquippedModules[previousIndex || 0]?.moduleLevel || 0 };
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

          return newModuleList;
        });
      }
      // Remove the module from the module list
      setModuleList((prevModuleList) => prevModuleList.filter((c) => c.id !== module.id));
    } else {
      // If the module cannot be equipped onto the current slot, do nothing
      return;
    }
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

  const filteredModules = moduleList
    .filter((module) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesName =
        translationsModule.moduleName[module.id].toLowerCase().includes(lowerCaseSearchTerm) + translationsModule.moduleStat[module.moduleStat[0].value].toLowerCase().includes(lowerCaseSearchTerm) + module.id.includes(lowerCaseSearchTerm);

      const matchesSocketType = selectedSocketTypes.length > 0 ? selectedSocketTypes.includes(module.moduleSocketType) : true;
      const matchesTier = selectedTiers.length > 0 ? selectedTiers.includes(module.moduleTier) : true;
      const matchesClass = selectedClasses.length > 0 ? selectedClasses.includes(module.moduleClass) : true;
      const matchesType = selectedTypes.length > 0 ? selectedTypes.includes(module.moduleType) : true;

      return matchesName && matchesSocketType && matchesTier && matchesClass && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "id":
          return a.id - b.id;
        case "name":
          return translationsModule.moduleName[a.id].localeCompare(translationsModule.moduleName[b.id]);
        case "socketType":
          return MODULE_SOCKET_TYPES.indexOf(a.moduleSocketType) - MODULE_SOCKET_TYPES.indexOf(b.moduleSocketType);
        case "tier":
          return MODULE_TIERS.indexOf(a.moduleTier) - MODULE_TIERS.indexOf(b.moduleTier);
        case "class":
          return MODULE_CLASSES.indexOf(a.moduleClass) - MODULE_CLASSES.indexOf(b.moduleClass);
        case "type":
          return MODULE_TYPES.indexOf(a.moduleType) - MODULE_TYPES.indexOf(b.moduleType);
      }
    });

  const getSocketTypeCounts = () => {
    const counts = {};

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

    filteredModules.forEach((module) => {
      if (counts[module.moduleClass]) {
        counts[module.moduleClass]++;
      } else {
        counts[module.moduleClass] = 1;
      }
    });

    return counts;
  };

  const getTypeCounts = () => {
    const counts = {};

    filteredModules.forEach((module) => {
      if (counts[module.moduleType]) {
        counts[module.moduleType]++;
      } else {
        counts[module.moduleType] = 1;
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

  useEffect(() => {
    const totalEffects = calculateTotalEffects(equippedModules);
    localStorage.setItem("totalEffects", JSON.stringify(totalEffects));
  }, [equippedModules]);

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
      <Box className="equipped-modules" margin="0" marginLeft="10%" marginRight="25%" marginTop="1%" position="relative">
        <Grid container style={{ display: "flex", alignItems: "flex-start" }}>
          {equippedModules.map((equippedModule, index) => (
            <Grid
              item
              key={equippedModule.module.id}
              style={{
                flex: 0,
              }}
            >
              <Grid item margin="15px" marginBottom="0px">
                <ModuleSlot
                  equippedModule={equippedModule}
                  onDrop={(e) => handleDrop(e, index)}
                  index={index}
                  onDragStart={handleDragStart}
                  onLevelChange={handleLevelChange}
                  onModuleDrop={handleModuleDrop} // Pass the onModuleDrop callback
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ marginTop: "1%", marginBottom: "1%", display: "flex", justifyContent: "space-between", padding: "0 2% 0" }}>
        <Button sx={{ color: "#333" }} className="button" onClick={handleCopyModules}>
          {translations.copyEquippedModulesData}
        </Button>

        <TextField variant="outlined" placeholder={translations.equippedModulesDataPlaceholder} value={pasteData} onChange={(e) => setPasteData(e.target.value)} sx={{ width: "60%" }} />

        <Button sx={{ color: "#333" }} className="button" onClick={handlePasteModules}>
          {translations.pasteEquippedModulesData}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => {
          setSnackbar({ ...snackbar, open: false });
        }}
        message={snackbar.message}
      />

      <Box
        className="module-zone"
        width="100%"
        sx={{
          background: "grey",
          position: "fixed",
          bottom: 0,
          top: "70%",
          zIndex: 1000,
          overflow: "auto",
          borderTop: "2px solid black",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleModuleDrop}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            left: 0,
            width: "100%",
            background: "inherit",
            borderBottom: "2px solid black",
            padding: 0,
            zIndex: 10000, // add a higher z-index to ensure it stays on top
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <TextField
              className="search-bar"
              variant="outlined"
              placeholder={translations.searchBarPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              sx={{ margin: 1 }}
            />

            <FormControl className="module-socket-type-filter" sx={{ margin: 1, minWidth: 200 }}>
              <InputLabel>{translations.socketType}</InputLabel>
              <Select
                multiple
                label={translations.socketType}
                value={selectedSocketTypes}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedSocketTypes(typeof value === "string" ? value.split(",") : value);
                }}
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
                            filter: "brightness(0)",
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
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img src={getSocketTypeIcon(type)} alt={`${type} icon`} style={{ width: "20px", height: "20px", marginRight: "8px", filter: "brightness(0)" }} />
                        {translationsModule.socketTypes[type]}
                      </Box>
                      <Box sx={{ textAlign: "right" }}>{getSocketTypeCounts()[type] || 0}</Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="module-tier-filter" sx={{ margin: 1, minWidth: 210 }}>
              <InputLabel>{translations.tier}</InputLabel>
              <Select
                multiple
                label={translations.tier}
                value={selectedTiers}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedTiers(typeof value === "string" ? value.split(",") : value);
                }}
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
                            borderRadius: "20px",
                          }}
                        />
                      ))}
                  </Box>
                )}
              >
                {MODULE_TIERS.map((tier) => (
                  <MenuItem key={tier} value={tier}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <div
                          alt={`${tier} icon`}
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "8px",
                            backgroundColor: getTierColor(tier),
                            borderRadius: "20px",
                          }}
                        />
                        {translationsModule.tiers[tier]}
                      </Box>
                      <Box sx={{ textAlign: "right" }}>{getTierCounts()[tier] || 0}</Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="module-class-filter" sx={{ margin: 1, minWidth: 250 }}>
              <InputLabel>{translations.class}</InputLabel>
              <Select
                multiple
                label={translations.class}
                value={selectedClasses}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedClasses(typeof value === "string" ? value.split(",") : value);
                }}
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
                  <MenuItem key={cls} value={cls} disabled>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img src={getClassIcon(cls)} alt={`${cls} icon`} style={{ width: "20px", height: "20px", marginRight: "8px" }} />
                        {translationsModule.classes[cls]}
                      </Box>
                      <Box sx={{ textAlign: "right" }}>{getClassCounts()[cls] || 0}</Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="module-type-filter" sx={{ margin: 1, minWidth: 240 }}>
              <InputLabel>{translations.type}</InputLabel>
              <Select
                multiple
                label={translations.type}
                value={selectedTypes}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedTypes(typeof value === "string" ? value.split(",") : value);
                }}
                MenuProps={{ sx: { marginTop: "10px" } }}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selected
                      .sort((a, b) => MODULE_TYPES.indexOf(a) - MODULE_TYPES.indexOf(b))
                      .map((value) => (
                        <Box
                          key={value}
                          sx={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "2px",
                          }}
                        />
                      ))}
                  </Box>
                )}
              >
                {MODULE_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>{translationsModule.types[type]}</Box>
                      <Box sx={{ textAlign: "right" }}>{getTypeCounts()[type] || 0}</Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", marginRight: 1 }}>
            <FormControl sx={{ margin: 1, minWidth: 200 }}>
              <InputLabel>{translations.sortBy}</InputLabel>
              <Select label={translations.sortBy} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <MenuItem value="id">{translations.id}</MenuItem>
                <MenuItem value="name">{translations.name}</MenuItem>
                <MenuItem value="socketType">{translations.socketType}</MenuItem>
                <MenuItem value="tier">{translations.tier}</MenuItem>
                <MenuItem value="class">{translations.class}</MenuItem>
                <MenuItem value="type">{translations.type}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Grid container justifyContent="left" alignItems="center">
          {/* Render only filtered modules */}
          {filteredModules.map((module) => (
            <Grid item key={module.id} padding={1.25} marginTop={1.5} marginBottom={1.5} paddingBottom={0} paddingTop={0}>
              <Module module={module} onDragStart={handleDragStart} onModuleDrop={handleModuleDrop} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Modules;
