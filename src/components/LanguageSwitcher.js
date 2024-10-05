// src/components/LanguageSwitcher.js
import React, { useContext, useState, useEffect } from 'react';
import { LocalizationContext } from './LocalizationContext';
import { Select, MenuItem, FormControl, Typography } from '@mui/material';

const LanguageSwitcher = () => {
  const { language, switchLanguage } = useContext(LocalizationContext);
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    import(`../locales/${language}.json`).then((data) => {
      setTranslations(data.default);
    });
  }, [language]);

  const handleLanguageChange = (event) => {
    switchLanguage(event.target.value);
  };

  return (
    <FormControl sx={{ width: 150 }}>
      <Select
        labelId="language-label"
        value={language}
        onChange={handleLanguageChange}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="ru">Русский</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;