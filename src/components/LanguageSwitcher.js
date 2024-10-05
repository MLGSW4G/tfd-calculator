// src/components/LanguageSwitcher.js
import React, { useContext } from 'react';
import { LocalizationContext } from './LocalizationContext';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const LanguageSwitcher = () => {
  const { language, switchLanguage } = useContext(LocalizationContext);

  const handleLanguageChange = (event) => {
    switchLanguage(event.target.value);
  };

  return (
    <FormControl sx={{ width: 150 }}>
      <InputLabel id="language-label">Language</InputLabel>
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