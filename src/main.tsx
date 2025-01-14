import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  MainMenu  from "./MainMenu"; 
import GamePlay from "./GamePlay"; 
import PathSelection from "./pathSelection";
import Leaderboards from "./Leaderboards";
import NameCreation from "./nameCreation";
import Trading from "./trading";
import './index.css';
import Practice from "./Practice";
import Settings from "./Settings";
import { MusicProvider } from "./MusicProvider";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator>
      <MusicProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainMenu />} /> {/* Route for main menu */}
            <Route path="/namecreation" element={<NameCreation />} /> {/* Route for name creation*/}
            <Route path="/pathselection/:defeatedBossCount" element={<PathSelection/>} /> {/* Route for path selection */}
            <Route path="/gameplay/:pathId/:defeatedBossCount" element={<GamePlay />} /> {/* Route for gameplay */}
            <Route path="/leaderboards"  element={<Leaderboards />} />  {/* Route for leaderboards*/}
            <Route path="/trading/:pathId/:defeatedBossCount" element={<Trading />} /> {/*Route for trading*/}
            <Route path="/practice" element={<Practice />} /> {/*Route for practice mode*/}
            <Route path="/settings" element={<Settings />} /> {/*Route to settings*/} 
          </Routes>
        </Router>
      </MusicProvider>
    </Authenticator>
  </React.StrictMode>
);
