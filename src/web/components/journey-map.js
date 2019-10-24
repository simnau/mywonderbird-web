import React from 'react';
import { Layer, Feature } from 'react-mapbox-gl';
import { observer, useObservable } from 'mobx-react-lite';

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

function JourneyMap({ journey, onClick, onClickEnabled }) {
  const coordinates = getJourneyCoordinates(journey);
  const zoom = useObservable([15]);

  const onClickHandler = onClickEnabled ? onClick : undefined;

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
        zoom={zoom}
        onClick={onClickHandler}
      >
        {coordinates.map((dayCoordinates, index) => {
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
