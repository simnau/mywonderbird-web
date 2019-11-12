import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { post } from '../../util/fetch';
import { OutlineButton } from '../button';
import FileSelectButton from '../file-select-button';
import { TextField, TextArea } from '../input';
import {
  HeadingContainer,
  HeadingActionContainer,
} from '../heading';
import VerticalList from '../horizontal-list';
import JourneyContext from '../../contexts/journey';

const CaptureContainer = styled.div`
  display: grid;
  grid-template-rows: 40px 200px 1fr 1fr;
  grid-row-gap: 8px;
  margin: 8px;
  width: auto;
`;

const ImageContainer = styled.div`
  height: 100%;
  width: fit-content;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  min-width: 300px;
  height: 100%;
  user-select: none;
`;

function GemCapturesForm({ gemCaptures, addGemCaptures, removeGemCapture }) {
  const { journeyId } = useContext(JourneyContext);

  const onSelectFile = async files => {
    const formData = new FormData();
    formData.append('journeyId', journeyId);
    Object.entries(files).forEach(([, file]) => {
      formData.append(file.name, file);
    });

    const response = await post('/api/gem-captures/file', formData);
    const data = response.data;

    addGemCaptures(...data.images.map(image => ({ url: image })));
  };

  return (
    <div>
      <HeadingContainer>
        <div>Captures</div>
        <HeadingActionContainer>
          <FileSelectButton multiple onSelect={onSelectFile}>
            Upload captures
          </FileSelectButton>
        </HeadingActionContainer>
      </HeadingContainer>
      <VerticalList items={gemCaptures} noItemsLabel="No captures">
        {gemCapture => {
          return (
            <CaptureContainer key={gemCapture.sequenceNumber}>
              <OutlineButton
                variant="danger"
                onClick={() => removeGemCapture(gemCapture.sequenceNumber - 1)}
              >
                Remove
              </OutlineButton>
              <ImageContainer>
                <Image src={gemCapture.url} draggable={false} />
              </ImageContainer>
              <TextField
                label="Title"
                name="title"
                value={gemCapture.title}
                onChange={gemCapture.onFieldChange}
                error={gemCapture.errors.title}
              />
              <TextArea
                label="Description"
                name="description"
                value={gemCapture.description}
                onChange={gemCapture.onFieldChange}
                error={gemCapture.errors.description}
              />
            </CaptureContainer>
          );
        }}
      </VerticalList>
    </div>
  );
}

export default observer(GemCapturesForm);
