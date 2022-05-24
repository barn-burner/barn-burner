import React from 'react';
import { Results, GameList } from '../components';

import './Matchup.scss';

const Matchup: React.FC = () => {

  return (
    <>
      <Results team1={1} team2={2}/>
      <GameList/>
    </>
  );
};

export default Matchup;
