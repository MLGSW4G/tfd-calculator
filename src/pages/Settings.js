import { useContext, useState } from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { LocalizationContext } from "../components/LocalizationContext";
import { Grid, Typography, Select, MenuItem, FormControl, InputLabel, TextField, Snackbar } from "@mui/material";
import { getTranslation } from "../translations";
import "../styles/styles.css";

const Settings = () => {
  const { language, updateLanguage, decimalSeparator, thousandsSeparator, updateDecimalSeparator, updateThousandsSeparator } = useContext(LocalizationContext);
  const translations = getTranslation(language, "settings");
  const translationsOverview = getTranslation(language, "overview");

  const separatorsLabels = {
    "": translationsOverview.none,
    " ": translations.whitespace,
    ".": translations.period,
    ",": translations.comma,
  };

  const formatNumber = (number) => {
    const parts = number.toString().split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    const decimalPart = parts.length > 1 ? decimalSeparator + parts[1] : "";
    return integerPart + decimalPart;
  };

  const sampleNumber = 1234567.89;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  return (
    <div style={{ position: "relative", marginTop: "3%", left: "10%", width: "80%" }}>
      <Grid container>
        <Grid item xs={12}>
          <Typography id="language-label">{translations.language}</Typography>
          <LanguageSwitcher />
        </Grid>

        <div style={{ fontSize: 24 }}>{translations.formatting}</div>
        <Grid container style={{ display: "flex", justifyContent: "space-between" }}>
          <Grid item xs={12}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="decimal-separator-label">{translations.decimalSeparator}</InputLabel>
              <Select labelId="decimal-separator-label" label={translations.decimalSeparator} value={decimalSeparator} onChange={(event) => updateDecimalSeparator(event.target.value)}>
                {[".", ","].map((sep) => (
                  <MenuItem key={sep} value={sep}>
                    {separatorsLabels[sep]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="thousands-separator-label">{translations.thousandsSeparator}</InputLabel>
              <Select labelId="thousands-separator-label" label={translations.thousandsSeparator} value={thousandsSeparator} onChange={(event) => updateThousandsSeparator(event.target.value)}>
                {["", " ", ",", "."].map((sep) => (
                  <MenuItem key={sep} value={sep}>
                    {separatorsLabels[sep]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField value={formatNumber(sampleNumber)} inputProps={{ style: { fontSize: 40 } }} />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <button
            className="button"
            style={{ width: 200, height: 100, fontSize: 18 }}
            onClick={() => {
              localStorage.clear();
              updateLanguage("en");
              setSnackbarMessage(translations.clearCacheAlert);
              setSnackbarOpen(true);
            }}
          >
            {translations.clearCache}
          </button>
        </Grid>
      </Grid>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
    </div>
  );
};

export default Settings;
