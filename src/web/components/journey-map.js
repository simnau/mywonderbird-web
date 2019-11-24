import React from 'react';
import { Layer, Feature, Marker, ZoomControl } from 'react-mapbox-gl';
import { observer, useObservable } from 'mobx-react-lite';

import ImageMarker from './image-marker';
import { getJourneyCoordinates } from '../util/journey';
import { findDayCoordinateBoundingBox } from '../util/coordinates';
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
  const state = useObservable({
    zoom: [7],
  });

  const onClickHandler = onClickEnabled ? onClick : undefined;

  const onStyleLoad = map => {
    const boundingBox = findDayCoordinateBoundingBox(coordinates);
    if (boundingBox) {
      map.fitBounds(boundingBox);
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
        zoom={state.zoom}
        onClick={onClickHandler}
        onStyleLoad={onStyleLoad}
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
        <ZoomControl />
      </Map>
    </div>
  );
}

export default observer(JourneyMap);
