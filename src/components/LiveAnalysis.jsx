import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import playersData from '../data/players.json';

ChartJS.register(ArcElement, Tooltip, Legend);

function predictWinProbability(battingTeam, bowlingTeam, target, runs, wickets, overs, battersOut, bowlers) {
  const remainingBattingStrength = calculateRemainingBattingStrength(battingTeam, battersOut);
  const remainingBowlingStrength = calculateRemainingBowlingStrength(bowlingTeam, bowlers);
  const runsNeeded = target - runs;
  const oversRemaining = 20 - overs;

  let probability = 50 + (remainingBattingStrength - remainingBowlingStrength) * 0.1
                     - (runsNeeded / oversRemaining) * 2
                     - wickets * 5;
  
  return Math.max(0, Math.min(100, probability));
}

function calculateRemainingBattingStrength(team, battersOut) {
  // Placeholder logic - replace with actual MVP-based calculation
  return 50 - battersOut.length * 5;
}

function calculateRemainingBowlingStrength(team, bowlers) {
  // Placeholder logic - replace with actual MVP-based calculation
  return 50 - Object.values(bowlers).reduce((sum, overs) => sum + overs, 0) * 2;
}

function LiveAnalysis() {
  const [battingTeam, setBattingTeam] = useState('');
  const [bowlingTeam, setBowlingTeam] = useState('');
  const [battingXI, setBattingXI] = useState([]);
  const [bowlingXI, setBowlingXI] = useState([]);
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [target, setTarget] = useState(0);
  const [overs, setOvers] = useState(0);
  const [battersOut, setBattersOut] = useState([]);
  const [bowlers, setBowlers] = useState([]);
  const [winProbability, setWinProbability] = useState(null);

  const teams = [...new Set(playersData.map(player => player.Team))];

  useEffect(() => {
    if (battingTeam) {
      setBattingXI(playersData.filter(player => player.Team === battingTeam).slice(0, 11));
    }
  }, [battingTeam]);

  useEffect(() => {
    if (bowlingTeam) {
      setBowlingXI(playersData.filter(player => player.Team === bowlingTeam).slice(0, 11));
    }
  }, [bowlingTeam]);

  const handleBatterOut = (index, value) => {
    const newBattersOut = [...battersOut];
    newBattersOut[index] = value;
    setBattersOut(newBattersOut);
    setWickets(newBattersOut.filter(Boolean).length);
  };

  const handleBowlerChange = (index, field, value) => {
    const newBowlers = [...bowlers];
    newBowlers[index] = { ...newBowlers[index], [field]: value };
    setBowlers(newBowlers);
  };

  const handleAnalyze = () => {
    if (!battingTeam || !bowlingTeam || !target || !runs || !overs) {
      alert("Please fill in all required fields");
      return;
    }

    const probability = predictWinProbability(
      battingTeam,
      bowlingTeam,
      target,
      runs,
      wickets,
      overs,
      battersOut.filter(Boolean),
      bowlers.reduce((acc, bowler) => {
        if (bowler.selected) {
          acc[bowler.name] = bowler.overs;
        }
        return acc;
      }, {})
    );

    setWinProbability(probability);
  };

  const chartData = {
    labels: ['Win', 'Lose'],
    datasets: [
      {
        data: [winProbability, 100 - winProbability],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.toFixed(2)}%`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-5">
      <h2 className="text-2xl font-bold mb-4 text-center">Live Analysis</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <select 
          className="p-2 border rounded"
          value={battingTeam} 
          onChange={(e) => setBattingTeam(e.target.value)}
        >
          <option value="">Select Batting Team</option>
          {teams.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
        <select 
          className="p-2 border rounded"
          value={bowlingTeam} 
          onChange={(e) => setBowlingTeam(e.target.value)}
        >
          <option value="">Select Bowling Team</option>
          {teams.filter(team => team !== battingTeam).map(team => <option key={team} value={team}>{team}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Batting XI</h3>
          {battingXI.map((player, index) => (
            <div key={index} className="mb-2">
              <select className="w-full p-2 border rounded">
                <option value="">{player.Player}</option>
              </select>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Bowling XI</h3>
          {bowlingXI.map((player, index) => (
            <div key={index} className="mb-2">
              <select className="w-full p-2 border rounded">
                <option value="">{player.Player}</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-1">Runs</label>
          <input 
            type="number" 
            className="w-full p-2 border rounded" 
            value={runs} 
            onChange={(e) => setRuns(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block mb-1">Wickets</label>
          <input 
            type="number" 
            className="w-full p-2 border rounded" 
            value={wickets} 
            readOnly
          />
        </div>
        <div>
          <label className="block mb-1">Target</label>
          <input 
            type="number" 
            className="w-full p-2 border rounded" 
            value={target} 
            onChange={(e) => setTarget(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block mb-1">Overs</label>
          <input 
            type="number" 
            className="w-full p-2 border rounded" 
            value={overs} 
            onChange={(e) => setOvers(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Batters Out</h3>
          {battingXI.map((player, index) => (
            <div key={index} className="mb-2 flex items-center">
              <input 
                type="checkbox" 
                id={`batter-${index}`}
                checked={battersOut[index]}
                onChange={(e) => handleBatterOut(index, e.target.checked)}
                className="mr-2"
              />
              <label htmlFor={`batter-${index}`}>{player.Player}</label>
            </div>
          ))}
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">Bowlers</h3>
          {bowlingXI.map((player, index) => (
            <div key={index} className="mb-2 flex items-center">
              <input 
                type="checkbox" 
                id={`bowler-${index}`}
                checked={bowlers[index]?.selected}
                onChange={(e) => handleBowlerChange(index, 'selected', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor={`bowler-${index}`} className="mr-2">{player.Player}</label>
              {bowlers[index]?.selected && (
                <input 
                  type="number" 
                  className="w-20 p-2 border rounded" 
                  value={bowlers[index]?.overs || ''}
                  onChange={(e) => handleBowlerChange(index, 'overs', Number(e.target.value))}
                  placeholder="Overs"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <button 
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 mb-4"
        onClick={handleAnalyze}
      >
        Analyze
      </button>

      {winProbability !== null && (
        <div className="mb-4 text-center">
          <h3 className="text-xl font-semibold mb-2">Win Probability</h3>
          <div style={{ width: '200px', height: '200px', margin: '0 auto', position: 'relative' }}>
            <Pie data={chartData} options={chartOptions} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
              {winProbability.toFixed(2)}%
            </div>
          </div>
          <p className="mt-2">
            {battingTeam} has a {winProbability.toFixed(2)}% chance of winning.
          </p>
        </div>
      )}
    </div>
  );
}

export default LiveAnalysis;