import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { post } from '../../util/fetch';
import { getResizedImagesAndCoordinates } from '../../util/image';
import FileSelectButton from '../file-select-button';
import { TextField, TextArea } from '../input';
import { OutlineButton } from '../button';
import { HeadingContainer, HeadingActionContainer } from '../heading';
import JourneyContext from '../../contexts/journey';
import GemCaptureForm from './gem-captures';

const FormContainer = styled.div`
  display: grid;
  grid-row-gap: 16px;
  margin-bottom: 8px;
`;

function GemsForm({ gems, addGem, createGem, removeGem }) {
  const {
    selectedGem,
    selectOnMap,
    cancelSelectOnMap,
    selectedDay,
    cancelAddGemFromMap,
    journeyId,
  } = useContext(JourneyContext);

  const onSelectFile = async files => {
    const {
      coordinates,
      resizedImages,
    } = await getResizedImagesAndCoordinates(Object.values(files));

    const formData = new FormData();
    formData.append('journeyId', journeyId);
    resizedImages.forEach(file => {
      formData.append(file.name, file);
    });

    const response = await post('/api/gem-captures/file', formData);
    const data = response.data;

    createGem({
      lat: coordinates && coordinates.lat,
      lng: coordinates && coordinates.lng,
      gemCaptures: data.images.map(image => ({
        url: image,
      })),
    });
  };

  return (
    <div style={{ margin: 8 }}>
      <HeadingContainer>
        <div>Gems</div>
        <HeadingActionContainer>
          {!selectedDay && (
            <OutlineButton variant="primary" onClick={addGem}>
              Create gem from map
            </OutlineButton>
          )}
          {!!selectedDay && (
            <OutlineButton variant="danger" onClick={cancelAddGemFromMap}>
              Cancel create gem
            </OutlineButton>
          )}
          <FileSelectButton multiple onSelect={onSelectFile}>
            Create from capture
          </FileSelectButton>
        </HeadingActionContainer>
      </HeadingContainer>
      <div>
        {gems.map((gem, index) => {
          return (
            <div key={gem.sequenceNumber}>
              <HeadingContainer>
                <div>{`Gem #${gem.sequenceNumber}`}</div>
                <HeadingActionContainer>
                  {!selectedGem && (
                    <OutlineButton
                      variant="primary"
                      onClick={() => selectOnMap(gem)}
                    >
                      Select coordinates on map
                    </OutlineButton>
                  )}
                  {!!selectedGem && (
                    <OutlineButton variant="danger" onClick={cancelSelectOnMap}>
                      Cancel select coordinates
                    </OutlineButton>
                  )}
                  <OutlineButton
                    variant="danger"
                    onClick={() => removeGem(index)}
                  >
                    Remove
                  </OutlineButton>
                </HeadingActionContainer>
              </HeadingContainer>
              <FormContainer>
                <TextField
                  required
                  label="Title"
                  name="title"
                  value={gem.title}
                  onChange={gem.onFieldChange}
                  error={gem.errors.title}
                />
                <TextArea
                  label="Description"
                  name="description"
                  value={gem.description}
                  onChange={gem.onFieldChange}
                  error={gem.errors.description}
                />
                <TextField
                  required
                  label="Latitude"
                  name="lat"
                  value={gem.lat}
                  onChange={gem.onFieldChange}
                  error={gem.errors.lat}
                />
                <TextField
                  required
                  label="Longitude"
                  name="lng"
                  value={gem.lng}
                  onChange={gem.onFieldChange}
                  error={gem.errors.lng}
                />
              </FormContainer>
              <GemCaptureForm
                gemCaptures={gem.gemCaptures}
                addGemCaptures={gem.addGemCaptures}
                removeGemCapture={gem.removeGemCapture}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default observer(GemsForm);
