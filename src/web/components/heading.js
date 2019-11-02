import styled, { css } from 'styled-components';

export const HeadingContainer = styled.div`
  margin-bottom: 8px;
  display: grid;
  grid-template-columns: 60px 1fr;
  grid-column-gap: 8px;
  align-items: center;
`;

export const HeadingActionContainer = styled.div`
  display: flex;
  align-items: center;

  > *:not(:last-child) {
    margin-right: 8px;
  }
`;
