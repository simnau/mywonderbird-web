import React from 'react';
import { useParams, Link } from 'react-router-dom';

import * as colors from '../../../../constants/colors';
import { del } from '../../../../util/fetch';
import useFetch from '../../../../util/fetch-effect';
import { H3, H4 } from '../../../../components/typography';
import Loader from '../../../../components/loader';
import JourneyListItem from '../../../../components/journey-list-item';
import { Button } from '../../../../components/button';
import { CenteredContainer } from '../../../../components/layout/containers';

function UserJourneys() {
  const { userId } = useParams();

  const { data: journeys, isLoading, rerun } = useFetch(
    `/api/journeys/all?userId=${userId}`,
    [],
  );

  const deleteJourney = async id => {
    await del(`/api/journeys/${id}`);
    rerun();
  };

  return (
    <div>
      <H3>User's journeys</H3>
      {isLoading && (
        <CenteredContainer>
          <Loader />
        </CenteredContainer>
      )}
      {!isLoading && !!journeys.length && (
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
      )}
      {!isLoading && !journeys.length && (
        <CenteredContainer>
          <H4>The user has no journeys</H4>
        </CenteredContainer>
      )}
      <Button
        variant="primary"
        as={Link}
        to={`/admin/users/${userId}/journeys/create`}
      >
        Create journey
      </Button>
    </div>
  );
}

export default UserJourneys;
