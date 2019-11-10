import React from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { post } from '../../../../util/fetch';
import { H3 } from '../../../../components/typography';
import { Button } from '../../../../components/button';
import { TextField } from '../../../../components/input';

const Form = styled.form`
  padding: 8px;
  display: grid;
  grid-row-gap: 8px;
`;

function CreateUser() {
  const state = useObservable({
    email: '',
  });
  const history = useHistory();

  const onFieldChange = event => {
    state[event.target.name] = event.target.value;
  };

  const createUser = async event => {
    event.preventDefault();
    await post('/api/users', { email: state.email });
    history.push('/admin/users');
  };

  return (
    <div>
      <H3>Create user</H3>
      <Form onSubmit={createUser}>
        <TextField
          label="Email"
          name="email"
          value={state.email}
          onChange={onFieldChange}
          type="email"
        />
        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </div>
  );
}

export default observer(CreateUser);
