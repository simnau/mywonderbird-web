import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import AsyncSelect from 'react-select/async';

import { get } from '../../util/fetch';
import JourneyMap from '../journey-map';
import JourneyContext from '../../contexts/journey';
import { Datepicker, TextField, TextArea } from '../input';
import { Button } from '../button';
import DaysForm from './days';

function CreateEditJourney({ state, journeyId, onSave }) {
  const mapRef = useRef();
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
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '10fr 9fr' }}>
        <div style={{ margin: '32px 16px' }}>
          <div style={{ margin: '8px 0px', fontSize: 18, fontWeight: 'bold' }}>
            {isEdit ? 'Edit Journey' : 'Create Journey'}
          </div>
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
      </div>
    </JourneyContext.Provider>
  );
}

export default observer(CreateEditJourney);
