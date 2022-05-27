import React, { Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Landing from './routes/Landing';
import NotFound from './routes/NotFound';
import Matchup from './routes/Matchup';
import Game from './routes/Game';

import './App.scss';

const App: React.FC = () => {

  return (
    <Fragment>
      <Switch>
        <Route exact path='/' component={ Landing }/>
        <Route path='/matchup' component={ Matchup }/>
        <Route path='/game' component={ Game }/>
        <Redirect to='/'/>
      </Switch>
    </Fragment>
  );
};

export default App;