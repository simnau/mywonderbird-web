import React from 'react';
import styled from 'styled-components';
import { useObservable, observer } from 'mobx-react-lite';
import ChevronLeft from 'mdi-react/ChevronLeftIcon';
import ChevronRight from 'mdi-react/ChevronRightIcon';

import { OutlineButton } from './button';

const Container = styled.div``;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  > *:not(:last-child) {
    margin-right: 8px;
  }
`;

const ItemContainer = styled.div``;

function PagedList({ children, items }) {
  const state = useObservable({
    currentPage: 0,
  });
  const isPreviousEnabled = state.currentPage > 0;
  const isNextEnabled = state.currentPage < items.length - 1;
  const currentItem = items[state.currentPage];

  const onPreviousClick = () => {
    if (isPreviousEnabled) {
      state.currentPage -= 1;
    }
  };

  const onNextClick = () => {
    if (isNextEnabled) {
      state.currentPage += 1;
    }
  };

  const onRemove = () => {
    if (state.currentPage === items.length - 1) {
      state.currentPage -= 1;
    }
  };

  return (
    <Container>
      <PaginationContainer>
        <OutlineButton disabled={!isPreviousEnabled} onClick={onPreviousClick}>
          <ChevronLeft size="24px"/>
        </OutlineButton>
        <OutlineButton disabled={!isNextEnabled} onClick={onNextClick}>
          <ChevronRight size="24px" />
        </OutlineButton>
        <div>
          {state.currentPage + 1} of {items.length}
        </div>
      </PaginationContainer>
      {currentItem && (
        <ItemContainer>
          {children({ currentItem, itemCount: items.length, onRemove })}
        </ItemContainer>
      )}
    </Container>
  );
}

export default observer(PagedList);
