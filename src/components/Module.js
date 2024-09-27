// components/Module.js
import React from "react";
import { MODULE_WIDTH, MODULE_HEIGHT, MODULE_ICON_WIDTH, MODULE_ICON_HEIGHT, filterStandard, filterRare, filterUltimate } from "../const";

export const Module = ({ module, onDragStart }) => {
  let moduleSocketType, moduleClass, moduleTier;

  switch (module.moduleSocketType) {
    case "Cerulean":
      moduleSocketType = "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_001.png";
      break;
    case "Almandine":
      moduleSocketType = "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_003.png";
      break;
    case "Malachite":
      moduleSocketType = "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_003.png";
      break;
    case "Xantic":
      moduleSocketType = "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_004.png";
      break;
    case "Rutile":
      moduleSocketType = "assets/Modules/Icon_Runes/Icon_RunesCapacity_Mini_004.png";
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
        zIndex: 1, // needed to cut the redundant background part of dragged module.
      }}
      draggable={module !== null && module !== undefined}
      onDragStart={(e) => onDragStart(e, module)}
    >
      <img
        className="module-middle-deco"
        src="assets/Modules/UI_Rune_Slot_MiddleDeco.png"
        style={{
          position: "absolute",
          width: 78,
          height: 34,
          top: -12,
          pointerEvents: "none",
        }}
      />

      <img
        className="module-socket-type"
        src={moduleSocketType}
        style={{
          position: "absolute",
          width: 24,
          height: 24,
          top: -8, // Adjust this value to move vertically
          left: 50, // Adjust this value to move horizontally
          pointerEvents: "none",
        }}
      />

      <img
        className="module-class"
        src={moduleClass}
        style={{
          position: "absolute",
          width: 24,
          height: 24,
          top: -1,
          left: 124,
          pointerEvents: "none",
        }}
      />

      <p
        className="module-capacity"
        style={{
          position: "absolute",
          top: -44,
          left: 78,
          fontFamily: "Teko",
          fontSize: 28,
          color: "white",
          pointerEvents: "none",
        }}
      >
        {module.moduleStat && module.moduleStat[5] ? module.moduleStat[5].moduleCapacity : ""}
      </p>

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

      <p style={{ position: "absolute", top: 164, color: "lightgrey", fontFamily: "NotoSans", fontSize: 14, pointerEvents: "none" }}>{module.moduleType}</p>

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
    </div>
  );
};
