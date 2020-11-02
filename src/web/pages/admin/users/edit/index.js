import React, { useEffect } from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { get, put } from '../../../../util/fetch';
import { H3 } from '../../../../components/typography';
import { Button } from '../../../../components/button';
import { TextField } from '../../../../components/input';
import { CenteredContainer } from '../../../../components/layout/containers';
import Loader from '../../../../components/loader';

const Form = styled.form`
  padding: 8px;
  display: grid;
  grid-row-gap: 8px;
`;

function EditUser() {
  const state = useObservable({
    email: '',
    role: '',
    isLoading: true,
    roles: [],
  });
  const history = useHistory();
  const { userId } = useParams();

  const onFieldChange = event => {
    state[event.target.name] = event.target.value;
  };

  const updateUser = async (event) => {
    event.preventDefault();
    await put(`/api/users/${state.email}`, { role: state.role });
    history.push('/admin/users');
  };

  const loadUser = async () => {
    const { data } = await get(`/api/users/${userId}`);

    return data.user;
  };

  const loadRoles = async () => {
    const { data } = await get('/api/users/roles');

    return data.roles;
  };

  useEffect(() => {
    const loadData = async () => {
      const [user, roles] = await Promise.all([loadUser(), loadRoles()]);

      state.isLoading = false;
      state.email = user.email;
      state.role = user.role;
      state.roles = roles;
    };

    loadData();
  }, [userId]);

  const roleSelector = () => {
    return (
      <div style={{ width: '100%' }}>
        <div
          style={{
            fontSize: 14,
            color: 'gray',
            fontWeight: 'bold',
            marginBottom: 4,
          }}
        >
          Role
        </div>
        <select
          value={state.role}
          onChange={onFieldChange}
          name="role"
          style={{
            width: '100%',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 14,
            lineHeight: '22px',
            color: !state.type ? 'gray' : 'black',
          }}
        >
          {state.roles.map(role => {
            return (
              <option key={role} value={role} style={{ color: 'black' }}>
                {role}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  const form = () => {
    return (
      <Form onSubmit={updateUser}>
        <TextField
          label="Email"
          name="email"
          value={state.email}
          disabled
          type="email"
        />
        {roleSelector()}
        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    );
  };

  const loader = () => {
    return (
      <CenteredContainer height="400px">
        <Loader />
      </CenteredContainer>
    );
  };

  return (
    <div>
      <H3>Edit user</H3>
      {state.isLoading && loader()}
      {!state.isLoading && form()}
    </div>
  );
}

export default observer(EditUser);
