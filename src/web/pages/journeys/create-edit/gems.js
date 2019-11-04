import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { post } from '../../../util/fetch';
import FileSelectButton from '../../../components/file-select-button';
import { Input, TextArea } from '../../../components/input';
import { OutlineButton } from '../../../components/button';
import {
  HeadingContainer,
  HeadingActionContainer,
} from '../../../components/heading';
import JourneyContext from '../../../contexts/journey';
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
    const formData = new FormData();
    formData.append('journeyId', journeyId);
    Object.entries(files).forEach(([, file]) => {
      formData.append(file.name, file);
    });

    const response = await post('/api/gem-captures/file', formData);
    const data = response.data;

    createGem({
      lat: data.latLng && data.latLng.lat,
      lng: data.latLng && data.latLng.lng,
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
                    <OutlineButton
                      variant="danger"
                      onClick={cancelSelectOnMap}
                    >
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
                <Input
                  label="Title"
                  name="title"
                  value={gem.title}
                  onChange={gem.onFieldChange}
                />
                <TextArea
                  label="Description"
                  name="description"
                  value={gem.description}
                  onChange={gem.onFieldChange}
                />
                <Input
                  label="Latitude"
                  name="lat"
                  value={gem.lat}
                  onChange={gem.onFieldChange}
                />
                <Input
                  label="Longitude"
                  name="lng"
                  value={gem.lng}
                  onChange={gem.onFieldChange}
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
