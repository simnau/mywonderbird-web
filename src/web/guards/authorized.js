import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import AuthContext from '../contexts/auth';

function authorized(Component) {
  const AuthorizedGuard = props => {
    const { isAuthenticated } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
      if (!isAuthenticated) {
        return history.replace('/auth.login');
      }
    }, [isAuthenticated]);

    return <Component {...props} />;
  };

  return observer(AuthorizedGuard);
}

export default authorized;
