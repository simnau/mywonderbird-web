import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '../../../../components/button';

const FieldContainer = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  padding: 8px;
`;

const Label = styled.div`
  font-weight: bold;
  margin-right: 8px
`;

function PlaceListItem({ place, deletePlace, editLink }) {
  const onDelete = () => {
    deletePlace(place.id);
  };

  return (
    <div
      style={{
        margin: '8px 0',
        padding: 8,
        border: '1px solid lightgray',
        display: 'grid',
        gridColumnGap: 8,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 75px',
          alignItems: 'center',
        }}
      >
        <div>
          <FieldContainer>
            <Label>
              Title
            </Label>
            <span>{place.title}</span>
          </FieldContainer>
          <FieldContainer>
            <Label>
              Country
            </Label>
            <span>{place.country}</span>
          </FieldContainer>
          <FieldContainer>
            <Label>
              Coordinates
            </Label>
            <span>{`${place.lat}, ${place.lng}`}</span>
          </FieldContainer>
          <FieldContainer>
            <Label>
              Tags
            </Label>
            <span>{place.placeTags.map(placeTag => placeTag.tag ? placeTag.tag.title : '-').join(', ')}</span>
          </FieldContainer>
          <FieldContainer>
            <Label>
              Image count
            </Label>
            <span>{place.placeImages.length}</span>
          </FieldContainer>
        </div>
        <div style={{ display: 'grid', gridRowGap: 8, alignSelf: 'start' }}>
          <Button variant="primary" as={Link} to={editLink}>
            Edit
          </Button>s
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PlaceListItem;
