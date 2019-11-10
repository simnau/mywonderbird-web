import React, { useContext } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import AuthContext from '../../contexts/auth';
import Link from '../link';
import { Button } from '../button';
import { observer } from 'mobx-react-lite';

const HeaderContainer = styled.div`
  height: 64px;
  width: 100%;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
`;

function isActive(path, location, exact = false) {
  if (exact) {
    return path === location;
  } else {
    return location.startsWith(path);
  }
}

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <HeaderContainer>
      <Link
        isActive={isActive('/admin/dashboard', location.pathname)}
        to="/admin/dashboard"
      >
        Dashboard
      </Link>
      <Link
        isActive={isActive('/admin/journeys', location.pathname)}
        to="/admin/journeys"
      >
        Journeys
      </Link>
      <Link
        isActive={isActive('/admin/users', location.pathname)}
        to="/admin/users"
      >
        Users
      </Link>
      {isAuthenticated && <Button onClick={logout}>Logout</Button>}
      {!isAuthenticated && <Link to="/admin/login">Login</Link>}
    </HeaderContainer>
  );
}

export default observer(Header);
