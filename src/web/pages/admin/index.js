import React from 'react';
import { Switch, Route } from 'react-router-dom';

import authorized from '../../guards/authorized';

import Header from '../../components/layout/header';
import Home from './dashboard';
import Journeys from './journeys';
import CreateEditJourney from './journeys/create-edit';
import ViewJourney from './journeys/view';
import Users from './users';
import CreateUser from './users/create';
import UserJourneys from './users/journeys';
import CreateEditUserJourney from './users/journeys/create-edit';

function Admin() {
  return (
    <>
      <Header />
      <Switch>
        <Route exact path="/admin/dashboard" component={Home} />
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
        <Route exact path="/admin/users" component={Users} />
        <Route exact path="/admin/users/create" component={CreateUser} />
        <Route
          exact
          path="/admin/users/:userId/journeys"
          component={UserJourneys}
        />
        <Route
          exact
          path="/admin/users/:userId/journeys/create"
          component={CreateEditUserJourney}
        />
        <Route
          exact
          path="/admin/users/:userId/journeys/:journeyId/edit"
          component={CreateEditUserJourney}
        />
      </Switch>
    </>
  );
}

export default Admin;
