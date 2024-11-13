import { useContext, useState, useEffect } from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { LocalizationContext } from "../components/LocalizationContext";
import { Grid, Typography, Select, MenuItem, FormControl, InputLabel, TextField, Snackbar, Tooltip } from "@mui/material";
import { getTranslation } from "../translations";
import "../styles/styles.css";
import { PAGE_TITLE_FORMAT } from "../const";
import { Helmet } from "react-helmet";

const Settings = () => {
  const { language, updateLanguage, decimalSeparator, thousandsSeparator, updateDecimalSeparator, updateThousandsSeparator } = useContext(LocalizationContext);
  const translations = getTranslation(language, "settings");
  const translationsOverview = getTranslation(language, "overview");

  const [pageTitleFormat, setPageTitleFormat] = useState(localStorage.getItem("pageTitleFormat") || PAGE_TITLE_FORMAT);
  const [pageTitle, setPageTitle] = useState(pageTitleFormat.replaceAll("{name}", getTranslation(language, "navTabs").settings));

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

  useEffect(() => {
    const newTitle = pageTitleFormat.replaceAll("{name}", getTranslation(language, "navTabs").settings);
    setPageTitle(newTitle);
    localStorage.setItem("pageTitleFormat", pageTitleFormat);
  }, [pageTitleFormat, language]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div style={{ position: "relative", marginTop: "3%", left: "10%", width: "80%" }}>
        <Grid item xs={12}>
          <Typography variant="h5" id="language-label">
            {translations.language}
          </Typography>
          <LanguageSwitcher />
        </Grid>

        <Typography variant="h5">{translations.numbersFormat}</Typography>
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

        <Typography variant="h5">{translations.pageTitleFormat}</Typography>
        <Grid item xs={12}>
          <Tooltip title={<Typography variant="body2">{translations.pageTitleFormatTooltip}</Typography>} disableHoverListener arrow placement="top">
            <TextField
              value={pageTitleFormat}
              onChange={(e) => {
                setPageTitleFormat(e.target.value);
              }}
            />
          </Tooltip>
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
              setPageTitleFormat(PAGE_TITLE_FORMAT);
            }}
          >
            {translations.clearCache}
          </button>
        </Grid>

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
      </div>
    </>
  );
};

export default Settings;
