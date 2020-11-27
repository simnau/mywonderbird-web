import styled, { css } from 'styled-components';
import { lighten, saturate } from 'polished';

const focusedColor = lighten(0.2, saturate(0.4, '#2f4b51'));

const hasErrorInputStyle = css`
  border-color: red;
`;

export const inputStyle = css`
  border: 1px solid lightgray;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  line-height: 22px;
  color: gray;
  padding: 7px 8px;

  transition: border-color 100ms linear;

  &:focus {
    border-color: ${focusedColor};
  }

  ${props => props.hasError && hasErrorInputStyle}
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => (props.fullWidth ? '100%' : '300px')};
`;

const requiredLabelStyle = css`
  &::after {
    content: '*';
    color: red;
    margin-left: 8px;
  }
`;

const hasErrorLabelStyle = css`
  color: red;
`;

export const Label = styled.label`
  font-size: 14px;
  color: ${props => (props.focused ? focusedColor : 'gray')};
  transition: color 100ms linear;
  font-weight: bold;
  margin-bottom: 4px;

  ${props => props.required && requiredLabelStyle}
  ${props => props.hasError && hasErrorLabelStyle}
`;

export const ErrorContainer = styled.div`
  padding: 8px 0;
  color: red;
`;
