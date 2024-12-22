// src/components/Module.js
import React, { useState, useMemo, useContext } from "react";
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

    const [isHovered, setIsHovered] = useState(false);

    const backgroundImage = module.moduleTier === "Transcendent" ? "url(assets/Modules/UI_RuneSlot_ChaBG01_mini.png)" : module.moduleStat[0].value.includes("Max Module Capacity") ? "url(assets/Modules/UI_RuneSlot_ChaBG02_mini.png)" : null;

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
            onLevelChange(module, moduleLevel + 1);
        }
    };

    const decrementLevel = (e) => {
        if (moduleLevel > 0) {
            setModuleLevel((prevLevel) => prevLevel - 1);
            onLevelChange(module, moduleLevel - 1);
        }
    };

    return (
        <Tooltip
            slotProps={{
                tooltip: {
                    sx: {
                        bgcolor: `${getTierColor(module.moduleTier)}ee`, // Slightly transparent background
                        border: "2px solid black",
                        borderRadius: 4,
                        filter: "grayscale(25%)",
                    },
                },
            }}
            title={
                <div id="module-description" style={{ fontSize: 16, color: "black" }}>
                    <div id="module-effect">{moduleDescription[3]}</div>

                    <hr color="black" />

                    <div id="module-id" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>{translationsModules.id}</div>
                        <div style={{ display: "flex", alignItems: "center", marginLeft: 8 }}>{moduleDescription[0]}</div>
                    </div>

                    <div id="module-class" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>{translationsModules.class}</div>
                        <div style={{ display: "flex", alignItems: "center", marginLeft: 8 }}>
                            {moduleDescription[1]}
                            <img width={16} height={16} src={moduleClass.replace("_Color", "")} style={{ filter: "brightness(0)", marginLeft: 4 }} alt="" />
                        </div>
                    </div>

                    <div id="module-socket-type" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>{translationsModules.socketType}</div>
                        <div style={{ display: "flex", alignItems: "center", marginLeft: 8 }}>
                            {moduleDescription[2]}
                            <img width={16} height={16} src={moduleSocketType} style={{ filter: "brightness(0)", marginLeft: 4 }} alt="" />
                        </div>
                    </div>
                </div>
            }
        >
            <div
                className="module"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: "relative",
                    width: MODULE_WIDTH,
                    height: MODULE_HEIGHT,
                    backgroundImage: `url(assets/Modules/UI_RuneSlot_Bg.png)`,
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
                    if (e.target.tagName === "BUTTON") return;
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
                            width: "100%",
                            height: "100%",
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
                {isInModuleSlot && isHovered && (
                    <div style={{ position: "absolute", right: "5%", bottom: "55%", display: "flex", rowGap: 12, flexDirection: "column" }}>
                        <button className="button" onClick={incrementLevel}>
                            +
                        </button>
                        <button className="button" onClick={decrementLevel}>
                            -
                        </button>
                    </div>
                )}

                <div
                    className="module-middle-deco"
                    style={{
                        backgroundImage: "url(assets/Modules/UI_Rune_Slot_MiddleDeco.png)",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        width: 78,
                        height: 34,
                        top: "-5%",
                        pointerEvents: "none",
                        color: "white",
                        zIndex: 10000,
                    }}
                >
                    <img
                        className="module-socket-type"
                        src={moduleSocketType}
                        alt={module.moduleSocketType}
                        style={{
                            position: "relative",
                            width: "27.2%",
                            height: "62.4%",
                            top: "10%",
                        }}
                    />

                    <div
                        className="module-capacity"
                        style={{
                            position: "relative",
                            top: "-15%",
                            fontFamily: "Teko",
                            fontSize: 30,
                        }}
                    >
                        {module.moduleStat[0].value.includes("Max Module Capacity") ? "+" : null}
                        {module.moduleStat[moduleLevel].module_capacity}
                    </div>
                </div>

                <img
                    className="module-class"
                    src={moduleClass}
                    alt={module.moduleClass}
                    style={{
                        position: "absolute",
                        width: 30,
                        height: 30,
                        top: "-1%",
                        right: "-1%",
                        pointerEvents: "none",
                    }}
                />

                <img
                    className="module-tier"
                    src="assets/Modules/UI_RuneSlot_Tier.png"
                    alt={module.moduleTier}
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

                <div style={{ display: "flex", flexDirection: "column", position: "absolute", bottom: "52.5%", left: "15%" }}>
                    {[...Array(currentMaxLevel)].map((_, index) => {
                        const effectiveIndex = currentMaxLevel - 1 - index;
                        return (
                            <div
                                key={index}
                                className="module-level-icon"
                                style={{
                                    width: 10,
                                    height: 4,
                                    borderRadius: 1,
                                    margin: 1,
                                    backgroundColor: effectiveIndex < moduleLevel ? "#F4833C" : "gray",
                                    position: "relative",
                                    bottom: effectiveIndex,
                                }}
                            />
                        );
                    })}
                </div>

                <div
                    className="module-name"
                    style={{
                        position: "absolute",
                        fontFamily: "NotoSans",
                        color: "white",
                        bottom: "12.5%",
                        width: MODULE_WIDTH * 0.8,
                        textAlign: "center",
                        height: 80,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                    }}
                >
                    {translations.moduleName[module.id]}
                </div>

                <div style={{ position: "absolute", bottom: "3%", color: "lightgrey", fontFamily: "NotoSans", fontSize: 14, pointerEvents: "none", textAlign: "center" }}>{translations.types[module.moduleType]}</div>
            </div>
        </Tooltip>
    );
};
