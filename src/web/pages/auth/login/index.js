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

const ErrorContainer = styled.div`
  width: 100%;
  color: red;
  font-size: 16px;
  padding: 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Login() {
  const { login } = useContext(AuthContext);
  const state = useObservable({
    email: '',
    password: '',
    error: null,
  });

  const onFieldChange = event => {
    state[event.target.name] = event.target.value;
  };

  const onSubmit = async event => {
    event.preventDefault();
    state.error = null;

    try {
      await login(state);
    } catch (err) {
      if (err.response) {
        state.error = err.response.data.error;
      } else {
        state.error = 'Something unexpected happened. Pleas try again later...';
      }
    }
  };

  return (
    <Container>
      <div style={{ marginBottom: 8, fontSize: 20, fontWeight: 'bold' }}>
        Login
      </div>
      {state.error && <ErrorContainer>{state.error}</ErrorContainer>}
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
