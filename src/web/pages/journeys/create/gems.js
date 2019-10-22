import React from 'react';
import { observer } from 'mobx-react-lite';

import GemCaptureForm from './gem-captures';

function GemsForm({ gems, addGem, removeGem }) {
  return (
    <div style={{ margin: 8 }}>
      <div style={{ display: 'flex' }}>
        <div>Gems</div>
        <button onClick={addGem}>Add gem</button>
      </div>
      <div>
        {gems.map((gem, index) => {
          return (
            <div key={gem.sequenceNumber}>
              <div style={{ display: 'flex' }}>
                <div>{`Gem #${gem.sequenceNumber}`}</div>
                <button onClick={() => removeGem(index)}>Remove</button>
              </div>
              <div style={{ margin: 8 }}>
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
                    value={gem.title}
                    onChange={gem.onFieldChange}
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
                    value={gem.description}
                    onChange={gem.onFieldChange}
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
                    value={gem.lat}
                    onChange={gem.onFieldChange}
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
                    value={gem.lng}
                    onChange={gem.onFieldChange}
                  />
                </div>
              </div>
              <GemCaptureForm
                gemCaptures={gem.gemCaptures}
                addGemCapture={gem.addGemCapture}
                removeGemCapture={gem.removeGemCapture}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default observer(GemsForm);
