//modules.js
import { Box, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import "../styles/styles.css";

const CARD_WIDTH = 149;
const CARD_HEIGHT = 202;
const CARD_ICON_WIDTH = 72;
const CARD_ICON_HEIGHT = 72;

const Card = ({ card, onDragStart, cardType }) => {
  return (
    <div
      className="card"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundImage: `url('assets/Modules/UI_RuneSlot_Bg.png')`,
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      draggable={true}
      onDragStart={(e) => onDragStart(e, card, cardType)}
    >
      <img
        src={card.moduleIcon}
        alt={card.moduleName}
        style={{
          width: CARD_ICON_WIDTH,
          height: CARD_ICON_HEIGHT,
          marginTop: "15%",
        }}
      />
      <p style={{ fontSize: 15, fontFamily: "NotoSans", color: "white", marginTop: "20%" }}>{card.moduleName}</p>
    </div>
  );
};

const EquippedCardSlot = ({ equippedCard, onDrop, index, onDragStart }) => {
  let backgroundImage;
  // 1-th and 6-th slots are special
  if (index === 0) {
    backgroundImage = `url('assets/Modules/UI_RuneSlot_ChaBG02.png')`;
  } else if (index === 5) {
    backgroundImage = `url('assets/Modules/UI_RuneSlot_ChaBG01.png')`;
  } else {
    backgroundImage = `url('assets/Modules/UI_RuneSlot_EmptyBg.png')`;
  }

  return (
    <div
      className="equipped-card-slot"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundImage,
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, index)}
    >
      {equippedCard ? <Card card={equippedCard} onDragStart={onDragStart} /> : <p style={{ fontSize: 15, fontFamily: "NotoSans", color: "white", marginTop: "20%" }}>Empty Slot</p>}
    </div>
  );
};

const Modules = () => {
  const [cardList, setCardList] = useState([
    { id: 251001001, moduleName: "Ironclad Defense", moduleIcon: "assets/Modules/Icon_Rune/Icon_RunesIcon_RESCriticalChance.png" },
    { id: 251001002, moduleName: "Nimble Fingers", moduleIcon: "assets/Modules/Icon_Rune/Icon_RunesIcon_SkillCooltimeCoefficient.png" },
    { id: 251001003, moduleName: "Strong Mentality", moduleIcon: "assets/Modules/Icon_Rune/Icon_RunesIcon_SkillCostCoefficient.png" },
    { id: 251001004, moduleName: "Technician", moduleIcon: "assets/Modules/Icon_Rune/.png" },
    { id: 251001005, moduleName: "Heat Antibody", moduleIcon: "assets/Modules/Icon_Rune/Icon_RunesIcon_DEFBlazer.png" },
    { id: 251001006, moduleName: "Cold Antibody", moduleIcon: "assets/Modules/Icon_Rune/Icon_RunesIcon_DEFGlacier.png" },
    { id: 251001007, moduleName: "Electric Antibody", moduleIcon: "assets/Modules/Icon_Rune/Icon_RunesIcon_DEFElectiricity.png" },
    { id: 251001008, moduleName: "Regeneration Boost", moduleIcon: "assets/Modules/Icon_Rune/.png" },
    { id: 251001009, moduleName: "Increased HP", moduleIcon: "assets/Modules/Icon_Rune/Icon_RunesIcon_MaxHp.png" },
    { id: 2510010010, moduleName: "Increased Shield", moduleIcon: "assets/Modules/Icon_Rune/Icon_RunesIcon_MaxShield.png" },
    { id: 2510010011, moduleName: "Increased DEF", moduleIcon: "assets/Modules/Icon_Rune/Icon_RunesIcon_DEF.png" },
    { id: 2510010012, moduleName: "Skill Expansion", moduleIcon: "assets/Modules/Icon_Rune/Icon_RunesIcon_Add_SkillDurationIncrease.png" },
    { id: 2510010013, moduleName: "Skill Extension", moduleIcon: "assets/Modules/Icon_Rune/.png" },
    { id: 2510010014, moduleName: "Toxic Antibody", moduleIcon: "assets/Modules/Icon_Rune/Icon_RunesIcon_DEFDemonic.png" },
  ]);

  const [equippedCards, setEquippedCards] = useState([
    { id: 1, moduleName: "" },
    { id: 2, moduleName: "" },
    { id: 3, moduleName: "" },
    { id: 4, moduleName: "" },
    { id: 5, moduleName: "" },
    { id: 6, moduleName: "" },
    { id: 7, moduleName: "" },
    { id: 8, moduleName: "" },
    { id: 9, moduleName: "" },
    { id: 10, moduleName: "" },
  ]);

  const [height, setHeight] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [initialHeight, setInitialHeight] = useState(height);

  const minHeight = 200;
  const maxHeight = 600;

  // Event handlers for resizing
  const handleMouseDown = (e) => {
    setIsResizing(true);
    setStartY(e.clientY);
    setInitialHeight(height);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const newHeight = Math.max(initialHeight + (startY - e.clientY), minHeight);
    setHeight(Math.min(newHeight, maxHeight));
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("card", JSON.stringify(card));
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const card = JSON.parse(e.dataTransfer.getData("card"));
    const newEquippedCards = [...equippedCards];
    newEquippedCards[index] = card;
    setEquippedCards(newEquippedCards);
    setCardList(cardList.filter((c) => c.id !== card.id));
  };

  return (
    <>
      <Box className="equippedCards" marginLeft="10%" marginRight="10%">
        <Grid container style={{ display: "flex", alignItems: "flex-start" }}>
          <Grid
            container
            item
            style={{
              marginRight: "15%",
              flex: 1,
            }}
          >
            {equippedCards.map((equippedCard, index) => (
              <Grid item margin={"40px"} marginBottom={"0px"} key={equippedCard.id}>
                <EquippedCardSlot equippedCard={equippedCard} onDrop={(e) => handleDrop(e, index)} index={index} onDragStart={handleDragStart} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>

      <Box
        className="cardZone"
        width="100%"
        height={height}
        sx={{
          background: "grey",
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 1000,
          overflow: "auto",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const cardData = e.dataTransfer.getData("card");
          if (cardData) {
            const card = JSON.parse(cardData);
            setCardList([...cardList, card]);
            setEquippedCards(equippedCards.map((c) => (c.id === card.id ? { id: c.id, moduleName: "" } : c)));
          }
        }}
      >
        <Grid container justifyContent="left" alignItems="center">
          {cardList.map((card) => (
            <Grid item key={card.id} margin={1}>
              <Card card={card} onDragStart={handleDragStart} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Modules;
