import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useObservable, observer } from 'mobx-react-lite';

import { get, del } from '../../../../util/fetch';
import { H3, H4 } from '../../../../components/typography';
import Loader from '../../../../components/loader';
import JourneyListItem from '../../../../components/journey-list-item';
import { Button } from '../../../../components/button';
import { CenteredContainer } from '../../../../components/layout/containers';
import Pagination from '../../../../components/pagination';

const DEFAULT_PAGE_SIZE = 20;

const JourneysContainer = styled.div`
  margin-bottom: 48px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;

  > :not(:last-child) {
    margin-right: 8px;
  }
`;

async function fetchJourneys(userId, page, pageSize = DEFAULT_PAGE_SIZE) {
  const {
    data: { total, journeys },
  } = await get('/api/journeys/all', { userId, page, pageSize });

  return { total, journeys };
}

function UserJourneys() {
  const { userId } = useParams();

  const state = useObservable({
    page: 1,
    total: 0,
    journeys: [],
    isLoading: true,
  });

  const loadJourneys = async () => {
    state.isLoading = true;
    const { total, journeys } = await fetchJourneys(userId, state.page);

    state.total = total;
    state.journeys = journeys;
    state.isLoading = false;
  };

  useEffect(() => {
    loadJourneys();
  }, [state.page]);

  const onPageSelect = page => {
    state.page = page;
  };

  const deleteJourney = async id => {
    await del(`/api/journeys/${id}`);
    loadJourneys();
  };

  return (
    <JourneysContainer>
      <HeaderContainer>
        <H3>User's journeys</H3>
        <Button
          variant="primary"
          as={Link}
          to={`/admin/users/${userId}/journeys/create`}
        >
          Create journey
        </Button>
      </HeaderContainer>
      {state.isLoading && (
        <CenteredContainer>
          <Loader />
        </CenteredContainer>
      )}
      {!state.isLoading && !!state.journeys.length && (
        <div>
          {state.journeys.map(journey => (
            <JourneyListItem
              key={journey.id}
              journey={journey}
              deleteJourney={deleteJourney}
              editLink={`/admin/users/${userId}/journeys/${journey.id}/edit`}
            />
          ))}
          <Pagination
            page={state.page}
            pageSize={DEFAULT_PAGE_SIZE}
            total={state.total}
            onPageSelect={onPageSelect}
          />
        </div>
      )}
      {!state.isLoading && !state.journeys.length && (
        <CenteredContainer>
          <H4>The user has no journeys</H4>
        </CenteredContainer>
      )}
      <Button
        variant="primary"
        as={Link}
        to={`/admin/users/${userId}/journeys/create`}
      >
        Create journey
      </Button>
    </JourneysContainer>
  );
}

export default observer(UserJourneys);
