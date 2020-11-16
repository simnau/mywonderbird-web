import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { Button } from '../../../../components/button';
import FileSelectButton from '../../../../components/file-select-button';

const ImageContainer = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(auto-fill, 100px);
`;

function Images({
  images,
  onImagesSelected,
  onRemoveImage,
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 14,
          color: 'gray',
          fontWeight: 'bold',
          marginBottom: 4,
        }}
      >
        Place Images
      </div>
      <ImageContainer>
        {images.map((image, index) => {
          return (
            <div
              key={image.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
              }}
            >
              <img
                key={image.id}
                src={image.isNew ? image.preview : image.url}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: 'cover',
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
              <Button
                variant="danger"
                type="button"
                onClick={() => onRemoveImage(index)}
              >
                Remove
              </Button>
            </div>
          );
        })}
        <FileSelectButton
          onSelect={onImagesSelected}
          multiple
        >
          Add image(s)
        </FileSelectButton>
      </ImageContainer>
    </div>
  );
}

export default observer(Images);
