// src/components/LanguageSwitcher.js
import React, { useContext, useState, useEffect } from "react";
import { LocalizationContext } from "./LocalizationContext";
import { Select, MenuItem } from "@mui/material";

const LanguageSwitcher = () => {
  const { language, updateLanguage } = useContext(LocalizationContext);
  const [, setTranslations] = useState(new Map());

  useEffect(() => {
    import(`../locales/${language}.json`).then((data) => {
      setTranslations((prevTranslations) => {
        prevTranslations.set(language, data.default);
        return prevTranslations;
      });
    });
  }, [language]);

  return (
    <Select
      labelId="language-label"
      value={language}
      onChange={(event) => {
        updateLanguage(event.target.value);
      }}
      style={{ minWidth: 200 }}
    >
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="ru">Русский</MenuItem>
    </Select>
  );
};

export default LanguageSwitcher;
