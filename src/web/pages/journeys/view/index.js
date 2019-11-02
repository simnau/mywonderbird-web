import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import JourneyMap from '../../../components/journey-map';
import useFetch from '../../../util/fetch-effect';

const FieldContainer = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
`;

function ViewJourney({ match }) {
  const { id } = match.params;
  const { data: journey, isLoading } = useFetch(`/api/journeys/${id}`, null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={{ width: '100%', height: 400, position: 'sticky', top: 64 }}>
        <JourneyMap journey={journey} />
      </div>
      <div>
        <FieldContainer>
          <label>Title</label>
          <span>{journey.title}</span>
        </FieldContainer>
        <FieldContainer>
          <label>Description</label>
          <span>{journey.description}</span>
        </FieldContainer>
        <FieldContainer>
          <label>Type</label>
          <span>{journey.type}</span>
        </FieldContainer>
        <div>
          <div>Days</div>
        </div>
        <div style={{ margin: 8 }}>
          {journey.days.map(day => {
            return (
              <div key={day.id}>
                <div>{`Day #${day.dayNumber}`}</div>
                <div>
                  <FieldContainer>
                    <label>Title</label>
                    <span>{day.title}</span>
                  </FieldContainer>
                  <FieldContainer>
                    <label>Description</label>
                    <span>{day.description}</span>
                  </FieldContainer>
                </div>
                <div style={{ marginTop: 8 }}>
                  <div>Gems</div>
                </div>
                <div>
                  {day.gems.map(gem => {
                    return (
                      <div key={gem.id}>
                        <div>{`Gem #${gem.sequenceNumber}`}</div>
                        <div>
                          <FieldContainer>
                            <label>Title</label>
                            <span>{gem.title}</span>
                          </FieldContainer>
                          <FieldContainer>
                            <label>Description</label>
                            <span>{gem.description}</span>
                          </FieldContainer>
                          <FieldContainer>
                            <label>Latitude</label>
                            <span>{gem.lat}</span>
                          </FieldContainer>
                          <FieldContainer>
                            <label>Longitude</label>
                            <span>{gem.lng}</span>
                          </FieldContainer>
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <div>Gem Captures</div>
                        </div>
                        <div style={{ display: 'flex' }}>
                          {gem.gemCaptures.map(gemCapture => {
                            return (
                              <div key={gemCapture.id}>
                                <img
                                  width={128}
                                  height={128}
                                  src={gemCapture.url}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
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
