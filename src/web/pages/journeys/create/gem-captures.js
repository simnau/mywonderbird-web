import React from 'react';
import { observer } from 'mobx-react-lite';

function GemCapturesForm({ gemCaptures, addGemCapture, removeGemCapture }) {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div>Captures</div>
        <button onClick={addGemCapture}>Add capture</button>
      </div>
      {gemCaptures.map((gemCapture, index) => {
        return (
          <div key={gemCapture.sequenceNumber} style={{ margin: 8 }}>
            <div style={{ display: 'flex' }}>
              <div>{`Capture #${gemCapture.sequenceNumber}`}</div>
              <button onClick={() => removeGemCapture(index)}>
                Remove
              </button>
            </div>
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
                value={gemCapture.title}
                onChange={gemCapture.onFieldChange}
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
                value={gemCapture.description}
                onChange={gemCapture.onFieldChange}
              />
            </div>
            <div
              style={{
                margin: 8,
                display: 'grid',
                gridTemplateColumns: '100px 200px',
              }}
            >
              <label>URL</label>
              <input
                name="url"
                value={gemCapture.url}
                onChange={gemCapture.onFieldChange}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default observer(GemCapturesForm);
