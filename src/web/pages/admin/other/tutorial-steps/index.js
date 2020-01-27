import React, { useEffect } from 'react';
import styled from 'styled-components';
import { observer, useObservable } from 'mobx-react-lite';

import { get, del } from '../../../../util/fetch';
import { H3, H4 } from '../../../../components/typography';
import { CenteredContainer } from '../../../../components/layout/containers';
import Loader from '../../../../components/loader';
import { Button, OutlineButton } from '../../../../components/button';
import { Link } from 'react-router-dom';

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

const fetchTutorialSteps = async () => {
  return get('/api/tutorial-steps');
};

function TutorialSteps() {
  const state = useObservable({
    tutorialSteps: [],
    isLoading: false,
  });

  const setStateData = result => {
    const { data } = result;

    state.tutorialSteps = state.tutorialSteps.concat(data);
  };

  const loadTutorialSteps = async () => {
    state.isLoading = true;
    const result = await fetchTutorialSteps();
    setStateData(result);
    state.isLoading = false;
  };

  useEffect(() => {
    loadTutorialSteps();
  }, []);

  const deleteTutorialStep = async tutorialStepId => {
    await del(`/api/tutorial-steps/${tutorialStepId}`);
    state.tutorialSteps = [];
    await loadTutorialSteps();
  };

  return (
    <div>
      <H3>Tutorial Steps</H3>
      <ListContainer>
        <ListHeader>
          <div>ID</div>
          <div>Step Name</div>
          <div>Step Text</div>
          <div />
        </ListHeader>
        {state.tutorialSteps.map(tutorialStep => {
          return (
            <ListRow key={tutorialStep.id}>
              <div>{tutorialStep.id}</div>
              <div>{tutorialStep.stepName}</div>
              <div>{tutorialStep.stepText}</div>
              <ListActionContainer>
                <OutlineButton
                  as={Link}
                  variant="default"
                  to={`/admin/other/tutorial-steps/edit/${tutorialStep.id}`}
                >
                  Edit
                </OutlineButton>
                <OutlineButton
                  variant="danger"
                  onClick={() => deleteTutorialStep(tutorialStep.id)}
                >
                  Delete
                </OutlineButton>
              </ListActionContainer>
            </ListRow>
          );
        })}
        {!state.isLoading && !state.tutorialSteps.length && (
          <CenteredContainer>
            <H4>There are no tutorial steps</H4>
          </CenteredContainer>
        )}
        {state.isLoading && (
          <CenteredContainer>
            <Loader />
          </CenteredContainer>
        )}
      </ListContainer>
      <Button
        as={Link}
        variant="primary"
        to="/admin/other/tutorial-steps/create"
      >
        Create Tutorial Step
      </Button>
    </div>
  );
}

export default observer(TutorialSteps);
