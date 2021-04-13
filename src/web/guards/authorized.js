import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { AUTHENTICATION_STATUSES } from '../constants/auth';
import AuthContext from '../contexts/auth';

function authorized(Component) {
  const AuthorizedGuard = props => {
    const { authenticationStatus } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
      if (authenticationStatus !== AUTHENTICATION_STATUSES.AUTHENTICATED) {
        return history.replace('/auth.login');
      }
    }, [authenticationStatus]);

    return <Component {...props} />;
  };

  return observer(AuthorizedGuard);
}

export default authorized;
