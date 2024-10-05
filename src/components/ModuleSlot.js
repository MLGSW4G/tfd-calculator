// src/components/ModuleSlot.js
import { React, useContext } from "react";
import { MODULE_WIDTH, MODULE_HEIGHT, SUB_MODULE_COLOR_HEX, SKILL_MODULE_COLOR_HEX, SUB_MODULE_STRING, SKILL_MODULE_STRING } from "../const";
import { getTranslation } from "../translations";
import { LocalizationContext } from "./LocalizationContext";
import { Module } from "./Module";
import "../styles/ModuleSlot.css";

export const ModuleSlot = ({ equippedModule, onDrop, index, onDragStart, onLevelChange, onModuleDrop }) => {
  const { language } = useContext(LocalizationContext);
  const translations = getTranslation(language, "moduleSlot");
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
    backgroundString = translations.skillModuleString;
    backgroundStringColor = SKILL_MODULE_COLOR_HEX;
  } else if (index === 6) {
    backgroundImage = `url('assets/Modules/UI_RuneSlot_ChaBG02.png')`;
    backgroundString = translations.subModuleString;
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
            bottom: "20%",
            left: "37.5%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></img>
      )}

      {backgroundString && (
        <p
          className="background-string"
          style={{
            position: "absolute",
            width: MODULE_WIDTH,
            height: MODULE_HEIGHT * 0.15,
            color: backgroundStringColor,
            bottom: "0",
            textAlign: "center",
            fontSize: 16,
            margin: 0,
            fontFamily: "NotoSans",
            filter: "saturate(10%) brightness(200%) contrast(100%)",
          }}
        >
          {backgroundString}
        </p>
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
        <Module
          module={equippedModule.module}
          onDragStart={onDragStart}
          isInModuleSlot={true}
          onLevelChange={(module, level) => onLevelChange(index, module, level)} // Pass the onLevelChange callback
          initialModuleLevel={equippedModule.moduleLevel} // Pass the initial module level
          onModuleDrop={onModuleDrop} // Pass the onModuleDrop callback
        />
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
