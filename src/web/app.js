import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import styled from 'styled-components';

import Home from './pages';
import Journeys from './pages/journeys';
import CreateJourney from './pages/journeys/create';
import ViewJourney from './pages/journeys/view';

const Header = styled.div`
  height: 64px;
  width: 100%;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1000;
`;

const ResponsiveContainer = styled.div`
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
`;

export default function App() {
  return (
    <div style={{ margin: '0px 8px 64px 8px' }}>
      <Header>
        <ResponsiveContainer>
          <Link to="/">Home</Link>
          <Link to="/journeys">Journeys</Link>
        </ResponsiveContainer>
      </Header>
      <ResponsiveContainer>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/journeys/create" component={CreateJourney} />
          <Route exact path="/journeys/:id" component={ViewJourney} />
          <Route exact path="/journeys" component={Journeys} />
        </Switch>
      </ResponsiveContainer>
    </div>
  );
}
