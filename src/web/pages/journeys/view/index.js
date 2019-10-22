import React from 'react';
import { observer } from 'mobx-react-lite';

import JourneyMap from '../../../components/journey-map';
import useFetch from '../../../util/fetch-effect';

function ViewJourney({ match }) {
  const { id } = match.params;
  const { data: journey, isLoading } = useFetch(`/api/journeys/${id}`, null);

  console.log(journey);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={{ width: '100%', height: 400, position: 'sticky', top: 0 }}>
        <JourneyMap journey={journey} />
      </div>
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
          <label>Title</label>
          <span>{journey.title}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
          <label>Description</label>
          <span>{journey.description}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
          <label>Type</label>
          <span>{journey.type}</span>
        </div>
        <div style={{ margin: 8 }}>
          {journey.days.map(day => {
            return (
              <div key={day.id}>
                <div>{`Day #${day.dayNumber}`}</div>
                <div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '150px 1fr',
                    }}
                  >
                    <label>Title</label>
                    <span>{journey.title}</span>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '150px 1fr',
                    }}
                  >
                    <label>Description</label>
                    <span>{journey.description}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default observer(ViewJourney);
