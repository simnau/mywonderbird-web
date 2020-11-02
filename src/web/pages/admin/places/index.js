import React, { useEffect } from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { get, del } from '../../../util/fetch';
import PlaceListItem from './components/place-list-item';
import { Button } from '../../../components/button';
import { H3, H4 } from '../../../components/typography';
import { CenteredContainer } from '../../../components/layout/containers';
import Loader from '../../../components/loader';
import Pagination from '../../../components/pagination';

const DEFAULT_PAGE_SIZE = 20;

const PlacesContainer = styled.div`
  margin-bottom: 48px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;

  > :not(:last-child) {
    margin-right: 8px;
  }
`;

async function fetchPlaces(page, pageSize = DEFAULT_PAGE_SIZE) {
  const {
    data: { total, places },
  } = await get('/api/places', { page, pageSize });

  return { total, places };
}

function PlacesPage() {
  const state = useObservable({
    page: 1,
    total: 0,
    places: [],
    isLoading: true,
  });

  const loadPlaces = async () => {
    state.isLoading = true;
    const { total, places } = await fetchPlaces(state.page);

    state.total = total;
    state.places = places;
    state.isLoading = false;
  };

  useEffect(() => {
    loadPlaces();
  }, [state.page]);

  const onPageSelect = page => {
    state.page = page;
  };

  const deletePlace = async id => {
    await del(`/api/places/${id}`);
    loadPlaces();
  };

  return (
    <PlacesContainer>
      <HeaderContainer>
        <H3>Places</H3>
        <Button variant="primary" as={Link} to="/admin/places/create">
          Create place
        </Button>
      </HeaderContainer>
      {state.isLoading && (
        <CenteredContainer>
          <Loader />
        </CenteredContainer>
      )}
      {!state.isLoading && !!state.places.length && (
        <div>
          {state.places.map(place => (
            <PlaceListItem
              key={place.id}
              place={place}
              deletePlace={deletePlace}
              editLink={`/admin/places/${place.id}/edit`}
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
      {!state.isLoading && !state.places.length && (
        <CenteredContainer>
          <H4>There are no places</H4>
        </CenteredContainer>
      )}
      <Button variant="primary" as={Link} to="/admin/places/create">
        Create place
      </Button>
    </PlacesContainer>
  );
}

export default observer(PlacesPage);
