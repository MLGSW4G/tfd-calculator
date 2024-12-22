// src/components/ModuleSlot.js
import React, { useContext } from "react";
import { MODULE_WIDTH, MODULE_HEIGHT, SUB_MODULE_COLOR_HEX, SKILL_MODULE_COLOR_HEX } from "../const";
import { getTranslation } from "../translations";
import { LocalizationContext } from "./LocalizationContext";
import { Module } from "./Module";
import { getSocketTypeIcon } from "../Utils";
import "../styles/ModuleSlot.css";

export const ModuleSlot = ({ equippedModule, onDrop, index, onDragStart, onLevelChange, onModuleDrop, socketType }) => {
    const { language } = useContext(LocalizationContext);
    const translations = getTranslation(language, "moduleSlot");

    const backgroundImage = index === 0 ? `url('assets/Modules/UI_RuneSlot_ChaBG01.png')` : index === 6 ? `url('assets/Modules/UI_RuneSlot_ChaBG02.png')` : null,
        backgroundString = index === 0 ? translations.skillModuleString : index === 6 ? translations.subModuleString : null,
        backgroundStringColor = index === 0 ? SKILL_MODULE_COLOR_HEX : index === 6 ? SUB_MODULE_COLOR_HEX : null,
        moduleSlotSocketType = getSocketTypeIcon(socketType);

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
                        position: "absolute",
                        width: 48,
                        height: 48,
                        bottom: 116,
                    }}
                    alt=""
                />
            )}

            {backgroundString && (
                <div
                    className="background-string"
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "15%",
                        color: backgroundStringColor,
                        bottom: 0,
                        textAlign: "center",
                        fontSize: 18,
                        fontFamily: "NotoSans",
                        filter: "saturate(10%) brightness(200%) contrast(100%)",
                        pointerEvents: "none",
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
                        width: "100%",
                        height: "100%",
                        backgroundImage: backgroundImage,
                        backgroundSize: "cover",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 2,
                        pointerEvents: "none",
                    }}
                />
            )}

            {Object.keys(equippedModule.module).length !== 0 && (
                <Module
                    module={equippedModule.module}
                    onDragStart={onDragStart}
                    isInModuleSlot={true}
                    onLevelChange={(module, level) => onLevelChange(index, module, level)}
                    initialModuleLevel={equippedModule.moduleLevel}
                    onModuleDrop={onModuleDrop}
                />
            )}
        </div>
    );
};
