// components/Module.js
import React from "react";
import { MODULE_WIDTH, MODULE_HEIGHT } from "../const";
import { ModuleIcon } from "./ModuleIcon";

export const Module = ({ module, onDragStart }) => {
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
      <ModuleIcon module={module} style={{ pointerEvents: "none" }} />
      <p
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
