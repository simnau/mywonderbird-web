import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { observer, useObservable } from 'mobx-react-lite';
import ChevronLeft from 'mdi-react/ChevronLeftIcon';
import ChevronRight from 'mdi-react/ChevronRightIcon';

import { OutlineButton } from './button';

const ListContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 50px 1fr 50px;
  grid-column-gap: 8px;
  align-items: center;
`;

const ButtonContainer = styled.div``;

const DraggableContainer = styled.div`
  max-width: 100%;
  overflow-x: hidden;
`;

const ItemsContainer = styled.div`
  display: flex;
  position: relative;
`;

const ItemContainer = styled.div`
  flex: 0;
`;

const NoItemsContainer = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px dashed lightgray;
  border-radius: 4px;
`;

function HorizontalList({ children, items, noItemsLabel = 'No items' }) {
  const state = useObservable({
    isDragging: false,
    lastX: 0,
    offset: 0,
  });
  const draggableContainerRef = useRef();
  const itemContainerRef = useRef();

  const onDragStart = event => {
    state.isDragging = true;
    state.lastX = event.nativeEvent.clientX;
  };

  const onDrag = event => {
    if (state.isDragging) {
      const deltaX = state.lastX - event.clientX;
      if (deltaX > 0) {
        const maxOffset =
          itemContainerRef.current.scrollWidth -
          draggableContainerRef.current.offsetWidth;
        state.offset = Math.max(-maxOffset, state.offset - deltaX);
      } else {
        state.offset = Math.min(0, state.offset - deltaX);
      }
      state.lastX = event.clientX;
    }
  };

  const onDragEnd = () => {
    state.isDragging = false;
    state.lastOffset = state.offset;
  };

  const onPrevious = () => {
    const offsetBy = draggableContainerRef.current.offsetWidth;

    state.offset = Math.min(0, state.offset + offsetBy);
  };

  const onNext = () => {
    const offsetBy = draggableContainerRef.current.offsetWidth;
    const maxOffset =
      itemContainerRef.current.scrollWidth -
      draggableContainerRef.current.offsetWidth;

    state.offset = Math.max(-maxOffset, state.offset - offsetBy);
  };

  useEffect(() => {
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onDragEnd);

    return () => {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', onDragEnd);
    };
  }, []);

  if (!items.length) {
    return <NoItemsContainer>{noItemsLabel}</NoItemsContainer>;
  }

  return (
    <ListContainer>
      <ButtonContainer>
        <OutlineButton onClick={onPrevious}>
          <ChevronLeft size="24px" />
        </OutlineButton>
      </ButtonContainer>
      <DraggableContainer onMouseDown={onDragStart} ref={draggableContainerRef}>
        <ItemsContainer
          ref={itemContainerRef}
          style={{ transform: `translateX(${state.offset}px)` }}
        >
          {items.map((item, index) => {
            return (
              <ItemContainer key={index}>{children(item, index)}</ItemContainer>
            );
          })}
        </ItemsContainer>
      </DraggableContainer>
      <ButtonContainer>
        <OutlineButton onClick={onNext}>
          <ChevronRight size="24px" />
        </OutlineButton>
      </ButtonContainer>
    </ListContainer>
  );
}

export default observer(HorizontalList);
