import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from '../../contexts/auth';
import { Button } from '../../components/button';

function InsufficientPermissions() {
  const { logout } = useContext(AuthContext);
  const history = useHistory();

  const relogin = async () => {
    await logout();
    history.push('/admin/login');
  };

  return (
    <div>
      <div>You do not have the appropriate permissions to view the page</div>
      <Button onClick={relogin}>Login with a different account</Button>
    </div>
  );
}

export default InsufficientPermissions;
