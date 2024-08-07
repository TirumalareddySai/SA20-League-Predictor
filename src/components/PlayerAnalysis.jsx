import React, { useState } from 'react';
import './PlayerAnalysis.css'; // Import the CSS file

function PlayerAnalysis({ playersData }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleSelectPlayer = (playerId) => {
    const player = playersData.find(p => p.Rank === Number(playerId));
    setSelectedPlayer(player);
  };

  // Filter top 5 batters and bowlers
  const topBatters = playersData
    .sort((a, b) => b['Batting MVP'] - a['Batting MVP'])
    .slice(0, 5);

  const topBowlers = playersData
    .sort((a, b) => b['Bowling MVP'] - a['Bowling MVP'])
    .slice(0, 5);

  return (
    <div className="container">
      {/* Top Performers Side */}
      <div className="top-performers">
        <div>
          <h3 className='font-bold'>Top 5 Batters</h3>
          <ul>
            {topBatters.map(player => (
              <li key={player.Rank}>
                <img src={player['Photo URL']} alt={player.Player} className="top-photo" />
                {player.Player} ({player.Team}) - {player['Batting MVP']}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className='font-bold'>Top 5 Bowlers</h3>
          <ul>
            {topBowlers.map(player => (
              <li key={player.Rank}>
                <img src={player['Photo URL']} alt={player.Player} className="top-photo" />
                {player.Player} ({player.Team}) - {player['Bowling MVP']}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Player Selection Side */}
      <div className="player-selection">
        <h2 className='font-semibold'>Select Player</h2>
        <select onChange={(e) => handleSelectPlayer(e.target.value)}>
          <option value="">Select Player</option>
          {playersData.map(player => (
            <option key={player.Rank} value={player.Rank}>
              {player.Player} ({player.Team})
            </option>
          ))}
        </select>
        {selectedPlayer && (
          <div className="player-details">
            <img src={selectedPlayer['Photo URL']} alt={selectedPlayer.Player} className="player-photo" />
            <h3 className='text-2xl'>{selectedPlayer.Player}</h3>
            <p className='text-xl'><span className='font-semibold'>Team: </span> {selectedPlayer.Team}</p>
            <p><span className='font-semibold'>Batting MVP: </span> {selectedPlayer['Batting MVP']}</p>
            <p><span className='font-semibold'>Bowling MVP: </span>{selectedPlayer['Bowling MVP']}</p>
            <p><span className='font-semibold'>Fielding MVP: </span> {selectedPlayer['Fielding MVP']}</p>
            <p><span className='font-semibold'>Total MVP: </span>{selectedPlayer['Total MVP']}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerAnalysis;
