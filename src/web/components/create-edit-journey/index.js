import React from 'react';
import { observer } from 'mobx-react-lite';

import JourneyMap from '../journey-map';
import JourneyContext from '../../contexts/journey';
import { Datepicker, TextField, TextArea } from '../input';
import { Button } from '../button';
import DaysForm from './days';

function CreateEditJourney({ state, journeyId, onSave }) {
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
      <div>
        <div
          style={{
            width: '100%',
            height: 400,
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
          />
        </div>
        <div style={{ margin: '8px 0px', fontSize: 18, fontWeight: 'bold' }}>
          {isEdit ? 'Edit Journey' : 'Create Journey'}
        </div>
        <div style={{ display: 'grid', gridRowGap: 16 }}>
          <TextField
            label="Title"
            name="title"
            value={state.journey.title}
            onChange={state.journey.onFieldChange}
          />
          <TextArea
            label="Description"
            name="description"
            value={state.journey.description}
            onChange={state.journey.onFieldChange}
          />
          <TextField
            label="Type"
            name="type"
            value={state.journey.type}
            onChange={state.journey.onFieldChange}
          />
          <Datepicker
            label="Start Date"
            name="startDate"
            selected={state.journey.startDate}
            onChange={state.journey.onStartDateChange}
            dateFormat="yyyy MMMM dd"
            maxDate={new Date()}
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
    </JourneyContext.Provider>
  );
}

export default observer(CreateEditJourney);
