import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import * as colors from '../constants/colors';

const LinkContainer = styled.div`
  display: inline;
  padding: 16px;
  margin-left: 8px;
  margin-right: 8px;
  border-bottom: 2px solid
    ${props => (props.isActive ? colors.primary : 'gray')};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  text-transform: uppercase;
  color: gray;
`;

function CustomLink({ isActive, ...props }) {
  return (
    <LinkContainer isActive={isActive}>
      <StyledLink {...props} />
    </LinkContainer>
  );
}

export default CustomLink;
