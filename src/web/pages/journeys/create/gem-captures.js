import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { post } from '../../../util/fetch';
import { OutlineButton } from '../../../components/button';
import FileSelectButton from '../../../components/file-select-button';
import { Input, TextArea } from '../../../components/input';
import {
  HeadingContainer,
  HeadingActionContainer,
} from '../../../components/heading';
import VerticalList from '../../../components/horizontal-list';

const CaptureContainer = styled.div`
  display: grid;
  grid-template-rows: 40px 200px 60px 60px;
  grid-template-columns: minmax(1fr, 400px);
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
  const onSelectFile = async files => {
    const formData = new FormData();
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
              <Input
                label="Title"
                name="title"
                value={gemCapture.title}
                onChange={gemCapture.onFieldChange}
              />
              <TextArea
                label="Description"
                name="description"
                value={gemCapture.description}
                onChange={gemCapture.onFieldChange}
              />
            </CaptureContainer>
          );
        }}
      </VerticalList>
    </div>
  );
}

export default observer(GemCapturesForm);
