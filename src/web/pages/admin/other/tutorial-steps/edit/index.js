import React, { useEffect } from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { post, get } from '../../../../../util/fetch';
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

function CreateTutorialStep() {
  const state = useObservable({
    stepName: '',
    stepText: '',
    isLoading: false,
  });
  const history = useHistory();
  const {
    params: { id },
  } = useRouteMatch();

  const loadTutorialStep = async () => {
    state.isLoading = true;
    const { data } = await get(`/api/tutorial-steps/${id}`);

    state.stepName = data.stepName;
    state.stepText = data.stepText;
    state.isLoading = false;
  };

  useEffect(() => {
    loadTutorialStep();
  }, []);

  const onFieldChange = event => {
    state[event.target.name] = event.target.value;
  };

  const updateTutorialStep = async event => {
    event.preventDefault();
    await put(`/api/tutorial-steps/${id}`, {
      stepText: state.stepText,
    });
    history.push('/admin/other/tutorial-steps');
  };

  return (
    <div>
      <H3>Edit tutorial step</H3>
      {state.isLoading && (
        <CenteredContainer>
          <Loader />
        </CenteredContainer>
      )}
      {!state.isLoading && (
        <Form onSubmit={updateTutorialStep}>
          <TextField
            label="Step Name"
            name="stepName"
            value={state.stepName}
            onChange={onFieldChange}
            type="text"
            disabled
          />
          <TextField
            label="Step Text"
            name="stepText"
            value={state.stepText}
            onChange={onFieldChange}
            type="text"
            placeholder="Enter the step's text show to the user"
          />
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      )}
    </div>
  );
}

export default observer(CreateTutorialStep);
