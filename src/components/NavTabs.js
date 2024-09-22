import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link } from "react-router-dom";
import "../styles/styles.css";

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

export default function NavTabs() {
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
        <LinkTab label="Build" href="/build"/>
        <LinkTab label="Skills List" href="/skillsList" />
        <LinkTab label="Modules" href="/modules" />
      </Tabs>
    </Box>
  );
}
