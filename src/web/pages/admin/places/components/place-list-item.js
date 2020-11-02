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
  margin-right: 8px;
`;

const ImageContainer = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(auto-fill, 100px);
`;

function PlaceListItem({ place, deletePlace, editLink }) {
  const onDelete = () => {
    deletePlace(place.id);
  };

  const openImage = (url) => {
    window.open(url);
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
          gridTemplateColumns: '1fr 1fr 75px',
          alignItems: 'center',
        }}
      >
        <div>
          <FieldContainer>
            <Label>Title</Label>
            <span>{place.title}</span>
          </FieldContainer>
          <FieldContainer>
            <Label>Country</Label>
            <span>{place.country}</span>
          </FieldContainer>
          <FieldContainer>
            <Label>Coordinates</Label>
            <span>{`${place.lat}, ${place.lng}`}</span>
          </FieldContainer>
          <FieldContainer>
            <Label>Tags</Label>
            <span>
              {place.placeTags
                .map(placeTag => (placeTag.tag ? placeTag.tag.title : '-'))
                .join(', ')}
            </span>
          </FieldContainer>
        </div>
        <div
          style={{
            alignSelf: 'stretch',
          }}
        >
          <Label style={{ marginBottom: 8 }}>{`Images (${place.placeImages.length})`}</Label>
          <ImageContainer>
            {place.placeImages.map((placeImage) => {
              return (
                <img
                  onClick={() => openImage(placeImage.url)}
                  key={placeImage.id}
                  src={placeImage.url}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                />
              );
            })}
          </ImageContainer>
        </div>
        <div style={{ display: 'grid', gridRowGap: 8, alignSelf: 'start' }}>
          <Button variant="primary" as={Link} to={editLink}>
            Edit
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PlaceListItem;
