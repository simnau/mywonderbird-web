import React from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import Home from './pages';
import Journeys from './pages/journeys';
import CreateEditJourney from './pages/journeys/create-edit';
import ViewJourney from './pages/journeys/view';
import { ResponsiveContainer } from './components/container';
import Header from './components/layout/header';

const RootContainer = styled.div`
  margin: 0px 8px 64px 8px;
`;

export default function App() {
  return (
    <RootContainer>
      <Header />
      <ResponsiveContainer>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/journeys/create" component={CreateEditJourney} />
          <Route exact path="/journeys/:id" component={ViewJourney} />
          <Route
            exact
            path="/journeys/:id/edit"
            component={CreateEditJourney}
          />
          <Route exact path="/journeys" component={Journeys} />
        </Switch>
      </ResponsiveContainer>
    </RootContainer>
  );
}
