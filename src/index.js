import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom"; // Import Router here
import App from './App';
import './styles/styles.css'; // Adjust path according to your styles location

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
