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

export default function Dashboard() {
  return (
    <div>
      <H3>Dashboard</H3>
      <MainContainer>
        <ItemContainer>
          <SectionHeading>Places</SectionHeading>
          <Button variant="primary" as={Link} to="/admin/places">
            View
          </Button>
        </ItemContainer>
        <ItemContainer>
          <SectionHeading>Tags</SectionHeading>
          <Button variant="primary" as={Link} to="/admin/tags">
            View
          </Button>
        </ItemContainer>
        <ItemContainer>
          <SectionHeading>Journeys</SectionHeading>
          <Button variant="primary" as={Link} to="/admin/journeys">
            View
          </Button>
        </ItemContainer>
        <ItemContainer>
          <SectionHeading>Users</SectionHeading>
          <Button variant="primary" as={Link} to="/admin/users">
            View
          </Button>
        </ItemContainer>
        <ItemContainer>
          <SectionHeading>Other</SectionHeading>
          <Button variant="primary" as={Link} to="/admin/other">
            View
          </Button>
        </ItemContainer>
      </MainContainer>
    </div>
  );
}
