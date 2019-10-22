import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import { del } from '../../util/fetch';
import useFetch from '../../util/fetch-effect';
import JourneyListItem from '../../components/journey-list-item';

function JourneysPage() {
  const { data: journeys, rerun } = useFetch('/api/journeys', []);
  const history = useHistory();

  const createJourney = () => {
    history.push('/journeys/create');
  };

  const deleteJourney = async id => {
    await del(`/api/journeys/${id}`);
    rerun();
  };

  return (
    <div>
      <div>Journeys</div>
      <div>
        {journeys.map(journey => (
          <JourneyListItem
            key={journey.id}
            journey={journey}
            deleteJourney={deleteJourney}
          />
        ))}
      </div>
      <button onClick={createJourney}>Create journey</button>
    </div>
  );
}

export default observer(JourneysPage);
