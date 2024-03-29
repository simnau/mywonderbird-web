import React from 'react';
import ReactDatepicker from 'react-datepicker';
import styled from 'styled-components';

import { Container, Label, inputStyle } from './common';

const InnerDatepicker = styled(ReactDatepicker)`
  ${inputStyle};
  width: 100%;
`;

function Datepicker({ fullWidth = true, label, required, ...props }) {
  return (
    <Container fullWidth={fullWidth}>
      {!!label && <Label required={required}>{label}</Label>}
      <InnerDatepicker {...props} />
    </Container>
  );
}

export default Datepicker;
