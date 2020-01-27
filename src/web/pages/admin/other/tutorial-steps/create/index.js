import React from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { post } from '../../../../../util/fetch';
import { H3 } from '../../../../../components/typography';
import { Button } from '../../../../../components/button';
import { TextField } from '../../../../../components/input';

const Form = styled.form`
  padding: 8px;
  display: grid;
  grid-row-gap: 8px;
`;

function CreateTutorialStep() {
  const state = useObservable({
    stepName: '',
    stepText: '',
  });
  const history = useHistory();

  const onFieldChange = event => {
    state[event.target.name] = event.target.value;
  };

  const createTutorialStep = async event => {
    event.preventDefault();
    await post('/api/tutorial-steps', {
      stepName: state.stepName,
      stepText: state.stepText,
    });
    history.push('/admin/other/tutorial-steps');
  };

  return (
    <div>
      <H3>Create tutorial step</H3>
      <Form onSubmit={createTutorialStep}>
        <TextField
          label="Step Name"
          name="stepName"
          value={state.stepName}
          onChange={onFieldChange}
          type="text"
          placeholder="Enter the step's name"
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
          Create
        </Button>
      </Form>
    </div>
  );
}

export default observer(CreateTutorialStep);
