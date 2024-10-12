// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./styles/styles.css";

ReactDOM.render(
  <Router basename="/tfd-calculator">
    <App />
  </Router>,
  document.getElementById("root")
);
