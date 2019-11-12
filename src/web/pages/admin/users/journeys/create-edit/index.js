import React, { useEffect } from 'react';
import { observer, useObservable } from 'mobx-react-lite';
import { useHistory, useParams } from 'react-router-dom';

import { get, put, post } from '../../../../../util/fetch';
import CreateEditJourney from '../../../../../components/create-edit-journey';
import JourneyModel from '../../../../../store/models/journey';
import FormContext from '../../../../../contexts/form';

function CreateEditUserJourney() {
  const history = useHistory();
  const { userId, journeyId } = useParams();
  const state = useObservable({
    selectedDay: null,
    selectedGem: null,
    selectedNest: null,
    journey: new JourneyModel({ days: [{ dayNumber: 1 }] }),
    submitted: false,
  });

  const isEdit = !!journeyId;

  if (isEdit) {
    useEffect(() => {
      const fetchJourney = async () => {
        const response = await get(`/api/journeys/${journeyId}`);
        state.journey = new JourneyModel(response.data);
      };
      fetchJourney();
    }, []);
  }

  const onSave = async () => {
    state.submitted = true;

    if (Object.keys(state.journey.errors).length !== 0) {
      return;
    }

    if (isEdit) {
      const url = `/api/journeys/${journeyId}`;
      await put(url, state.journey.sanitized);
    } else {
      const url = `/api/journeys/user/${userId}`;
      await post(url, state.journey.sanitized);
    }
    history.push(`/admin/users/${userId}/journeys`);
  };

  return (
    <FormContext.Provider value={{ submitted: state.submitted }}>
      <CreateEditJourney state={state} onSave={onSave} journeyId={journeyId} />
    </FormContext.Provider>
  );
}

export default observer(CreateEditUserJourney);
