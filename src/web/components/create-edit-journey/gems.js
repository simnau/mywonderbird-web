import React, { useContext } from 'react';
import { observer, useObservable } from 'mobx-react-lite';
import styled from 'styled-components';

import { post } from '../../util/fetch';
import { getResizedImagesAndCoordinates } from '../../util/image';
import FileSelectButton from '../file-select-button';
import { TextField, TextArea } from '../input';
import { OutlineButton } from '../button';
import { HeadingContainer, HeadingActionContainer } from '../heading';
import JourneyContext from '../../contexts/journey';
import GemCaptureForm from './gem-captures';
import Loader from '../loader';

const FormContainer = styled.div`
  display: grid;
  grid-row-gap: 16px;
  margin-bottom: 8px;
`;

const UploadActionContainer = styled.div`
  display: flex;
  align-items: center;

  > *:not(:last-child) {
    margin-right: 8px;
  }
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
  const state = useObservable({
    isUploading: false,
  });

  const onSelectFile = async files => {
    try {
      state.isUploading = true;

      const {
        coordinates,
        resizedImages,
      } = await getResizedImagesAndCoordinates(Object.values(files));

      const formData = new FormData();
      formData.append('journeyId', journeyId);
      resizedImages.forEach(file => {
        formData.append(file.name, file);
      });

      const { data } = await post('/api/gem-captures/file', formData);

      createGem({
        lat: coordinates && coordinates.lat,
        lng: coordinates && coordinates.lng,
        gemCaptures: data.images.map(image => ({
          url: image,
        })),
      });
    } catch (e) {
      console.log(e);
    } finally {
      state.isUploading = false;
    }
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
          <UploadActionContainer>
            <FileSelectButton
              multiple
              onSelect={onSelectFile}
              disabled={state.isUploading}
            >
              Create from capture
            </FileSelectButton>
            {state.isUploading && <Loader width={24} height={24} />}
          </UploadActionContainer>
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
