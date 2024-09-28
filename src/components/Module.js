// components/Module.js
import { React, useState } from "react";
import { MODULE_WIDTH, MODULE_HEIGHT, MODULE_ICON_WIDTH, MODULE_ICON_HEIGHT, filterStandard, filterRare, filterUltimate } from "../const";
import "../styles/Module.css";

export const Module = ({ module, onDragStart, isInModuleSlot }) => {
  const currentMaxLevel = module.moduleStat && module.moduleStat.length > 0 ? Math.max(...module.moduleStat.map((stat) => stat.level), 0) : 0;

  // State to hold the current module level and hover state
  const [moduleLevel, setModuleLevel] = useState(module.moduleLevel || 0);

  let moduleSocketType, moduleClass, moduleTier;

  switch (module.moduleSocketType) {
    case "Cerulean":
      moduleSocketType = "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_001.png";
      break;
    case "Almandine":
      moduleSocketType = "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_002.png";
      break;
    case "Malachite":
      moduleSocketType = "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_003.png";
      break;
    case "Xantic":
      moduleSocketType = "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_004.png";
      break;
    case "Rutile":
      moduleSocketType = "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_005.png";
      break;
  }

  switch (module.moduleClass) {
    case "Descendant":
      moduleClass = "assets/Modules/Icon_Runes/Icon_RunesClass_Mini_0_Color.png";
      break;
    case "General Rounds":
      moduleClass = "assets/Modules/Icon_Runes/Icon_RunesClass_Mini_A_Color.png";
      break;
    case "Special Rounds":
      moduleClass = "assets/Modules/Icon_Runes/Icon_RunesClass_Mini_B_Color.png";
      break;
    case "Impact Rounds":
      moduleClass = "assets/Modules/Icon_Runes/Icon_RunesClass_Mini_C_Color.png";
      break;
    case "Heavy Rounds":
      moduleClass = "assets/Modules/Icon_Runes/Icon_RunesClass_Mini_D_Color.png";
      break;
  }

  switch (module.moduleTier) {
    case "Standard":
      moduleTier = filterStandard;
      break;
    case "Rare":
      moduleTier = filterRare;
      break;
    case "Ultimate":
      moduleTier = filterUltimate;
      break;
  }

  // Functions for buttons
  const incrementLevel = (e) => {
    if (moduleLevel < currentMaxLevel) {
      setModuleLevel((prevLevel) => prevLevel + 1);
    }
  };

  const decrementLevel = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    if (moduleLevel > 0) {
      setModuleLevel((prevLevel) => prevLevel - 1);
    }
  };

  return (
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
        zIndex: 1,
      }}
      draggable={module !== null && module !== undefined}
      onDragStart={(e) => onDragStart(e, module)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {isInModuleSlot && (
        <div style={{ position: "absolute", bottom: 15, display: "flex", gap: "5px" }}>
          <button onClick={incrementLevel} style={{ padding: "5px", cursor: "pointer" }}>
            +
          </button>
          <button onClick={decrementLevel} style={{ padding: "5px", cursor: "pointer" }}>
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
        }}
      />
      <img
        className="module-socket-type"
        src={moduleSocketType}
        style={{
          position: "absolute",
          width: 20,
          height: 20,
          top: -6, // Adjust this value to move vertically
          left: 55, // Adjust this value to move horizontally
          pointerEvents: "none",
        }}
      />
      <p
        className="module-capacity"
        style={{
          position: "absolute",
          top: -42,
          left: 78,
          fontFamily: "Teko",
          fontSize: 28,
          color: "white",
          pointerEvents: "none",
        }}
      >
        {module.moduleStat && module.moduleStat[moduleLevel] ? module.moduleStat[moduleLevel].moduleCapacity : ""}
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
        src={"assets/Modules/UI_RuneSlot_Tier.png"}
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

      {module.moduleStat && module.moduleStat.length > 0 ? (
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
      ) : (
        <div />
      )}

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
        {module.moduleName}
      </p>
      <p style={{ position: "absolute", top: 164, color: "lightgrey", fontFamily: "NotoSans", fontSize: 14, pointerEvents: "none" }}>{module.moduleType}</p>
    </div>
  );
};
