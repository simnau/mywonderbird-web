import React, { useContext } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import { AUTHENTICATION_STATUSES } from '../../constants/auth';
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
  const { authenticationStatus, logout } = useContext(AuthContext);
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
        isActive={isActive('/admin/places', location.pathname)}
        to="/admin/places"
      >
        Places
      </Link>
      <Link
        isActive={isActive('/admin/tags', location.pathname)}
        to="/admin/tags"
      >
        Tags
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
      <Link
        isActive={isActive('/admin/other', location.pathname)}
        to="/admin/other"
      >
        Other
      </Link>
      {authenticationStatus === AUTHENTICATION_STATUSES.AUTHENTICATED && (
        <Button onClick={logout}>Logout</Button>
      )}
      {AUTHENTICATION_STATUSES === AUTHENTICATION_STATUSES.UNAUTHENTICATED && (
        <Link to="/admin/login">Login</Link>
      )}
    </HeaderContainer>
  );
}

export default observer(Header);
