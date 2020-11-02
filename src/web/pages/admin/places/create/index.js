import React, { useEffect } from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import styled from 'styled-components';

import { get, post } from '../../../../util/fetch';
import { H3 } from '../../../../components/typography';
import { Button } from '../../../../components/button';
import { TextField } from '../../../../components/input';
import { CenteredContainer } from '../../../../components/layout/containers';
import Loader from '../../../../components/loader';
import LocationMap from './components/location-map';

const RootContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const Form = styled.form`
  padding: 8px;
  display: grid;
  grid-row-gap: 8px;
`;

function CreatePlace() {
  const state = useObservable({
    title: '',
    lng: null,
    lat: null,
    country: null,
    tags: [],
    selectedTags: [],
    isLoading: true,
  });
  const history = useHistory();

  useEffect(() => {
    const loadTags = async () => {
      const { data } = await get('/api/tags');

      state.tags = data.tags.map(tag => {
        return {
          value: tag.id,
          label: tag.title,
        };
      });
      state.isLoading = false;
    };

    loadTags();
  }, []);

  const onFieldChange = event => {
    state[event.target.name] = event.target.value;
  };

  const createPlace = async event => {
    event.preventDefault();
    const placeData = {
      title: state.title,
      lat: state.lat,
      lng: state.lng,
      placeTags: state.selectedTags.map((tag) => ({
        tagId: tag.value,
      })),
      countryCode: state.country.countryCode,
    };

    await post('/api/places', placeData);
    history.push('/admin/places');
  };

  const getCountry = async location => {
    if (!location) {
      return;
    }

    const { data } = await get('/api/geo/places/country', {
      location: `${location.lat},${location.lng}`,
    });

    return data;
  };

  const onSelectLocation = async (event, location) => {
    if (!location) {
      state.lat = null;
      state.lng = null;
      return;
    }

    state.lat = location.lngLat.lat;
    state.lng = location.lngLat.lng;

    const countryInfo = await getCountry({
      lat: location.lngLat.lat,
      lng: location.lngLat.lng,
    });

    if (!countryInfo) {
      state.lat = null;
      state.lng = null;
      state.country = null;
      return;
    }

    state.country = countryInfo;
  };

  const onChangeTag = (newValue) => {
    state.selectedTags = newValue;
  };

  const locationText =
    state.lat && state.lng
      ? `${state.lat}, ${state.lng}`
      : 'No location selected';
  const countryText = state.country
    ? state.country.country
    : 'No location selected';
  const location =
    state.lat && state.lng ? { lat: state.lat, lng: state.lng } : null;

  const loader = () => {
    return (
      <CenteredContainer height="400px">
        <Loader />
      </CenteredContainer>
    );
  };

  if (state.isLoading) {
    return loader();
  }

  return (
    <RootContainer>
      <div>
        <H3>Create place</H3>
        <Form onSubmit={createPlace}>
          <TextField
            label="Title"
            name="title"
            value={state.title}
            onChange={onFieldChange}
            type="text"
            placeholder="Enter the place's title"
          />
          <TextField
            label="Location"
            name="location"
            value={locationText}
            type="text"
            disabled
          />
          <TextField
            label="Country"
            name="country"
            value={countryText}
            type="text"
            disabled
          />
          <div>
            <div
              style={{
                fontSize: 14,
                color: 'gray',
                fontWeight: 'bold',
                marginBottom: 4,
              }}
            >
              Tags
            </div>
            <Select
              value={state.selectedTags}
              closeMenuOnSelect={false}
              isMulti
              options={state.tags}
              onChange={onChangeTag}
            />
          </div>
          <Button variant="primary" type="submit">
            Create
          </Button>
        </Form>
      </div>
      <div
        style={{
          width: '100%',
          height: 'calc(100vh - 64px)',
          position: 'sticky',
          top: 64,
          zIndex: 1,
          paddingBottom: 8,
          backgroundColor: 'white',
        }}
      >
        <LocationMap onClick={onSelectLocation} location={location} />
      </div>
    </RootContainer>
  );
}

export default observer(CreatePlace);
