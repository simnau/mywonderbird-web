import React from 'react';
import { Link } from 'react-router-dom';

function JourneyListItem({ journey, deleteJourney }) {
  const onDelete = () => {
    deleteJourney(journey.id);
  };

  return (
    <div style={{ padding: 8, border: '1px solid black' }}>
      <div style={{ display: 'flex' }}>
        <div>
          <label>Title</label>
          <span>{journey.title}</span>
        </div>
        <div>
          <Link to={`/journeys/${journey.id}`}>View</Link>
          <Link to={`/journeys/${journey.id}/edit`}>Edit</Link>
        </div>
        <div>
          <button onClick={onDelete}>Delete</button>
        </div>
      </div>
      <div>
        <label>Description</label>
        <span>{journey.description}</span>
      </div>
      <div>
        <label>Type</label>
        <span>{journey.type}</span>
      </div>
      <div>
        <label>Start Date</label>
        <span>{journey.startDate}</span>
      </div>
    </div>
  );
}

export default JourneyListItem;
