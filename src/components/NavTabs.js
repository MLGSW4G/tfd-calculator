// src/components/NavTabs.js
import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link, useLocation } from "react-router-dom";
import { LocalizationContext } from "../components/LocalizationContext";
import { getTranslation } from "../translations";
import "../styles/NavTabs.css";

// Define the navigation links
const navigationLinks = [
  { label: "overview", path: "/overview" },
  { label: "skillsList", path: "/skillsList" },
  { label: "descendantsList", path: "/descendantsList" },
  { label: "modules", path: "/modules" },
  { label: "settings", path: "/settings" },
];

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
  const location = useLocation();
  const [currentPageIndex, setCurrentPageIndex] = useState(() => {
    if (location.pathname === "/") {
      return navigationLinks.findIndex((link) => link.path === "/overview");
    }
    return navigationLinks.findIndex((link) => link.path === location.pathname);
  });

  const handleChange = (event, newValue) => {
    // event.type can be equal to focus with selectionFollowsFocus.
    if (event.type !== "click" || (event.type === "click" && samePageLinkNavigation(event))) {
      setCurrentPageIndex(newValue);
    }
  };

  return (
    <Box className="nav-tabs">
      <Tabs value={currentPageIndex} onChange={handleChange} role="navigation" variant="fullWidth">
        {navigationLinks.map((link, index) => (
          <LinkTab key={index} label={translations[link.label]} to={link.path} />
        ))}
      </Tabs>
    </Box>
  );
};

export default NavTabs;
