import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import AuthContext from '../contexts/auth';

function hasRole(Component, expectedRole) {
  const HasRoleGuard = props => {
    const { isAuthenticated, role } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
      if (!isAuthenticated) {
        return history.replace('/admin/login');
      }

      if (role !== expectedRole) {
        return history.replace('/admin/insufficient-permissions');
      }
    }, [isAuthenticated, role]);

    return <Component {...props} />;
  };

  return observer(HasRoleGuard);
}

export default hasRole;
