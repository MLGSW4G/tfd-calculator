// components/ModuleSlot.js
import React from "react";
import { MODULE_WIDTH, MODULE_HEIGHT } from "../const";
import { Module } from "./Module";

export const ModuleSlot = ({ equippedModule, onDrop, index, onDragStart }) => {
  let backgroundImage;
  if (index === 0) {
    backgroundImage = `url('assets/Modules/UI_RuneSlot_ChaBG01.png')`;
  } else if (index === 5) {
    backgroundImage = `url('assets/Modules/UI_RuneSlot_ChaBG02.png')`;
  } else {
    backgroundImage = null;
  }
  return (
    <div
      className="equipped-module-slot"
      style={{
        width: MODULE_WIDTH,
        height: MODULE_HEIGHT,
        backgroundImage: `url('assets/Modules/UI_RuneSlot_EmptyBg.png')`,
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, index)}
    >
      <div
        style={{
          position: "absolute",
          width: MODULE_WIDTH,
          height: MODULE_HEIGHT,
          backgroundImage: backgroundImage,
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
        }}
      ></div>
      {equippedModule ? (
        <Module module={equippedModule} onDragStart={onDragStart} />
      ) : (
        <div
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
