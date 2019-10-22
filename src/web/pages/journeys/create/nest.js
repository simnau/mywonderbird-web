import React from 'react';
import { observer } from 'mobx-react-lite';

function NestForm({ nest, addNest, removeNest }) {
  return (
    <div style={{ margin: 8 }}>
      <div style={{ display: 'flex' }}>
        <div>Nest</div>
        {!nest && <button onClick={addNest}>Add nest</button>}
        {!!nest && <button onClick={removeNest}>Remove nest</button>}
      </div>
      {!nest && <div>No nest</div>}
      {!!nest && (
        <div>
          <div
            style={{
              margin: 8,
              display: 'grid',
              gridTemplateColumns: '100px 200px',
            }}
          >
            <label>Title</label>
            <input
              name="title"
              value={nest.title}
              onChange={nest.onFieldChange}
            />
          </div>
          <div
            style={{
              margin: 8,
              display: 'grid',
              gridTemplateColumns: '100px 200px',
            }}
          >
            <label>Description</label>
            <textarea
              name="description"
              value={nest.description}
              onChange={nest.onFieldChange}
            />
          </div>
          <div
            style={{
              margin: 8,
              display: 'grid',
              gridTemplateColumns: '100px 200px',
            }}
          >
            <label>Latitude</label>
            <input
              name="lat"
              value={nest.lat}
              onChange={nest.onFieldChange}
            />
          </div>
          <div
            style={{
              margin: 8,
              display: 'grid',
              gridTemplateColumns: '100px 200px',
            }}
          >
            <label>Longitude</label>
            <input
              name="lng"
              value={nest.lng}
              onChange={nest.onFieldChange}
            />
          </div>
          <div
            style={{
              margin: 8,
              display: 'grid',
              gridTemplateColumns: '100px 200px',
            }}
          >
            <label>Platform</label>
            <input
              name="platform"
              value={nest.platform}
              onChange={nest.onFieldChange}
            />
          </div>
          <div
            style={{
              margin: 8,
              display: 'grid',
              gridTemplateColumns: '100px 200px',
            }}
          >
            <label>Id On Platform</label>
            <input
              name="idOnPlatform"
              value={nest.idOnPlatform}
              onChange={nest.onFieldChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default observer(NestForm);
