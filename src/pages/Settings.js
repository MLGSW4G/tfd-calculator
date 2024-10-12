// src/pages/Settings.js
import { useContext } from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { LocalizationContext } from "../components/LocalizationContext";
import { Grid, Typography } from "@mui/material";
import { getTranslation } from "../translations";
import "../styles/styles.css";

const Settings = () => {
  const { language, switchLanguage } = useContext(LocalizationContext);
  const translations = getTranslation(language, "settings");

  return (
    <div style={{ position: "relative", marginTop: "3%", left: "10%", width: "80%" }}>
      <Grid container>
        <Grid item xs={12}>
          <Typography id="language-label">{translations.language}</Typography>
          <LanguageSwitcher />
        </Grid>
        <Grid item xs={12}>
          <button
            className="button"
            style={{ width: 200, height: 100, fontSize: 18 }}
            onClick={() => {
              if (window.confirm(translations.clearCacheConfirm)) {
                localStorage.clear();
                switchLanguage("en");
                window.alert(translations.clearCacheAlert);
              }
            }}
          >
            {translations.clearCache}
          </button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
