import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LiveAnalysis from './components/LiveAnalysis';
import TeamAnalysis from './components/TeamAnalysis';
import PlayerAnalysis from './components/PlayerAnalysis';
import playersData from './data/players.json';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<LiveAnalysis playersData={playersData} />} />
          <Route path="/team-analysis" element={<TeamAnalysis playersData={playersData} />} />
          <Route path="/player-analysis" element={<PlayerAnalysis playersData={playersData} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
