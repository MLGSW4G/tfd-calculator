// components/CardSlot.js
import React from "react";
import { CARD_WIDTH, CARD_HEIGHT } from "../const";
import { Card } from "./Card";

export const CardSlot = ({ equippedCard, onDrop, index, onDragStart }) => {
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
      className="equipped-card-slot"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
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
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          backgroundImage: backgroundImage,
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
        }}
      ></div>
      {equippedCard ? (
        <Card card={equippedCard} onDragStart={onDragStart} />
      ) : (
        <div
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
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
