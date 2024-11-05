// src/pages/Settings.js
import { useState, useContext } from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { LocalizationContext } from "../components/LocalizationContext";
import { Grid, Typography, Select, MenuItem, FormControl, InputLabel, TextField, Snackbar } from "@mui/material";
import { getTranslation } from "../translations";
import "../styles/styles.css";

const Settings = () => {
  const { language, switchLanguage } = useContext(LocalizationContext);
  const translations = getTranslation(language, "settings");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleClearCache = () => {
    localStorage.clear();
    switchLanguage("en");
    setSnackbarMessage(translations.clearCacheAlert);
    setSnackbarOpen(true);
  };

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
              handleClearCache();
            }}
          >
            {translations.clearCache}
          </button>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default Settings;
