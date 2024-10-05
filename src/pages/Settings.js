// src/pages/Settings.js
import { useContext } from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { LocalizationContext } from "../components/LocalizationContext";
import { Typography } from "@mui/material";
import { getTranslation } from "../translations";

function Settings() {
  const { language } = useContext(LocalizationContext);
  const translations = getTranslation(language, "settings");

  return (
    <div style={{marginLeft: "5%"}}>
      <Typography id="language-label">{translations.language}</Typography>
      <LanguageSwitcher />;
    </div>
  );
}

export default Settings;
