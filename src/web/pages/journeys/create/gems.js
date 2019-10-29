import React from 'react';
import { observer } from 'mobx-react-lite';

import { post } from '../../../util/fetch';
import FileSelectButton from '../../../components/file-select-button';
import GemCaptureForm from './gem-captures';

function GemsForm({ gems, addGem, createGem, removeGem }) {
  const onSelectFile = async files => {
    const formData = new FormData();
    Object.entries(files).forEach(([, file]) => {
      formData.append(file.name, file);
    });

    const response = await post('/api/gem-captures/file', formData);
    const data = response.data;

    createGem({
      lat: data.latLng && data.latLng.lat,
      lng: data.latLng && data.latLng.lng,
      gemCaptures: data.images.map(image => ({
        url: image,
      })),
    });
  };

  return (
    <div style={{ margin: 8 }}>
      <div style={{ display: 'flex' }}>
        <div>Gems</div>
        <button onClick={addGem}>Add gem</button>
        <FileSelectButton onSelect={onSelectFile} />
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
