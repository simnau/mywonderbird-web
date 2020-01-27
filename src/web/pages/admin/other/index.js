import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '../../../components/button';
import { H3 } from '../../../components/typography';

const MainContainer = styled.div`
  display: grid;
  grid-row-gap: 8px;

  > *:not(:last-child) {
    border-bottom: 1px solid lightgray;
  }
`;

const ItemContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 75px;
  padding: 8px;
`;

const SectionHeading = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

export default function Other() {
  return (
    <div>
      <H3>Other</H3>
      <MainContainer>
        <ItemContainer>
          <SectionHeading>Tutorial steps</SectionHeading>
          <Button variant="primary" as={Link} to="/admin/other/tutorial-steps">
            View
          </Button>
        </ItemContainer>
      </MainContainer>
    </div>
  );
}
