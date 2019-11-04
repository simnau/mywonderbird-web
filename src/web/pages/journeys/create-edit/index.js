import React, { useEffect } from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { get, post, put } from '../../../util/fetch';
import JourneyMap from '../../../components/journey-map';
import { Input, TextArea } from '../../../components/input';
import { Button } from '../../../components/button';
import JourneyModel from '../../../store/models/journey';
import JourneyContext from '../../../contexts/journey';
import DaysForm from './days';

function CreateJourney() {
  const match = useRouteMatch();
  const isEdit = !!match.params.id;
  const state = useObservable({
    selectedDay: null,
    selectedGem: null,
    selectedNest: null,
    journey: new JourneyModel({ days: [{ dayNumber: 1 }] }),
  });

  if (isEdit) {
    useEffect(() => {
      const fetchJourney = async () => {
        const response = await get(`/api/journeys/${match.params.id}`);
        state.journey = new JourneyModel(response.data);
      };
      fetchJourney();
    }, []);
  }

  const history = useHistory();

  const onSave = async () => {
    if (isEdit) {
      const url = `/api/journeys/${match.params.id}`;
      await put(url, {
        ...state.journey,
      });
    } else {
      const url = '/api/journeys';
      await post(url, {
        ...state.journey,
        startDate: '2019-01-01',
        userId: 'admin',
      });
    }
    history.push('/journeys');
  };

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
            zIndex: 1000,
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
          <Input
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
          <Input
            label="Type"
            name="type"
            value={state.journey.type}
            onChange={state.journey.onFieldChange}
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

export default observer(CreateJourney);
