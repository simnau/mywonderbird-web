import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import { del } from '../../../util/fetch';
import useFetch from '../../../util/fetch-effect';
import JourneyListItem from '../../../components/journey-list-item';
import { Button } from '../../../components/button';
import { H3 } from '../../../components/typography';

function JourneysPage() {
  const { data: journeys, rerun } = useFetch('/api/journeys/all', []);

  const deleteJourney = async id => {
    await del(`/api/journeys/${id}`);
    rerun();
  };

  return (
    <div>
      <H3>Journeys</H3>
      <div>
        {journeys.map(journey => (
          <JourneyListItem
            key={journey.id}
            journey={journey}
            deleteJourney={deleteJourney}
            editLink={`/admin/journeys/${journey.id}/edit`}
          />
        ))}
      </div>
      <Button variant="primary" as={Link} to="/admin/journeys/create">
        Create journey
      </Button>
    </div>
  );
}

export default observer(JourneysPage);
