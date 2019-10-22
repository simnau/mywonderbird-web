import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import Home from './pages';
import Journeys from './pages/journeys';
import CreateJourney from './pages/journeys/create';
import ViewJourney from './pages/journeys/view';

export default function App() {
  return (
    <div>
      <div>
        <Link to="/">Home</Link>
        <Link to="/journeys">Journeys</Link>
      </div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/journeys/create" component={CreateJourney} />
        <Route exact path="/journeys/:id" component={ViewJourney} />
        <Route exact path="/journeys" component={Journeys} />
      </Switch>
    </div>
  );
}
