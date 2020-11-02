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
import EditUser from './users/edit';
import UserJourneys from './users/journeys';
import CreateEditUserJourney from './users/journeys/create-edit';
import Other from './other';
import TutorialSteps from './other/tutorial-steps';
import CreateTutorialStep from './other/tutorial-steps/create';
import EditTutorialStep from './other/tutorial-steps/edit';
import Terms from './other/terms';
import CreateTerms from './other/terms/create';

function Admin() {
  return (
    <>
      <Header />
      <Switch>
        <Route exact path="/admin/dashboard" component={Home} />
        <Route exact path="/admin/other" component={Other} />
        <Route
          exact
          path="/admin/other/tutorial-steps"
          component={TutorialSteps}
        />
        <Route
          exact
          path="/admin/other/tutorial-steps/create"
          component={CreateTutorialStep}
        />
        <Route
          exact
          path="/admin/other/tutorial-steps/edit/:id"
          component={EditTutorialStep}
        />
        <Route exact path="/admin/other/terms" component={Terms} />
        <Route exact path="/admin/other/terms/create" component={CreateTerms} />
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
        <Route exact path="/admin/users/:userId" component={EditUser} />
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
