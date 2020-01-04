import React, { useContext } from 'react';
import { observer, useObservable } from 'mobx-react-lite';
import styled from 'styled-components';
import TrashCanIcon from 'mdi-react/TrashCanIcon';
import ChevronLeftIcon from 'mdi-react/ChevronLeftIcon';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';

import { post } from '../../util/fetch';
import { getResizedImages } from '../../util/image';
import { OutlineButton } from '../button';
import FileSelectButton from '../file-select-button';
import { TextField, TextArea } from '../input';
import { HeadingContainer, HeadingActionContainer } from '../heading';
import HorizontalList from '../horizontal-list';
import JourneyContext from '../../contexts/journey';
import Loader from '../loader';

const CaptureContainer = styled.div`
  display: grid;
  grid-template-rows: 40px 200px 1fr 1fr;
  grid-row-gap: 8px;
  margin: 8px;
  width: auto;
`;

const ActionContainer = styled.div`
  display: flex;

  > *:not(:last-child) {
    margin-right: 8px;
  }
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

const UploadActionContainer = styled.div`
  display: flex;
  align-items: center;

  > *:not(:last-child) {
    margin-right: 8px;
  }
`;

function GemCapturesForm({
  gemCaptures,
  addGemCaptures,
  removeGemCapture,
  moveGemCaptureLeft,
  moveGemCaptureRight,
}) {
  const { journeyId } = useContext(JourneyContext);
  const state = useObservable({
    isUploading: false,
  });

  const onSelectFile = async files => {
    try {
      state.isUploading = true;

      const resizedImages = await getResizedImages(Object.values(files));

      const formData = new FormData();
      formData.append('journeyId', journeyId);
      resizedImages.forEach(file => {
        formData.append(file.name, file);
      });

      const { data } = await post('/api/gem-captures/file', formData);

      addGemCaptures(...data.images.map(image => ({ url: image })));
    } catch (e) {
      console.log(e);
    } finally {
      state.isUploading = false;
    }
  };

  return (
    <div>
      <HeadingContainer>
        <div>Captures</div>
        <HeadingActionContainer>
          <UploadActionContainer>
            <FileSelectButton
              multiple
              onSelect={onSelectFile}
              disabled={state.isUploading}
            >
              Upload captures
            </FileSelectButton>
            {state.isUploading && <Loader width={24} height={24} />}
          </UploadActionContainer>
        </HeadingActionContainer>
      </HeadingContainer>
      <HorizontalList items={gemCaptures} noItemsLabel="No captures">
        {(gemCapture, index) => {
          const moveLeftDisabled = index <= 0;
          const moveRightDisabled = index >= gemCaptures.length - 1;
          const onRemove = () =>
            removeGemCapture(gemCapture.sequenceNumber - 1);
          const onMoveLeft = () => {
            if (!moveLeftDisabled) {
              moveGemCaptureLeft(index);
            }
          };
          const onMoveRight = () => {
            if (!moveRightDisabled) {
              moveGemCaptureRight(index);
            }
          };
          const stopPropagation = e => e.stopPropagation();

          return (
            <CaptureContainer key={gemCapture.sequenceNumber}>
              <ActionContainer>
                <OutlineButton
                  disabled={moveLeftDisabled}
                  variant="default"
                  onClick={onMoveLeft}
                  onMouseDown={stopPropagation}
                >
                  <ChevronLeftIcon />
                </OutlineButton>
                <OutlineButton
                  disabled={moveRightDisabled}
                  variant="default"
                  onClick={onMoveRight}
                  onMouseDown={stopPropagation}
                >
                  <ChevronRightIcon />
                </OutlineButton>
                <OutlineButton
                  variant="danger"
                  onClick={onRemove}
                  onMouseDown={stopPropagation}
                >
                  <TrashCanIcon />
                </OutlineButton>
              </ActionContainer>
              <ImageContainer>
                <Image src={gemCapture.url} draggable={false} />
              </ImageContainer>
              <TextField
                label="Title"
                name="title"
                value={gemCapture.title}
                onChange={gemCapture.onFieldChange}
                onMouseDown={stopPropagation}
                error={gemCapture.errors.title}
              />
              <TextArea
                label="Description"
                name="description"
                value={gemCapture.description}
                onChange={gemCapture.onFieldChange}
                onMouseDown={stopPropagation}
                error={gemCapture.errors.description}
              />
            </CaptureContainer>
          );
        }}
      </HorizontalList>
    </div>
  );
}

export default observer(GemCapturesForm);
