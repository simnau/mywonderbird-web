import React from 'react';
import styled from 'styled-components';

import { Button } from '../components/button';

const Container = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 16px;

  > :not(:last-child) {
    margin-right: 8px;
  }
`;

function Pagination({ page, total, pageSize, onPageSelect }) {
  const pageCount = Math.ceil(total / pageSize);

  const onPrevious = () => {
    if (page <= 1) {
      return;
    }

    onPageSelect(page - 1);
  };

  const onNext = () => {
    if (page >= pageCount) {
      return;
    }

    onPageSelect(page + 1);
  };

  return (
    <Container>
      <Button disabled={page <= 1} onClick={onPrevious}>
        Previous
      </Button>
      {Array.from({ length: pageCount }).map((_, pageIndex) => {
        return (
          <Button
            key={pageIndex}
            variant={pageIndex + 1 === page ? 'primary' : null}
            onClick={() => {
              onPageSelect(pageIndex + 1);
            }}
          >
            {pageIndex + 1}
          </Button>
        );
      })}
      <Button disabled={page >= pageCount} onClick={onNext}>
        Next
      </Button>
    </Container>
  );
}

export default Pagination;
