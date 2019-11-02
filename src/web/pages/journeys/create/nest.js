import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { OutlineButton } from '../../../components/button';
import { Input, TextArea } from '../../../components/input';
import {
  HeadingContainer,
  HeadingActionContainer,
} from '../../../components/heading';

const FormContainer = styled.div`
  display: grid;
  grid-row-gap: 16px;
`;

function NestForm({ nest, addNest, removeNest }) {
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
            <OutlineButton variant="danger" onClick={removeNest}>
              Remove nest
            </OutlineButton>
          )}
        </HeadingActionContainer>
      </HeadingContainer>
      {!nest && <div>No nest</div>}
      {!!nest && (
        <FormContainer>
          <Input
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
          <Input
            label="Latitude"
            name="lat"
            value={nest.lat}
            onChange={nest.onFieldChange}
          />
          <Input
            label="Longitude"
            name="lng"
            value={nest.lng}
            onChange={nest.onFieldChange}
          />
          <Input
            label="Platform"
            name="platform"
            value={nest.platform}
            onChange={nest.onFieldChange}
          />
          <Input
            label="Id On Platform"
            name="Platform"
            value={nest.Platform}
            onChange={nest.onFieldChange}
          />
        </FormContainer>
      )}
    </div>
  );
}

export default observer(NestForm);
