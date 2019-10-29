import React from 'react';
import { observer } from 'mobx-react-lite';

import GemsForm from './gems';
import NestForm from './nest';

function DaysForm({ days, addDay, removeDay, onAddGem }) {
  return (
    <div style={{ margin: 8 }}>
      <div style={{ marginBottom: 8, fontSize: 20, display: 'flex' }}>
        <div>Days</div>
        <button onClick={addDay}>Add day</button>
      </div>
      <div>
        {days.map((day, index) => {
          const addGem = onAddGem.bind(null, day);

          return (
            <div key={day.dayNumber}>
              <div style={{ display: 'flex' }}>
                <div>{`Day ${day.dayNumber}`}</div>
                <button onClick={() => removeDay(index)}>Remove</button>
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
                  value={day.title}
                  onChange={day.onFieldChange}
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
                  value={day.description}
                  onChange={day.onFieldChange}
                />
              </div>
              <GemsForm
                gems={day.gems}
                addGem={addGem}
                createGem={day.addGem}
                removeGem={day.removeGem}
              />
              <NestForm
                nest={day.nest}
                addNest={day.addNest}
                removeNest={day.removeNest}
              />
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default observer(DaysForm);
