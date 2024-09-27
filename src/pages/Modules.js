// pages/Modules.js
import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import "../styles/styles.css";
import { Module } from "../components/Module";
import { ModuleSlot } from "../components/ModuleSlot";
import modulesData from "./Modules.json";

const Modules = () => {
  const [moduleList, setModuleList] = useState(modulesData);

  const [equippedModules, setEquippedModules] = useState([
    {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
  ]);

  const [height, setHeight] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [initialHeight, setInitialHeight] = useState(height);

  const minHeight = 200;
  const maxHeight = 600;

  // Event handlers for resizing
  const handleMouseDown = (e) => {
    setIsResizing(true);
    setStartY(e.clientY);
    setInitialHeight(height);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const newHeight = Math.max(initialHeight + (startY - e.clientY), minHeight);
    setHeight(Math.min(newHeight, maxHeight));
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleDragStart = (e, module) => {
    e.dataTransfer.setData("module", JSON.stringify(module));
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const module = JSON.parse(e.dataTransfer.getData("module"));
    const newEquippedModules = [...equippedModules];
    newEquippedModules[index] = module;
    setEquippedModules(newEquippedModules);
    setModuleList(moduleList.filter((c) => c.id !== module.id));
  };

  return (
    <>
      <Box className="equippedModules" marginLeft="10%" marginRight="10%">
        <Grid container style={{ display: "flex", alignItems: "flex-start" }}>
          <Grid
            container
            item
            style={{
              marginRight: "15%",
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
        height={height}
        sx={{
          background: "grey",
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 1000,
          overflow: "auto",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const moduleData = e.dataTransfer.getData("module");
          if (moduleData) {
            const module = JSON.parse(moduleData);
            setModuleList([...moduleList, module]);
            setEquippedModules(equippedModules.map((c) => (c.id === module.id ? { id: c.id, moduleName: "" } : c)));
          }
        }}
      >
        <Grid container justifyContent="left" alignItems="center">
          {moduleList.map((module) => (
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
