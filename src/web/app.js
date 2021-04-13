import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';

import { ResponsiveContainer } from './components/container';
import AuthContext from './contexts/auth';
import { AUTHENTICATION_STATUSES } from './constants/auth';
import Admin from './pages/admin';
import Login from './pages/auth/login';

import hasRole from './guards/hasRole';
import unauthorized from './guards/unauthorized';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-toggle/style.css';
import InsufficientPermissions from './pages/error/insufficient-permissions';

const RootContainer = styled.div`
  margin: 0px 8px 0px 8px;

  * {
    box-sizing: border-box;
  }
`;

function App() {
  const { authenticationStatus } = useContext(AuthContext);

  if (authenticationStatus === AUTHENTICATION_STATUSES.UNKNOWN) {
    return <div>Loading... Please wait</div>;
  }

  return (
    <RootContainer>
      <ResponsiveContainer>
        <Switch>
          <Route exact path="/admin/login" component={unauthorized(Login)} />
          <Route
            exact
            path="/admin/insufficient-permissions"
            component={InsufficientPermissions}
          />
          <Route path="/admin/*" component={hasRole(Admin, 'ADMIN')} />
        </Switch>
      </ResponsiveContainer>
    </RootContainer>
  );
}

export default observer(App);
