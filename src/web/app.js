import React from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import { ResponsiveContainer } from './components/container';
import Admin from './pages/admin';
import LandingPage from './pages/landing-page';
import Login from './pages/auth/login';

import hasRole from './guards/hasRole';
import unauthorized from './guards/unauthorized';

import 'react-datepicker/dist/react-datepicker.css';
import InsufficientPermissions from './pages/error/insufficient-permissions';

const RootContainer = styled.div`
  margin: 0px 8px 64px 8px;
`;

export default function App() {
  return (
      <RootContainer>
        <ResponsiveContainer>
          <Switch>
            <Route exact path="/admin/login" component={unauthorized(Login)} />
            <Route exact path="/admin/insufficient-permissions" component={InsufficientPermissions} />
            <Route path="/admin/*" component={hasRole(Admin, 'ADMIN')} />
          </Switch>
        </ResponsiveContainer>
      </RootContainer>
  );
}
