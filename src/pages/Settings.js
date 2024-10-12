// src/pages/Settings.js
import { useContext } from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { LocalizationContext } from "../components/LocalizationContext";
import { Grid, Typography } from "@mui/material";
import { getTranslation } from "../translations";

const Settings = () => {
  const { language } = useContext(LocalizationContext);
  const translations = getTranslation(language, "settings");

  return (
    <div style={{ position: "relative", marginTop: "3%", left: "10%", width: "80%" }}>
      <Grid container>
        <Grid item>
          <Typography id="language-label">{translations.language}</Typography>
          <LanguageSwitcher />
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
