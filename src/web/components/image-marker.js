import React from 'react';
import styled from 'styled-components';

const BorderContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: black;

  &:hover {
    background-color: green;
  }

  transition: background-color 100ms linear;
`;

const Container = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: gray;
  cursor: pointer;
`;

function ImageMarker() {
  return (
    <BorderContainer>
      <Container />
    </BorderContainer>
  );
}

export default ImageMarker;
