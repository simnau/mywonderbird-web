import styled, { css } from 'styled-components';
import { lighten, saturate } from 'polished';

const focusedColor = lighten(0.2, saturate(0.4, '#2f4b51'));

export const inputStyle = css`
  border: 1px solid lightgray;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  line-height: 22px;
  color: gray;
  padding: 4px 8px;

  transition: border-color 100ms linear;

  &:focus {
    border-color: ${focusedColor};
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => (props.fullWidth ? '100%' : '300px')};
`;

export const Label = styled.label`
  font-size: 14px;
  color: ${props => (props.focused ? focusedColor : 'gray')};
  transition: color 100ms linear;
  font-weight: bold;
  margin-bottom: 4px;
`;
