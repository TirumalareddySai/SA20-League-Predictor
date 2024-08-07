import React from 'react';
import './PlayerDropdown.css';

const PlayerDropdown = ({ players, selectedPlayers, onSelect, team }) => {
  const handleSelect = (event) => {
    const player = event.target.value;
    onSelect(team, player);
  };

  return (
    <select className="player-dropdown" onChange={handleSelect} defaultValue="">
      <option value="" disabled>Select Player</option>
      {players
        .filter(player => !selectedPlayers.includes(player.Player))
        .map(player => (
          <option key={player.Player} value={player.Player}>
            {player.Player}
          </option>
      ))}
    </select>
  );
};

export default PlayerDropdown;
