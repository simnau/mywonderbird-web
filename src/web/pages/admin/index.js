import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from '../../components/layout/header';
import Home from './home';
import Journeys from './journeys';
import CreateEditJourney from './journeys/create-edit';
import ViewJourney from './journeys/view';
import authorized from '../../guards/authorized';

function Admin() {
  return (
    <>
      <Header />
      <Switch>
        <Route exact path="/admin" component={Home} />
        <Route
          exact
          path="/admin/journeys/create"
          component={authorized(CreateEditJourney)}
        />
        <Route exact path="/admin/journeys/:id" component={ViewJourney} />
        <Route
          exact
          path="/admin/journeys/:id/edit"
          component={CreateEditJourney}
        />
        <Route exact path="/admin/journeys" component={Journeys} />
      </Switch>
    </>
  );
}

export default Admin;
