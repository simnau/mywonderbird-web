import React, { useEffect } from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { get, del } from '../../../util/fetch';
import JourneyListItem from '../../../components/journey-list-item';
import { Button } from '../../../components/button';
import { H3, H4 } from '../../../components/typography';
import { CenteredContainer } from '../../../components/layout/containers';
import Loader from '../../../components/loader';
import Pagination from '../../../components/pagination';

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

async function fetchJourneys(page, pageSize = DEFAULT_PAGE_SIZE) {
  const {
    data: { total, journeys },
  } = await get('/api/journeys/all', { page, pageSize });

  return { total, journeys };
}

function JourneysPage() {
  const state = useObservable({
    page: 1,
    total: 0,
    journeys: [],
    isLoading: true,
  });

  const loadJourneys = async () => {
    state.isLoading = true;
    const { total, journeys } = await fetchJourneys(state.page);

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
        <H3>Journeys</H3>
        <Button variant="primary" as={Link} to="/admin/journeys/create">
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
              editLink={`/admin/journeys/${journey.id}/edit`}
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
          <H4>There are no journeys</H4>
        </CenteredContainer>
      )}
      <Button variant="primary" as={Link} to="/admin/journeys/create">
        Create journey
      </Button>
    </JourneysContainer>
  );
}

export default observer(JourneysPage);
