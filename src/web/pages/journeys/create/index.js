import React from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';

import { post } from '../../../util/fetch';
import JourneyMap from '../../../components/journey-map';
import JourneyModel from '../../../store/models/journey';
import DaysForm from './days';

function CreateJourney() {
  const journey = useObservable(new JourneyModel());
  const state = useObservable({
    addGemEnabled: false,
    selectedDay: null,
  });
  const history = useHistory();

  const onSave = async () => {
    const url = '/api/journeys';
    await post(url, {
      ...store,
      startDate: '2019-01-01',
      userId: 'admin',
    });
    history.push('/journeys');
  };

  const addGem = day => {
    state.addGemEnabled = true;
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
    state.addGemEnabled = false;
  };

  return (
    <div>
      <div>CreateJourney</div>
      <div style={{ width: '100%', height: 400, position: 'sticky', top: 0 }}>
        <JourneyMap
          journey={journey}
          onClickEnabled={state.addGemEnabled}
          onClick={finishAddGem}
        />
      </div>
      <div style={{ margin: 8, padding: 8, border: '1px solid black' }}>
        <div
          style={{
            margin: 8,
            display: 'grid',
            gridTemplateColumns: '100px 200px',
          }}
        >
          <label>Title</label>
          <input
            name="title"
            value={journey.title}
            onChange={journey.onFieldChange}
          />
        </div>
        <div
          style={{
            margin: 8,
            display: 'grid',
            gridTemplateColumns: '100px 200px',
          }}
        >
          <label>Description</label>
          <textarea
            name="description"
            value={journey.description}
            onChange={journey.onFieldChange}
          />
        </div>
        <div
          style={{
            margin: 8,
            display: 'grid',
            gridTemplateColumns: '100px 200px',
          }}
        >
          <label>Type</label>
          <input
            name="type"
            value={journey.type}
            onChange={journey.onFieldChange}
          />
        </div>
        <DaysForm
          days={journey.days}
          addDay={journey.addDay}
          removeDay={journey.removeDay}
          onAddGem={addGem}
        />
      </div>
      <div>
        <button onClick={onSave}>Save</button>
      </div>
    </div>
  );
}

export default observer(CreateJourney);
