import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import { del } from '../../../util/fetch';
import useFetch from '../../../util/fetch-effect';
import JourneyListItem from '../../../components/journey-list-item';
import { Button } from '../../../components/button';

function JourneysPage() {
  const { data: journeys, rerun } = useFetch('/api/journeys/all', []);
  const history = useHistory();

  const createJourney = () => {
    history.push('/admin/journeys/create');
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
      <Button variant="primary" onClick={createJourney}>Create journey</Button>
    </div>
  );
}

export default observer(JourneysPage);
