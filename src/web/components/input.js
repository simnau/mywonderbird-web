import React from 'react';
import styled, { css } from 'styled-components';
import { useObservable, observer } from 'mobx-react-lite';
import { lighten, saturate } from 'polished';

const focusedColor = lighten(0.2, saturate(0.4, '#2f4b51'));

const inputStyle = css`
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => (props.fullWidth ? '100%' : '300px')};
`;

const Label = styled.label`
  font-size: 14px;
  color: ${props => (props.focused ? focusedColor : 'gray')};
  transition: color 100ms linear;
  font-weight: bold;
  margin-bottom: 4px;
`;

const InnerInput = styled.input`
  ${inputStyle}
`;

function InputComponent({ fullWidth = true, label, ...props }) {
  const state = useObservable({
    focused: false,
  });

  const onFocus = event => {
    state.focused = true;

    if (props.onFocus) {
      props.onFocus(event);
    }
  };

  const onBlur = event => {
    state.focused = false;

    if (props.onBlur) {
      props.onBlur(event);
    }
  };

  return (
    <Container fullWidth={fullWidth}>
      <Label focused={state.focused}>{label}</Label>
      <InnerInput {...props} onFocus={onFocus} onBlur={onBlur} />
    </Container>
  );
}

export const Input = observer(InputComponent);

const InnerTextArea = styled.textarea`
  ${inputStyle}
`;

function TextAreaComponent({ fullWidth = true, label, ...props }) {
  const state = useObservable({
    focused: false,
  });

  const onFocus = event => {
    state.focused = true;

    if (props.onFocus) {
      props.onFocus(event);
    }
  };

  const onBlur = event => {
    state.focused = false;

    if (props.onBlur) {
      props.onBlur(event);
    }
  };

  return (
    <Container fullWidth={fullWidth}>
      <Label focused={state.focused}>{label}</Label>
      <InnerTextArea {...props} onFocus={onFocus} onBlur={onBlur} />
    </Container>
  );
}

export const TextArea = observer(TextAreaComponent);
