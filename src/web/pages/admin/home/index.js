import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <div>Home</div>
      <div>
        <Link to="/admin/journeys">Journeys</Link>
      </div>
    </div>
  );
}
