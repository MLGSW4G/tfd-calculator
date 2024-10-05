// components/NavTabs.js
import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link } from "react-router-dom";
import { LocalizationContext } from "../components/LocalizationContext";
import { getTranslation } from "../translations";

function samePageLinkNavigation(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 || // ignore everything but left-click
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  ) {
    return false;
  }
  return true;
}

function LinkTab(props) {
  return <Tab component={Link} to={props.href} aria-current={props.selected && "page"} {...props} />;
}

LinkTab.propTypes = {
  selected: PropTypes.bool,
};

const NavTabs = () => {
  const { language } = useContext(LocalizationContext);
  const translations = getTranslation(language, "navTabs");

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    // event.type can be equal to focus with selectionFollowsFocus.
    if (event.type !== "click" || (event.type === "click" && samePageLinkNavigation(event))) {
      setValue(newValue);
    }
  };

  return (
    <Box className="nav-tabs">
      <Tabs value={value} onChange={handleChange} role="navigation" variant="fullWidth">
        <LinkTab label={translations.overview} to="/overview" />
        <LinkTab label={translations.skillsList} to="/skillsList" />
        <LinkTab label={translations.descendantsList} to="/descendantsList" />
        <LinkTab label={translations.modules} to="/modules" />
        <LinkTab label={translations.settings} to="/settings" />
      </Tabs>
    </Box>
  );
};

export default NavTabs;
