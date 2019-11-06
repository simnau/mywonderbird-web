import React, { useContext } from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { TextField } from '../../../components/input';
import { Button } from '../../../components/button';
import AuthContext from '../../../contexts/auth';

const Container = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 32px auto;
`;

const Form = styled.form`
  display: grid;
  grid-row-gap: 8px;
`;

function Login() {
  const { login } = useContext(AuthContext);
  const state = useObservable({
    email: '',
    password: '',
  });

  const onFieldChange = event => {
    state[event.target.name] = event.target.value;
  };

  const onSubmit = event => {
    event.preventDefault();
    login(state);
  };

  return (
    <Container>
      <div style={{ marginBottom: 8, fontSize: 20, fontWeight: 'bold' }}>Login</div>
      <Form onSubmit={onSubmit}>
        <TextField
          label="Email"
          placeholder="Enter your email"
          name="email"
          type="email"
          value={state.email}
          onChange={onFieldChange}
        />
        <TextField
          label="Password"
          placeholder="Enter your password"
          name="password"
          type="password"
          value={state.password}
          onChange={onFieldChange}
        />
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default observer(Login);
