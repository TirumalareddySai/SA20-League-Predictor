import React, { useState } from 'react';
import './TeamAnalysis.css';
import PlayerDropdown from './PlayerDropdown';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import playersData from '../data/players.json';

ChartJS.register(ArcElement, Tooltip, Legend);

const TeamAnalysis = () => {
  const [players] = useState(playersData);
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);
  const [teamAStrength, setTeamAStrength] = useState({ batting: 0, bowling: 0 });
  const [teamBStrength, setTeamBStrength] = useState({ batting: 0, bowling: 0 });
  const [analysis, setAnalysis] = useState(null);

  const handleSelectPlayer = (team, player) => {
    if (team === 'A') {
      if (!teamAPlayers.includes(player) && !teamBPlayers.includes(player) && teamAPlayers.length < 11) {
        setTeamAPlayers([...teamAPlayers, player]);
      }
    } else if (team === 'B') {
      if (!teamBPlayers.includes(player) && !teamAPlayers.includes(player) && teamBPlayers.length < 11) {
        setTeamBPlayers([...teamBPlayers, player]);
      }
    }
  };

  const handleRemovePlayer = (team, player) => {
    if (team === 'A') {
      setTeamAPlayers(teamAPlayers.filter(p => p !== player));
    } else if (team === 'B') {
      setTeamBPlayers(teamBPlayers.filter(p => p !== player));
    }
  };

  const calculateStrength = (teamPlayers) => {
    let batting = 0;
    let bowling = 0;
    teamPlayers.forEach(playerName => {
      const player = players.find(p => p.Player === playerName);
      if (player) {
        batting += player["Batting MVP"] || 0;
        bowling += player["Bowling MVP"] || 0;
      }
    });
    return { batting, bowling };
  };

  const handleAnalyze = () => {
    const teamAStrength = calculateStrength(teamAPlayers);
    const teamBStrength = calculateStrength(teamBPlayers);
    setTeamAStrength(teamAStrength);
    setTeamBStrength(teamBStrength);

    if (teamAStrength.batting + teamAStrength.bowling > teamBStrength.batting + teamBStrength.bowling) {
      setAnalysis('Team A is likely to win!');
    } else if (teamAStrength.batting + teamAStrength.bowling < teamBStrength.batting + teamBStrength.bowling) {
      setAnalysis('Team B is likely to win!');
    } else {
      setAnalysis('It\'s a tie!');
    }
  };

  const getChartData = (teamA, teamB, label) => {
    return {
      labels: ['Team A', 'Team B'],
      datasets: [
        {
          data: [teamA[label.toLowerCase()], teamB[label.toLowerCase()]],
          backgroundColor: ['#3b82f6', '#ef4444'],
          hoverBackgroundColor: ['#2563eb', '#dc2626'],
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.parsed.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="team-analysis container mx-auto px-4 py-8">
      <h1 className='text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
        Team Analysis
      </h1>
      <div className="team-selection grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="team bg-white p-6 rounded-lg shadow-lg">
          <h2 className='text-2xl font-semibold mb-4'>Team A</h2>
          <PlayerDropdown players={players} selectedPlayers={teamBPlayers} onSelect={handleSelectPlayer} team="A" />
          <ul className="mt-4">
            {teamAPlayers.map((player, index) => {
              const playerData = players.find(p => p.Player === player);
              return (
                <li key={index} className="player-item flex items-center justify-between mb-2">
                  <span className="player-number">{index + 1}.</span>
                  {playerData && <img src={playerData['Photo URL']} alt={player} className="player-photo-team w-10 h-10 rounded-full" />}
                  <span className="player-name">{player}</span>
                  <button onClick={() => handleRemovePlayer('A', player)} className="text-red-500">Remove</button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="team bg-white p-6 rounded-lg shadow-lg">
          <h2 className='text-2xl font-semibold mb-4'>Team B</h2>
          <PlayerDropdown players={players} selectedPlayers={teamAPlayers} onSelect={handleSelectPlayer} team="B" />
          <ul className="mt-4">
            {teamBPlayers.map((player, index) => {
              const playerData = players.find(p => p.Player === player);
              return (
                <li key={index} className="player-item flex items-center justify-between mb-2">
                  <span className="player-number">{index + 1}.</span>
                  {playerData && <img src={playerData['Photo URL']} alt={player} className="player-photo-team w-10 h-10 rounded-full" />}
                  <span className="player-name">{player}</span>
                  <button onClick={() => handleRemovePlayer('B', player)} className="text-red-500">Remove</button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <button 
        onClick={handleAnalyze} 
        disabled={teamAPlayers.length < 11 || teamBPlayers.length < 11} 
        className="analyze-button w-full py-3 px-6 mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition duration-300 disabled:opacity-50"
      >
        Analyze Teams
      </button>

      {analysis && (
        <div className="analysis-results mt-12 bg-white rounded-lg shadow-xl p-8">
          <h2 className='text-3xl font-bold mb-8 text-center text-gray-800'>Analysis Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="team-strength p-6 bg-blue-50 rounded-lg shadow">
              <h3 className="text-2xl font-semibold mb-4 text-blue-700">Team A Strength</h3>
              <p className="text-lg"><strong>Batting:</strong> {teamAStrength.batting.toFixed(2)}</p>
              <p className="text-lg"><strong>Bowling:</strong> {teamAStrength.bowling.toFixed(2)}</p>
            </div>
            <div className="team-strength p-6 bg-red-50 rounded-lg shadow">
              <h3 className="text-2xl font-semibold mb-4 text-red-700">Team B Strength</h3>
              <p className="text-lg"><strong>Batting:</strong> {teamBStrength.batting.toFixed(2)}</p>
              <p className="text-lg"><strong>Bowling:</strong> {teamBStrength.bowling.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="chart-container bg-gray-50 p-6 rounded-lg shadow" style={{ height: '300px' }}>
              <h4 className="text-xl font-semibold mb-4 text-gray-700">Batting Strength Comparison</h4>
              <Pie data={getChartData(teamAStrength, teamBStrength, 'Batting')} options={chartOptions} />
            </div>
            <div className="chart-container bg-gray-50 p-6 rounded-lg shadow" style={{ height: '300px' }}>
              <h4 className="text-xl font-semibold mb-4 text-gray-700">Bowling Strength Comparison</h4>
              <Pie data={getChartData(teamAStrength, teamBStrength, 'Bowling')} options={chartOptions} />
            </div>
          </div>

          <div className="result mt-8">
            <h3 className="text-2xl font-bold text-center text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {analysis}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamAnalysis;