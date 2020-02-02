import React, { useEffect } from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { get, post } from '../../../../../util/fetch';
import { H3 } from '../../../../../components/typography';
import { Button } from '../../../../../components/button';
import { TextField } from '../../../../../components/input';
import { CenteredContainer } from '../../../../../components/layout/containers';
import Loader from '../../../../../components/loader';

const Form = styled.form`
  padding: 8px;
  display: grid;
  grid-row-gap: 8px;
`;

function CreateTerms() {
  const state = useObservable({
    termTypes: [],
    type: '',
    url: '',
    isLoading: false,
  });
  const history = useHistory();

  useEffect(() => {
    const loadTermTypes = async () => {
      state.isLoading = true;
      const { data: termTypes } = await get('/api/terms/types');

      state.termTypes = termTypes;
      state.isLoading = false;
    };
    loadTermTypes();
  }, []);

  const onFieldChange = event => {
    state[event.target.name] = event.target.value;
  };

  const createTerms = async event => {
    event.preventDefault();
    await post('/api/terms', {
      type: state.type,
      url: state.url,
    });
    history.push('/admin/other/terms');
  };

  return (
    <div>
      <H3>Create terms</H3>
      {state.isLoading && (
        <CenteredContainer>
          <Loader />
        </CenteredContainer>
      )}
      {!state.isLoading && (
        <Form onSubmit={createTerms}>
          <div style={{ width: '100%' }}>
            <div
              style={{
                fontSize: 14,
                color: 'gray',
                fontWeight: 'bold',
                marginBottom: 4,
              }}
            >
              Type
            </div>
            <select
              value={state.type}
              onChange={onFieldChange}
              name="type"
              style={{
                width: '100%',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: 14,
                lineHeight: '22px',
                color: !state.type ? 'gray' : 'black',
              }}
            >
              <option value="" style={{ color: 'gray' }}>
                Select a type...
              </option>
              {state.termTypes.map(termType => {
                return (
                  <option
                    key={termType.value}
                    value={termType.value}
                    style={{ color: 'black' }}
                  >
                    {termType.label}
                  </option>
                );
              })}
            </select>
          </div>
          <TextField
            label="URL"
            name="url"
            value={state.url}
            onChange={onFieldChange}
            type="text"
            placeholder="Enter the term's URL"
          />
          <Button variant="primary" type="submit" disabled={!state.type}>
            Create
          </Button>
        </Form>
      )}
    </div>
  );
}

export default observer(CreateTerms);
