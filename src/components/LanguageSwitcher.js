// src/components/LanguageSwitcher.js
import React, { useContext, useState, useEffect } from "react";
import { LocalizationContext } from "./LocalizationContext";
import { Select, MenuItem, FormControl } from "@mui/material";

const LanguageSwitcher = () => {
  const { language, updateLanguage: contextUpdateLanguage, decimalSeparator, thousandsSeparator, updateDecimalSeparator, updateThousandsSeparator } = useContext(LocalizationContext);
  const [translations, setTranslations] = useState(new Map());

  useEffect(() => {
    import(`../locales/${language}.json`).then((data) => {
      setTranslations((prevTranslations) => {
        prevTranslations.set(language, data.default);
        return prevTranslations;
      });
    });
  }, [language]);

  const handleLanguageChange = (event) => {
    contextUpdateLanguage(event.target.value);
  };

  return (
    <FormControl sx={{ width: 150 }}>
      <Select labelId="language-label" value={language} onChange={handleLanguageChange} style={{ minWidth: 200 }}>
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="ru">Русский</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
