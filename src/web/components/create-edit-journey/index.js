import React, { useRef } from 'react';
import { observer, useObservable } from 'mobx-react-lite';
import AsyncSelect from 'react-select/async';
import styled from 'styled-components';
import Toggle from 'react-toggle';

import { get } from '../../util/fetch';
import JourneyMap from '../journey-map';
import JourneyContext from '../../contexts/journey';
import { Datepicker, TextField, TextArea } from '../input';
import { Button } from '../button';
import DaysForm from './days';
import PlaceLookupModal from '../place-lookup-modal';

const ErrorsContainer = styled.div`
  padding: 8px;
  background-color: red;
  color: white;
  z-index: 1;
`;

const ErrorList = styled.div`
  margin-left: 8px;

  > *:not(:last-child) {
    margin-bottom: 4px;
  }
`;

const Error = styled.p`
  &:before {
    content: '*';
    margin-right: 4px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;

  > :not(:last-child) {
    margin-right: 8px;
  }
`;

const PublishedContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;

  > :not(:last-child) {
    margin-right: 8px;
  }
`;

function renderErrorList(errors) {
  return (
    <ErrorList>
      {Object.entries(errors).map(([key, error]) => {
        return (
          <div key={key}>
            {typeof error !== 'string' && <div>{key}</div>}
            {typeof error === 'string' ? (
              <Error>{error}</Error>
            ) : (
              renderErrorList(error)
            )}
          </div>
        );
      })}
    </ErrorList>
  );
}

function CreateEditJourney({ state, journeyId, onSave }) {
  const innerState = useObservable({
    showSearchPlacesModal: false,
  });
  const mapRef = useRef();
  const autosuggestRef = useRef();
  const isEdit = !!journeyId;

  const addGemFromMap = day => {
    state.selectedDay = day;

    state.selectedNest = null;
    state.selectedGem = null;
  };

  const finishAddGem = (event, data) => {
    if (state.selectedDay) {
      state.selectedDay.addGem({
        lat: data.lngLat.lat,
        lng: data.lngLat.lng,
      });
    }

    state.selectedDay = null;
  };

  const cancelAddGemFromMap = () => {
    state.selectedDay = null;
  };

  const selectOnMap = gem => {
    state.selectedGem = gem;

    state.selectedDay = null;
    state.selectedNest = null;
  };

  const cancelSelectOnMap = () => {
    state.selectedGem = null;
  };

  const finishSelectOnMap = (event, data) => {
    if (state.selectedGem) {
      state.selectedGem.lat = data.lngLat.lat;
      state.selectedGem.lng = data.lngLat.lng;
    }

    state.selectedGem = null;
  };

  const selectNestLocationOnMap = nest => {
    state.selectedNest = nest;

    state.selectedDay = null;
    state.selectedGem = null;
  };

  const finishSelectNestLocationOnMap = (event, data) => {
    if (state.selectedNest) {
      state.selectedNest.lat = data.lngLat.lat;
      state.selectedNest.lng = data.lngLat.lng;
    }

    state.selectedNest = null;
  };

  const cancelSelectNestLocationOnMap = () => {
    state.selectedNest = null;
  };

  const onMapClick = (...args) => {
    if (state.selectedDay) {
      finishAddGem(...args);
    } else if (state.selectedGem) {
      finishSelectOnMap(...args);
    } else if (state.selectedNest) {
      finishSelectNestLocationOnMap(...args);
    }
  };

  const searchCountries = async inputValue => {
    const { data } = await get('/api/geo/countries/search', {
      q: inputValue.trim(),
    });
    return data;
  };

  const countrySelected = async selected => {
    if (!selected) {
      return;
    }

    const { data: countryBoundaries } = await get(
      `/api/geo/country-boundaries/${selected.value}`,
    );

    if (mapRef && mapRef.current) {
      mapRef.current.fitBounds([
        countryBoundaries.topLeft,
        countryBoundaries.bottomRight,
      ]);
    }
  };

  const openSelectPlacesModal = day => {
    state.selectedDay = day;
    innerState.showSelectPlacesModal = true;
    setTimeout(() => {
      if (autosuggestRef.current) {
        autosuggestRef.current.input.focus();
      }
    }, 0);
  };

  const closeSelectPlacesModal = () => {
    state.selectedDay = null;
    setTimeout(() => {
      innerState.showSelectPlacesModal = false;
    }, 0);
  };

  const onSelectPlace = item => {
    if (state.selectedDay) {
      state.selectedDay.addGem({
        lat: item.location.lat,
        lng: item.location.lng,
        title: item.name,
      });

      if (mapRef.current) {
        mapRef.current.jumpTo({
          center: {
            lon: item.location.lng,
            lat: item.location.lat,
          },
        });
      }
    }

    closeSelectPlacesModal();
  };

  const mapClickEnabled =
    !!state.selectedDay || !!state.selectedGem || !!state.selectedNest;

  return (
    <JourneyContext.Provider
      value={{
        journeyId: state.journey.id,
        selectedDay: state.selectedDay,
        addGemFromMap,
        cancelAddGemFromMap,
        selectedGem: state.selectedGem,
        selectOnMap,
        cancelSelectOnMap,
        selectedNest: state.selectedNest,
        selectNestLocationOnMap,
        cancelSelectNestLocationOnMap,
        openSelectPlacesModal,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '10fr 9fr' }}>
        <div style={{ margin: '32px 16px' }}>
          {state.submitted &&
            Object.keys(state.journey.errors).length !== 0 && (
              <ErrorsContainer>
                {renderErrorList(state.journey.errors)}
              </ErrorsContainer>
            )}
          <HeaderContainer>
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>
              {isEdit ? 'Edit Journey' : 'Create Journey'}
            </div>
            <Button variant="primary" onClick={onSave}>
              Save
            </Button>
          </HeaderContainer>
          {isEdit && (
            <PublishedContainer>
              <Toggle
                checked={state.journey.published}
                onChange={state.journey.onPublishedToggle}
              />
              <span style={{ fontWeight: 600, color: 'rgba(31, 32, 65, 0.9)' }}>
                {state.journey.published ? 'Published' : 'Not Published'}
              </span>
            </PublishedContainer>
          )}
          <div style={{ display: 'grid', gridRowGap: 16 }}>
            {!isEdit && (
              <AsyncSelect
                cacheOptions
                loadOptions={searchCountries}
                placeholder="Select a country to start"
                onChange={countrySelected}
              />
            )}
            <TextField
              required
              label="Title"
              name="title"
              value={state.journey.title}
              onChange={state.journey.onFieldChange}
              error={state.journey.errors.title}
            />
            <TextArea
              label="Description"
              name="description"
              value={state.journey.description}
              onChange={state.journey.onFieldChange}
              error={state.journey.errors.description}
            />
            <TextField
              label="Type"
              name="type"
              value={state.journey.type}
              onChange={state.journey.onFieldChange}
              error={state.journey.errors.type}
            />
            <Datepicker
              required
              label="Start Date"
              name="startDate"
              selected={state.journey.startDate}
              onChange={state.journey.onStartDateChange}
              dateFormat="yyyy MMMM dd"
              maxDate={new Date()}
              error={state.journey.errors.startDate}
            />
            <DaysForm
              days={state.journey.days}
              addDay={state.journey.addDay}
              removeDay={state.journey.removeDay}
            />
          </div>
          <div>
            <Button variant="primary" onClick={onSave}>
              Save
            </Button>
          </div>
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
          <JourneyMap
            journey={state.journey}
            onClickEnabled={mapClickEnabled}
            onClick={onMapClick}
            mapRef={mapRef}
          />
        </div>
        <PlaceLookupModal
          isOpen={innerState.showSelectPlacesModal}
          onClose={closeSelectPlacesModal}
          onSelect={onSelectPlace}
          autosuggestRef={autosuggestRef}
        />
      </div>
    </JourneyContext.Provider>
  );
}

export default observer(CreateEditJourney);
