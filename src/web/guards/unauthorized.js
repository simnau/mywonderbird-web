import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import AuthContext from '../contexts/auth';

function unauthorized(Component) {
  const UnauthorizedGuard = props => {
    const { isAuthenticated } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
      if (isAuthenticated) {
        return history.replace('/admin/dashboard');
      }
    }, [isAuthenticated]);

    return <Component {...props} />;
  };

  return observer(UnauthorizedGuard);
}

export default unauthorized;
