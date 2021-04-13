import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { AUTHENTICATION_STATUSES } from '../constants/auth';
import AuthContext from '../contexts/auth';

function hasRole(Component, expectedRole) {
  const HasRoleGuard = props => {
    const { authenticationStatus, role } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
      if (authenticationStatus !== AUTHENTICATION_STATUSES.AUTHENTICATED) {
        return history.replace('/admin/login');
      }

      if (role !== expectedRole) {
        return history.replace('/admin/insufficient-permissions');
      }
    }, [authenticationStatus, role]);

    return <Component {...props} />;
  };

  return observer(HasRoleGuard);
}

export default hasRole;
