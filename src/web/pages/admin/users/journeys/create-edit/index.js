import React, { useEffect } from 'react';
import { observer, useObservable } from 'mobx-react-lite';
import { useHistory, useParams } from 'react-router-dom';
import * as moment from 'moment';

import { get, put, post } from '../../../../../util/fetch';
import CreateEditJourney from '../../../../../components/create-edit-journey';
import JourneyModel from '../../../../../store/models/journey';

function CreateEditUserJourney() {
  const history = useHistory();
  const { userId, journeyId } = useParams();
  const state = useObservable({
    selectedDay: null,
    selectedGem: null,
    selectedNest: null,
    journey: new JourneyModel({ days: [{ dayNumber: 1 }] }),
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
    if (isEdit) {
      const url = `/api/journeys/${journeyId}`;
      await put(url, {
        ...state.journey,
      });
    } else {
      const url = `/api/journeys/user/${userId}`;
      await post(url, {
        ...state.journey,
        startDate: moment(state.journey.startDate).format('YYYY-MM-DD'),
      });
    }
    history.push(`/admin/users/${userId}/journeys`);
  };

  return (
    <CreateEditJourney state={state} onSave={onSave} journeyId={journeyId} />
  );
}

export default observer(CreateEditUserJourney);
