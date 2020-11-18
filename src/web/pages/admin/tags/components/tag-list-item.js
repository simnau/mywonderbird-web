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

function TagListItem({ tag, deleteTag, editLink }) {
  const onDelete = () => {
    deleteTag(tag.id);
  };

  const openImage = () => {
    window.open(tag.imageUrl);
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
            <span>{tag.title}</span>
          </FieldContainer>
          <FieldContainer>
            <Label>Code</Label>
            <span>{tag.code}</span>
          </FieldContainer>
        </div>
        <div
          style={{
            alignSelf: 'stretch',
          }}
        >
          <Label style={{ marginBottom: 8 }}>Tag image</Label>
          <ImageContainer>
            <img
              onClick={openImage}
              src={tag.imageUrl}
              style={{
                width: 100,
                height: 100,
                objectFit: 'cover',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            />
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

export default TagListItem;
