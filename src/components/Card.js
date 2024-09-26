// components/Card.js
import React from "react";
import { CARD_WIDTH, CARD_HEIGHT } from "../const";
import { CardIcon } from "./CardIcon";

export const Card = ({ card, onDragStart }) => {
  return (
    <div
      className="card"
      style={{
        position: "relative",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundImage: `url('assets/Modules/UI_RuneSlot_Bg.png')`,
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      draggable={card !== null && card !== undefined}
      onDragStart={(e) => onDragStart(e, card)}
    >
      <CardIcon card={card} />
      <p style={{
    position: "absolute",
    fontSize: 16,
    fontFamily: "NotoSans",
    color: "white",
    top: 100,
    width: CARD_WIDTH - 30,
    textAlign: "center",
    lineHeight: 'normal', // or set a specific height like '24px'
    height: '40px', // Adjust as necessary for your design
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}}>
    {card.moduleName}
</p>
    </div>
  );
};
