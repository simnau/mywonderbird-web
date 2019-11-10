import React from 'react';
import { useParams, Link } from 'react-router-dom';

import useFetch from '../../../../util/fetch-effect';
import { H3 } from '../../../../components/typography';
import JourneyListItem from '../../../../components/journey-list-item';
import { Button } from '../../../../components/button';

function UserJourneys() {
  const { userId } = useParams();

  const { data: journeys, rerun } = useFetch(
    `/api/journeys/all?userId=${userId}`,
    [],
  );

  const deleteJourney = () => {};

  return (
    <div>
      <H3>User's journeys</H3>
      <div>
        {journeys.map(journey => (
          <JourneyListItem
            key={journey.id}
            journey={journey}
            deleteJourney={deleteJourney}
            editLink={`/admin/users/${userId}/journeys/${journey.id}/edit`}
          />
        ))}
      </div>
      <Button variant="primary" as={Link} to={`/admin/users/${userId}/journeys/create`}>
        Create journey
      </Button>
    </div>
  );
}

export default UserJourneys;
