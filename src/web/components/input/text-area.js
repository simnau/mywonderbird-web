import React, { useContext } from 'react';
import styled from 'styled-components';
import { observer, useObservable } from 'mobx-react-lite';

import FormContext from '../../contexts/form';
import { Container, Label, inputStyle, ErrorContainer } from './common';

const InnerTextArea = styled.textarea`
  ${inputStyle}
`;

function TextArea({ fullWidth = true, label, required, error, ...props }) {
  const state = useObservable({
    focused: false,
    touched: false,
  });
  const { submitted } = useContext(FormContext);

  const onFocus = event => {
    state.focused = true;

    if (props.onFocus) {
      props.onFocus(event);
    }
  };

  const onBlur = event => {
    state.focused = false;
    state.touched = true;

    if (props.onBlur) {
      props.onBlur(event);
    }
  };

  const hasError = (state.touched || submitted) && error;

  return (
    <Container fullWidth={fullWidth}>
      {!!label && (
        <Label hasError={hasError} required={required} focused={state.focused}>
          {label}
        </Label>
      )}
      <InnerTextArea
        {...props}
        hasError={hasError}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {hasError && <ErrorContainer>{error}</ErrorContainer>}
    </Container>
  );
}

export default observer(TextArea);
