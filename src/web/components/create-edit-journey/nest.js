import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { OutlineButton } from '../button';
import { TextField, TextArea } from '../input';
import {
  HeadingContainer,
  HeadingActionContainer,
} from '../heading';
import JourneyContext from '../../contexts/journey';

const FormContainer = styled.div`
  display: grid;
  grid-row-gap: 16px;
`;

function NestForm({ nest, addNest, removeNest }) {
  const {
    selectedNest,
    selectNestLocationOnMap,
    cancelSelectNestLocationOnMap,
  } = useContext(JourneyContext);

  return (
    <div style={{ margin: 8 }}>
      <HeadingContainer>
        <div>Nest</div>
        <HeadingActionContainer>
          {!nest && (
            <OutlineButton variant="primary" onClick={addNest}>
              Add nest
            </OutlineButton>
          )}
          {!!nest && (
            <>
              {!selectedNest && (
                <OutlineButton
                  variant="primary"
                  onClick={() => selectNestLocationOnMap(nest)}
                >
                  Select location on map
                </OutlineButton>
              )}
              {!!selectedNest && (
                <OutlineButton
                  variant="danger"
                  onClick={cancelSelectNestLocationOnMap}
                >
                  Cancel select location
                </OutlineButton>
              )}
              <OutlineButton variant="danger" onClick={removeNest}>
                Remove nest
              </OutlineButton>
            </>
          )}
        </HeadingActionContainer>
      </HeadingContainer>
      {!nest && <div>No nest</div>}
      {!!nest && (
        <FormContainer>
          <TextField
            label="Title"
            name="title"
            value={nest.title}
            onChange={nest.onFieldChange}
          />
          <TextArea
            label="Description"
            name="description"
            value={nest.description}
            onChange={nest.onFieldChange}
          />
          <TextField
            label="Latitude"
            name="lat"
            value={nest.lat}
            onChange={nest.onFieldChange}
          />
          <TextField
            label="Longitude"
            name="lng"
            value={nest.lng}
            onChange={nest.onFieldChange}
          />
          <TextField
            label="Platform"
            name="platform"
            value={nest.platform}
            onChange={nest.onFieldChange}
          />
          <TextField
            label="Id On Platform"
            name="idOnPlatform"
            value={nest.idOnPlatform}
            onChange={nest.onFieldChange}
          />
        </FormContainer>
      )}
    </div>
  );
}

export default observer(NestForm);
