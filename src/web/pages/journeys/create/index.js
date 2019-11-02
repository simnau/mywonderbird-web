import React, { useEffect } from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';

import { post } from '../../../util/fetch';
import JourneyMap from '../../../components/journey-map';
import { Input, TextArea } from '../../../components/input';
import { Button } from '../../../components/button';
import JourneyModel from '../../../store/models/journey';
import DaysForm from './days';

function CreateJourney() {
  const journey = useObservable(new JourneyModel());
  const state = useObservable({
    selectedDay: null,
    selectedGem: null,
  });
  const history = useHistory();

  useEffect(() => {
    journey.addDay({});
  }, []);

  const onSave = async () => {
    const url = '/api/journeys';
    await post(url, {
      ...journey,
      startDate: '2019-01-01',
      userId: 'admin',
    });
    history.push('/journeys');
  };

  const addGem = day => {
    state.selectedDay = day;
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

  const selectOnMap = gem => {
    state.selectedGem = gem;
  };

  const finishSelectOnMap = (event, data) => {
    if (state.selectedGem) {
      state.selectedGem.lat = data.lngLat.lat;
      state.selectedGem.lng = data.lngLat.lng;
    }

    state.selectedGem = null;
  };

  const onMapClick =
    (!!state.selectedDay && finishAddGem) ||
    (!!state.selectedGem && finishSelectOnMap);

  return (
    <div>
      <div
        style={{
          width: '100%',
          height: 400,
          position: 'sticky',
          top: 64,
          zIndex: 1000,
        }}
      >
        <JourneyMap
          journey={journey}
          onClickEnabled={!!state.selectedDay || !!state.selectedGem}
          onClick={onMapClick}
        />
      </div>
      <div style={{ margin: '8px 0px', fontSize: 18, fontWeight: 'bold' }}>
        CreateJourney
      </div>
      <div style={{ display: 'grid', gridRowGap: 16 }}>
        <Input
          label="Title"
          name="title"
          value={journey.title}
          onChange={journey.onFieldChange}
        />
        <TextArea
          label="Description"
          name="description"
          value={journey.description}
          onChange={journey.onFieldChange}
        />
        <Input
          label="Type"
          name="type"
          value={journey.type}
          onChange={journey.onFieldChange}
        />
        <DaysForm
          days={journey.days}
          addDay={journey.addDay}
          removeDay={journey.removeDay}
          onAddGem={addGem}
          selectOnMap={selectOnMap}
        />
      </div>
      <div>
        <Button variant="primary" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default observer(CreateJourney);
