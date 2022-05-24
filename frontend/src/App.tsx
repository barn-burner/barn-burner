import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import Landing from './routes/Landing';
import NotFound from './routes/NotFound';

import './App.scss';

const App: React.FC = () => {

  return (
    <Fragment>
      <Switch>
        <Route exact path='/' component={ Landing }/>
        <Route component={ NotFound } />
      </Switch>
    </Fragment>
  );
};

export default App;