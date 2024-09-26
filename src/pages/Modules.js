// pages/Modules.js
import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import "../styles/styles.css";
import { Card } from "../components/Card";
import { CardSlot } from "../components/CardSlot";
import modulesData from "./Modules.json";

const Modules = () => {
  const [cardList, setCardList] = useState(modulesData);

  const [equippedCards, setEquippedCards] = useState([
    { id: 1, moduleName: null },
    { id: 2, moduleName: null },
    { id: 3, moduleName: null },
    { id: 4, moduleName: null },
    { id: 5, moduleName: null },
    { id: 6, moduleName: null },
    { id: 7, moduleName: null },
    { id: 8, moduleName: null },
    { id: 9, moduleName: null },
    { id: 10, moduleName: null },
  ]);

  const [height, setHeight] = useState(300);
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
                <CardSlot equippedCard={null} onDrop={(e) => handleDrop(e, index)} index={index} onDragStart={handleDragStart} />
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
            <Grid item key={card.id} padding={1.5} marginTop={2} marginBottom={1}>
              <Card card={card} onDragStart={handleDragStart} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Modules;
