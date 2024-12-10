import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  MainMenu  from "./MainMenu"; 
import GamePlay from "./GamePlay"; // Import your GamePlay component

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator>
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} /> {/* Route for main menu */}
          <Route path="/gameplay" element={<GamePlay />} /> {/* Route for gameplay */}
        </Routes>
      </Router>
    </Authenticator>
  </React.StrictMode>
);
