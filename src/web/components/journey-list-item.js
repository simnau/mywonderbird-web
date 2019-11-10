import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';

import { Button } from './button';

const FieldContainer = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  padding: 8px;
`;

function JourneyListItem({ journey, deleteJourney, editLink }) {
  const onDelete = () => {
    deleteJourney(journey.id);
  };

  return (
    <div
      style={{
        margin: '8px 0',
        padding: 8,
        border: '1px solid lightgray',
        display: 'grid',
        gridColumnGap: 8,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 75px',
          alignItems: 'center',
        }}
      >
        <div>
          <FieldContainer>
            <label
              style={{
                fontWeight: 'bold',
                marginRight: 8,
              }}
            >
              Title
            </label>
            <span>{journey.title}</span>
          </FieldContainer>
          <FieldContainer>
            <label
              style={{
                fontWeight: 'bold',
                marginRight: 8,
              }}
            >
              Description
            </label>
            <span>{journey.description}</span>
          </FieldContainer>
          <FieldContainer>
            <label
              style={{
                fontWeight: 'bold',
                marginRight: 8,
              }}
            >
              Type
            </label>
            <span>{journey.type}</span>
          </FieldContainer>
          <FieldContainer>
            <label
              style={{
                fontWeight: 'bold',
                marginRight: 8,
              }}
            >
              Start Date
            </label>
            <span>{moment(journey.startDate).format('YYYY MMMM DD')}</span>
          </FieldContainer>
        </div>
        <div style={{ display: 'grid', gridRowGap: 8, alignSelf: 'start' }}>
          <Button
            variant="primary"
            as={Link}
            to={editLink}
          >
            Edit
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default JourneyListItem;
