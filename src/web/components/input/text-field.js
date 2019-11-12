import React, { useContext } from 'react';
import styled from 'styled-components';
import { observer, useObservable } from 'mobx-react-lite';

import { Container, Label, inputStyle, ErrorContainer } from './common';
import FormContext from '../../contexts/form';

const InnerInput = styled.input`
  ${inputStyle}
`;

function TextField({ fullWidth = true, label, required, error, ...props }) {
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

  const hasError = (state.touched || submitted) && !!error;

  return (
    <Container fullWidth={fullWidth}>
      {label && (
        <Label hasError={hasError} required={required} focused={state.focused}>
          {label}
        </Label>
      )}
      <InnerInput
        {...props}
        hasError={hasError}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {hasError && <ErrorContainer>{error}</ErrorContainer>}
    </Container>
  );
}

export default observer(TextField);
