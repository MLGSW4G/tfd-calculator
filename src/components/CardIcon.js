// components/CardIcon.js
import React from "react";
import { CARD_ICON_WIDTH, CARD_ICON_HEIGHT, filterStandard, filterRare, filterUltimate } from "../const";

export const CardIcon = ({ card }) => {
  let moduleSocketType, moduleClass, moduleTier;

  switch (card.moduleSocketType) {
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

  switch (card.moduleClass) {
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

  switch (card.moduleTier) {
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
    <>
      <img
        src="assets/Modules/UI_Rune_Slot_MiddleDeco.png"
        style={{
          position: "absolute",
          width: 78,
          height: 34,
          top: -12,
        }}
      />

      <img
        src={moduleSocketType}
        style={{
          position: "absolute",
          width: 24,
          height: 24,
          top: -8, // Adjust this value to move vertically
          left: 50, // Adjust this value to move horizontally
        }}
      />

      <img
        src={moduleClass}
        style={{
          position: "absolute",
          width: 24,
          height: 24,
          top: -1,
          left: 124,
        }}
      />

      <p
        style={{
          position: "absolute",
          top: -44,
          left: 78,
          fontFamily: "Teko",
          fontSize: 28,
          color: "white",
        }}
      >
        {card.moduleStat[5].moduleCapacity}
      </p>

      <img
        src={card.moduleIcon}
        alt={card.moduleName}
        style={{
          position: "absolute",
          width: CARD_ICON_WIDTH,
          height: CARD_ICON_HEIGHT,
          top: 24,
        }}
      />

      <img
        src={"assets/Modules/UI_RuneSlot_Tier.png"}
        alt={card.moduleName}
        style={{
          position: "absolute",
          width: 74,
          height: 74,
          top: 24,
          filter: moduleTier,
        }}
      />

      <p style={{ position: "absolute", top: 164, color: "lightgrey", fontFamily: "NotoSans", fontSize: 14 }}>{card.moduleType}</p>
    </>
  );
};
