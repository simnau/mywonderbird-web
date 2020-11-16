import React from 'react';
import { Marker } from 'react-mapbox-gl';
import { useObservable, observer } from 'mobx-react-lite';

import ImageMarker from '../../../../components/image-marker';
import Map from '../../../../components/mapbox';

function LocationMap({ onClick, location }) {
  const state = useObservable({
    zoom: [7],
  });

  const extraParams = {};

  if (location) {
    extraParams.center = { lat: location.lat, lng: location.lng };
  }

  return (
    <Map
      style="mapbox://styles/mapbox/streets-v9"
      containerStyle={{
        height: '100%',
        width: '100%',
        cursor: 'pointer',
      }}
      onClick={onClick}
      zoom={state.zoom}
      {...extraParams}
    >
      {location && (
        <Marker coordinates={location} anchor="center">
          <ImageMarker />
        </Marker>
      )}
    </Map>
  );
}

export default observer(LocationMap);
