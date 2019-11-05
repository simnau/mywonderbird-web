import React from 'react';
import styled from 'styled-components';
import { observer, useObservable } from 'mobx-react-lite';

import { Container, Label, inputStyle } from './common';

const InnerTextArea = styled.textarea`
  ${inputStyle}
`;

function TextArea({ fullWidth = true, label, ...props }) {
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
      {!!label && <Label focused={state.focused}>{label}</Label>}
      <InnerTextArea {...props} onFocus={onFocus} onBlur={onBlur} />
    </Container>
  );
}

export default observer(TextArea);
