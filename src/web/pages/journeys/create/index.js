import React, { useContext } from 'react';
import { MobXProviderContext } from 'mobx-react';
import { useObservable, observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';

import { post } from '../../../util/fetch';
import JourneyMap from '../../../components/journey-map';
import JourneyModel from '../../../store/models/journey';
import DaysForm from './days';

function CreateJourney() {
  const { journey } = useContext(MobXProviderContext);
  const store = useObservable(new JourneyModel());
  const history = useHistory();

  const onSave = async () => {
    const url = '/api/journeys';
    const result = await post(url, {
      ...store,
      startDate: '2019-01-01',
      userId: 'admin',
    });

    journey.addJourney(result.data);
    history.push('/journeys');
  };

  return (
    <div>
      <div>CreateJourney</div>
      <div style={{ width: '100%', height: 400, position: 'sticky', top: 0 }}>
        <JourneyMap journey={store} />
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
            value={store.title}
            onChange={store.onFieldChange}
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
            value={store.description}
            onChange={store.onFieldChange}
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
            value={store.type}
            onChange={store.onFieldChange}
          />
        </div>
        <DaysForm
          days={store.days}
          addDay={store.addDay}
          removeDay={store.removeDay}
        />
      </div>
      <div>
        <button onClick={onSave}>Save</button>
      </div>
    </div>
  );
}

export default observer(CreateJourney);
