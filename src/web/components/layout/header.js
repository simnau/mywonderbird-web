import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import { ResponsiveContainer } from '../container';
import Link from '../link';

const HeaderContainer = styled.div`
  height: 64px;
  width: 100%;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1000;
`;

function isActive(path, location, exact = false) {
  if (exact) {
    return path === location;
  } else {
    return location.startsWith(path);
  }
}

function Header() {
  const location = useLocation();

  return (
    <HeaderContainer>
      <ResponsiveContainer>
        <Link isActive={isActive('/', location.pathname, true)} to="/">
          Home
        </Link>
        <Link
          isActive={isActive('/journeys', location.pathname)}
          to="/journeys"
        >
          Journeys
        </Link>
      </ResponsiveContainer>
    </HeaderContainer>
  );
}

export default Header;
