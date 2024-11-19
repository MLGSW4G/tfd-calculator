// src/components/Module.js
import { React, useState, useMemo, useContext } from "react";
import { MODULE_WIDTH, MODULE_HEIGHT, MODULE_ICON_WIDTH, MODULE_ICON_HEIGHT } from "../const";
import "../styles/Module.css";
import { Tooltip } from "@mui/material";
import { getTranslation } from "../translations";
import { LocalizationContext } from "./LocalizationContext";
import { getClassIcon, getSocketTypeIcon, getTierColor, getTierFilter } from "../Utils";

export const Module = ({ module, onDragStart, isInModuleSlot, onLevelChange, initialModuleLevel, onModuleDrop }) => {
  const { language } = useContext(LocalizationContext);
  const translations = getTranslation(language, "module");
  const translationsModules = getTranslation(language, "modules");

  const backgroundImage =
    module.moduleTier === "Transcendent" ? `url('assets/Modules/UI_RuneSlot_ChaBG01_mini.png')` : module.moduleStat[0].value.includes("Max Module Capacity") ? `url('assets/Modules/UI_RuneSlot_ChaBG02_mini.png')` : null;

  const currentMaxLevel = Math.max(...module.moduleStat.map((stat) => stat.level), 0);

  const [moduleLevel, setModuleLevel] = useState(initialModuleLevel || 0);

  const moduleDescription = useMemo(() => {
    return [module.id, translations.classes[module.moduleClass], translations.socketTypes[module.moduleSocketType], translations.moduleStat[module.moduleStat[moduleLevel].value]];
  }, [module, moduleLevel, translations]);

  const moduleSocketType = getSocketTypeIcon(module.moduleSocketType),
    moduleClass = getClassIcon(module.moduleClass),
    moduleTier = getTierFilter(module.moduleTier);

  const incrementLevel = (e) => {
    if (moduleLevel < currentMaxLevel) {
      setModuleLevel((prevLevel) => prevLevel + 1);
      onLevelChange(module, moduleLevel + 1); // Call the onLevelChange callback
    }
  };

  const decrementLevel = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    if (moduleLevel > 0) {
      setModuleLevel((prevLevel) => prevLevel - 1);
      onLevelChange(module, moduleLevel - 1); // Call the onLevelChange callback
    }
  };

  return (
    <Tooltip
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: `${getTierColor(module.moduleTier)}ee`, // Slightly transparent background
            border: "2px solid black",
            borderRadius: "4px",
            filter: "grayscale(25%)", // Apply grayscale to the background
          },
        },
      }}
      title={
        <div id="module-description" style={{ fontSize: 16, color: "black" }}>
          <div id="module-effect">{moduleDescription[3]}</div>

          <hr color="black" />

          <div id="module-id" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0 }}>{translationsModules.id}</p>
            <div style={{ display: "flex", alignItems: "center", marginLeft: "8px" }}>{moduleDescription[0]}</div>
          </div>

          <div id="module-class" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0 }}>{translationsModules.class}</p>
            <div style={{ display: "flex", alignItems: "center", marginLeft: "8px" }}>
              {moduleDescription[1]}
              <img width={16} height={16} src={moduleClass.replace("_Color", "")} style={{ filter: "brightness(0)", marginLeft: "4px" }} alt="" />
            </div>
          </div>

          <div id="module-socket-type" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0 }}>{translationsModules.socketType}</p>
            <div style={{ display: "flex", alignItems: "center", marginLeft: "8px" }}>
              {moduleDescription[2]}
              <img width={16} height={16} src={moduleSocketType} style={{ filter: "brightness(0)", marginLeft: "4px" }} alt="" />
            </div>
          </div>
        </div>
      }
    >
      <div
        className="module"
        style={{
          position: "relative",
          width: MODULE_WIDTH,
          height: MODULE_HEIGHT,
          backgroundImage: `url('assets/Modules/UI_RuneSlot_Bg.png')`,
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "auto",
          zIndex: 1000,
        }}
        draggable={module !== null && module !== undefined}
        onDragStart={(e) => onDragStart(e, module)}
        onContextMenu={(e) => e.preventDefault()}
        onDoubleClick={(e) => {
          if (e.target.tagName === "BUTTON") return; // Check if the event target is a button
          if (module !== null && module !== undefined) {
            const moduleData = JSON.stringify(module);
            const event = new DataTransfer();
            event.setData("module", moduleData);
            onModuleDrop({ preventDefault: () => {}, dataTransfer: event });
          }
        }}
      >
        {backgroundImage && (
          <div
            className="background-image"
            style={{
              position: "absolute",
              width: MODULE_WIDTH,
              height: MODULE_HEIGHT,
              backgroundImage: backgroundImage,
              backgroundSize: "cover",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pointerEvents: "none",
              zIndex: 1001,
            }}
          />
        )}
        {isInModuleSlot && (
          <div style={{ position: "absolute", right: "5%", bottom: "55%", display: "flex", rowGap: "5px", flexDirection: "column" }}>
            <button className="button" onClick={incrementLevel}>
              +
            </button>
            <button className="button" onClick={decrementLevel}>
              -
            </button>
          </div>
        )}

        <img
          className="module-middle-deco"
          src="assets/Modules/UI_Rune_Slot_MiddleDeco.png"
          style={{
            position: "absolute",
            width: 78,
            height: 34,
            top: -10,
            pointerEvents: "none",
            zIndex: -1,
          }}
        />

        <img
          className="module-socket-type"
          src={moduleSocketType}
          style={{
            position: "absolute",
            width: 20,
            height: 20,
            top: -6,
            left: 55,
            pointerEvents: "none",
          }}
        />

        <p
          className="module-capacity"
          style={{
            position: "absolute",
            top: -42,
            left: 76,
            fontFamily: "Teko",
            fontSize: 28,
            color: "white",
            pointerEvents: "none",
          }}
        >
          {module.moduleStat[0].value.includes("Max Module Capacity") ? "+" : null}
          {module.moduleStat[moduleLevel].module_capacity}
        </p>

        <img
          className="module-class"
          src={moduleClass}
          style={{
            position: "absolute",
            width: 30,
            height: 30,
            top: -2,
            left: 120,
            pointerEvents: "none",
          }}
        />

        <img
          className="module-tier"
          src="assets/Modules/UI_RuneSlot_Tier.png"
          alt={module.moduleName}
          style={{
            position: "absolute",
            width: 74,
            height: 74,
            top: 24,
            filter: moduleTier,
            pointerEvents: "none",
          }}
        />

        <img
          className="module-icon"
          src={module.moduleIcon}
          alt={module.moduleName}
          style={{
            position: "absolute",
            width: MODULE_ICON_WIDTH,
            height: MODULE_ICON_HEIGHT,
            top: 24,
            pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", position: "absolute", bottom: 106, left: 20 }}>
          {[...Array(currentMaxLevel)].map((_, index) => {
            const effectiveIndex = currentMaxLevel - 1 - index;
            return (
              <div
                key={index}
                className="module-level-icon"
                style={{
                  width: "12px",
                  height: "4px",
                  borderRadius: "1.5px",
                  margin: "1px",
                  backgroundColor: effectiveIndex < moduleLevel ? "#F4833C" : "gray",
                  position: "relative",
                  bottom: `${effectiveIndex}px`,
                }}
              />
            );
          })}
        </div>

        <p
          className="module-name"
          style={{
            position: "absolute",
            fontSize: 16,
            fontFamily: "NotoSans",
            color: "white",
            top: 100,
            width: MODULE_WIDTH - 30,
            textAlign: "center",
            lineHeight: "normal",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          {translations.moduleName[module.id]}
        </p>

        <p style={{ position: "absolute", top: 164, color: "lightgrey", fontFamily: "NotoSans", fontSize: 14, pointerEvents: "none", textAlign: "center" }}>{translations.types[module.moduleType]}</p>
      </div>
    </Tooltip>
  );
};
