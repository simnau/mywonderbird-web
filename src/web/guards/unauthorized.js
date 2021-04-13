import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { AUTHENTICATION_STATUSES } from '../constants/auth';
import AuthContext from '../contexts/auth';

function unauthorized(Component) {
  const UnauthorizedGuard = props => {
    const { authenticationStatus } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
      if (authenticationStatus === AUTHENTICATION_STATUSES.AUTHENTICATED) {
        return history.replace('/admin/dashboard');
      }
    }, [authenticationStatus]);

    return <Component {...props} />;
  };

  return observer(UnauthorizedGuard);
}

export default unauthorized;
