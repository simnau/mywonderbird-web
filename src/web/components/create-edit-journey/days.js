import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { OutlineButton } from '../button';
import PagedList from '../paged-list';
import { TextField, TextArea } from '../input';
import {
  HeadingContainer,
  HeadingActionContainer,
} from '../heading';
import JourneyContext from '../../contexts/journey';
import GemsForm from './gems';
import NestForm from './nest';

const FormContainer = styled.div`
  display: grid;
  grid-row-gap: 16px;
`;

function DaysForm({ days, addDay, removeDay }) {
  const { addGemFromMap } = useContext(JourneyContext);

  return (
    <div style={{ margin: 8 }}>
      <HeadingContainer>
        <div>Days</div>
        <HeadingActionContainer>
          <OutlineButton variant="primary" onClick={addDay}>
            Add day
          </OutlineButton>
        </HeadingActionContainer>
      </HeadingContainer>
      <PagedList items={days}>
        {({ currentItem: day, itemCount: dayCount, onRemove }) => {
          const addGem = addGemFromMap.bind(null, day);
          const isRemoveEnabled = dayCount > 1;

          const onRemoveDay = () => {
            onRemove();
            removeDay(day.dayNumber - 1);
          };

          return (
              <div key={day.dayNumber}>
                <HeadingContainer>
                  <div>{`Day ${day.dayNumber}`}</div>
                  <HeadingActionContainer>
                    <OutlineButton
                      variant="danger"
                      disabled={!isRemoveEnabled}
                      onClick={onRemoveDay}
                    >
                      Remove
                    </OutlineButton>
                  </HeadingActionContainer>
                </HeadingContainer>
                <FormContainer>
                  <TextField
                    label="Title"
                    name="title"
                    value={day.title}
                    onChange={day.onFieldChange}
                  />
                  <TextArea
                    label="Description"
                    name="description"
                    value={day.description}
                    onChange={day.onFieldChange}
                  />
                </FormContainer>
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
              </div>
          );
        }}
      </PagedList>
    </div>
  );
}

export default observer(DaysForm);
