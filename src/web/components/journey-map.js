import React from 'react';
import { Layer, Feature, Marker } from 'react-mapbox-gl';
import { observer, useObservable } from 'mobx-react-lite';

import ImageMarker from './image-marker';
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
          const { day, coordinates } = dayCoordinates;
          return (
            <React.Fragment key={index}>
              <Layer type="line" layout={lineLayout} paint={linePaint}>
                <Feature coordinates={coordinates} />
              </Layer>
              {coordinates.map((dayCoordinate, index) => {
                return (
                  <Marker
                    key={index}
                    onClick={() => console.log('clicked', dayCoordinate)}
                    coordinates={dayCoordinate}
                    anchor="center"
                  >
                    <ImageMarker />
                  </Marker>
                );
              })}
            </React.Fragment>
          );
        })}
      </Map>
    </div>
  );
}

export default observer(JourneyMap);
