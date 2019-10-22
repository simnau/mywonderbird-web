import React from 'react';
import { Layer, Feature } from 'react-mapbox-gl';
import { observer } from 'mobx-react-lite';

import { getJourneyCoordinates } from '../util/journey';
import Map from './mapbox';

const lineLayout = {
  'line-cap': 'round',
  'line-join': 'round',
};

const linePaint = {
  'line-color': '#4790E5',
  'line-width': 8,
};

function JourneyMap({ journey }) {
  const coordinates = getJourneyCoordinates(journey);
  console.log(coordinates);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Map
        style="mapbox://styles/mapbox/satellite-v9"
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
        center={coordinates && coordinates.length && coordinates[0] ? coordinates[0][0] : undefined}
        zoom={[18]}
      >
        {coordinates.map((dayCoordinates, index) => {
          console.log(dayCoordinates);
          return (
            <Layer key={index} type="line" layout={lineLayout} paint={linePaint}>
              <Feature coordinates={dayCoordinates} />
            </Layer>
          );
        })}
      </Map>
    </div>
  );
}

export default observer(JourneyMap);
