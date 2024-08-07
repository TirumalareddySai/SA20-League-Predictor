import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className='bg-gradient-to-r from-lime-400 to-lime-500'>
      <h1 className='text-2xl font-bold bg-gradient-to-r from-lime-400 to-lime-500 rounded ml-5 p-1 text-black'>
        SA20 League Predictor
      </h1>
      <nav>
        <div className='nav-bar'>
          <Link className='text-white pt-2 pb-2 pl-2 pr-2 bg-red-500 rounded no-underline hover:bg-slate-950' to="/">Live Analysis</Link>
          <Link className='text-white p-2 pl-2 pr-2 bg-red-500 rounded no-underline hover:bg-slate-950' to="/team-analysis">Team Analysis</Link>
          <Link className='text-white p-2 pl-2 pr-2 bg-red-500 rounded no-underline hover:bg-slate-950' to="/player-analysis">Player Analysis</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
