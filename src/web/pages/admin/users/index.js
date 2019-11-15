import React, { useEffect } from 'react';
import { observer, useObservable } from 'mobx-react-lite';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { get, del } from '../../../util/fetch';
import { Button, OutlineButton } from '../../../components/button';
import { H3, H4 } from '../../../components/typography';
import { CenteredContainer } from '../../../components/layout/containers';
import Loader from '../../../components/loader';

const ListContainer = styled.div`
  margin-bottom: 16px;
`;

const ListHeader = styled.div`
  padding: 16px 8px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  font-size: 18px;
  border-bottom: 1px solid lightgray;
  color: gray;
`;

const ListRow = styled.div`
  padding: 16px 8px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  font-size: 16px;
`;

const ListActionContainer = styled.div`
  display: grid;
  grid-row-gap: 8px;
`;

const LoadMoreContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const fetchUsers = async (paginationToken = null) => {
  if (!paginationToken) {
    return get('/api/users');
  }

  return get('/api/users', { paginationToken });
};

function Users() {
  const state = useObservable({
    users: [],
    paginationToken: null,
    isLoading: false,
  });

  const setStateData = result => {
    const data = result.data;

    state.users = state.users.concat(data.users);
    state.paginationToken = data.paginationToken;
  };

  useEffect(() => {
    const loadUsers = async () => {
      state.isLoading = true;
      const result = await fetchUsers();
      setStateData(result);
      state.isLoading = false;
    };
    loadUsers();
  }, []);

  const onLoadMore = async () => {
    state.isLoading = true;
    const result = await fetchUsers(state.paginationToken);
    setStateData(result);
    state.isLoading = false;
  };

  const deleteUser = async userId => {
    await del(`/api/users/${userId}`);
    rerun();
  };

  return (
    <div>
      <H3>Users</H3>
      <ListContainer>
        <ListHeader>
          <div>ID</div>
          <div>Email</div>
          <div>Role</div>
          <div />
        </ListHeader>
        {state.users.map(user => {
          return (
            <ListRow key={user.id}>
              <div>{user.id}</div>
              <div>{user.email}</div>
              <div>{user.role}</div>
              <ListActionContainer>
                <OutlineButton
                  as={Link}
                  variant="primary"
                  to={`/admin/users/${user.id}/journeys`}
                >
                  View Journeys
                </OutlineButton>
                {user.role !== 'ADMIN' && (
                  <OutlineButton
                    variant="danger"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </OutlineButton>
                )}
              </ListActionContainer>
            </ListRow>
          );
        })}
        {!state.isLoading && !state.users.length && (
          <CenteredContainer>
            <H4>There are no users</H4>
          </CenteredContainer>
        )}
        {!state.isLoading && state.paginationToken && (
          <LoadMoreContainer>
            <OutlineButton variant="primary" onClick={onLoadMore}>
              Load more...
            </OutlineButton>
          </LoadMoreContainer>
        )}
        {state.isLoading && (
          <CenteredContainer>
            <Loader />
          </CenteredContainer>
        )}
      </ListContainer>
      <Button as={Link} variant="primary" to="/admin/users/create">
        Create User
      </Button>
    </div>
  );
}

export default observer(Users);
