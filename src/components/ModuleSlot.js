// components/ModuleSlot.js
import React from "react";
import { MODULE_WIDTH, MODULE_HEIGHT, SUB_MODULE_COLOR_HEX, SKILL_MODULE_COLOR_HEX, SUB_MODULE_STRING, SKILL_MODULE_STRING } from "../const";
import { Module } from "./Module";
import "../styles/ModuleSlot.css";

export const ModuleSlot = ({ equippedModule, onDrop, index, onDragStart }) => {
  let backgroundImage, backgroundString, backgroundStringColor, moduleSlotSocketType;

  switch (moduleSlotSocketType) {
    case "Cerulean":
      moduleSlotSocketType = "assets/Modules/Icon_Runes/Icon_RunesCapacity_Big_001.png";
      break;
    case "Almandine":
      moduleSlotSocketType = "assets/Modules/Icon_Runes/Icon_RunesCapacity_Big_002.png";
      break;
    case "Malachite":
      moduleSlotSocketType = "assets/Modules/Icon_Runes/Icon_RunesCapacity_Big_003.png";
      break;
    case "Xantic":
      moduleSlotSocketType = "assets/Modules/Icon_Runes/Icon_RunesCapacity_Big_004.png";
      break;
    case "Rutile":
      moduleSlotSocketType = "assets/Modules/Icon_Runes/Icon_RunesCapacity_Big_005.png";
      break;
  }

  if (index === 0) {
    backgroundImage = `url('assets/Modules/UI_RuneSlot_ChaBG01.png')`;
    backgroundString = SKILL_MODULE_STRING;
    backgroundStringColor = SKILL_MODULE_COLOR_HEX;
  } else if (index === 6) {
    backgroundImage = `url('assets/Modules/UI_RuneSlot_ChaBG02.png')`;
    backgroundString = SUB_MODULE_STRING;
    backgroundStringColor = SUB_MODULE_COLOR_HEX;
  }

  return (
    <div
      className="module-slot"
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: "relative",
        width: MODULE_WIDTH,
        height: MODULE_HEIGHT,
        backgroundImage: `url('assets/Modules/UI_RuneSlot_EmptyBg.png')`,
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, index)}
    >
      {moduleSlotSocketType && (
        <img
          className="module-slot-socket-type"
          src={moduleSlotSocketType}
          style={{
            position: "relative",
            width: 48,
            height: 48,
            bottom: "20%", // Center vertically
            left: "37.5%", // Center horizontally
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></img>
      )}

      {backgroundString && (
        <div
          className="background-string"
          style={{
            position: "absolute", // Change from relative to absolute
            width: MODULE_WIDTH,
            height: MODULE_HEIGHT,
            color: backgroundStringColor,
            bottom: "-138%", // Center vertically
            left: "50%", // Center horizontally
            transform: "translate(-50%, -50%)", // Adjust for the element's dimensions
            textAlign: "center",
            fontSize: 16,
            fontFamily: "NotoSans",
            filter: "saturate(10%) brightness(200%) contrast(100%)",
          }}
        >
          {backgroundString}
        </div>
      )}

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
          }}
        ></div>
      )}

      {Object.keys(equippedModule.module).length > 0 && equippedModule.module.moduleName ? (
        <Module module={equippedModule.module} onDragStart={onDragStart} isInModuleSlot={true} moduleLevel={equippedModule.moduleLevel} />
      ) : (
        <div
          className="module"
          style={{
            width: MODULE_WIDTH,
            height: MODULE_HEIGHT,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onDragStart={(e) => e.preventDefault()}
        ></div>
      )}
    </div>
  );
};
