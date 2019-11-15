import styled from 'styled-components';

export const CenteredContainer = styled.div`
  width: 100%;
  height: ${props => props.height || '100px'};
  display: flex;
  justify-content: center;
  align-items: center;
`;
