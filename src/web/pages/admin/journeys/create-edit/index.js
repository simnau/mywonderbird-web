import React, { useEffect } from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';

import { get, post, put } from '../../../../util/fetch';
import JourneyModel from '../../../../store/models/journey';

import CreateEditJourney from '../../../../components/create-edit-journey';

function CreateJourney() {
  const history = useHistory();
  const { id: journeyId } = useParams();
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
      const url = '/api/journeys';
      await post(url, {
        ...state.journey,
        startDate: moment(state.journey.startDate).format('YYYY-MM-DD'),
      });
    }
    history.push('/admin/journeys');
  };

  return (
    <CreateEditJourney state={state} onSave={onSave} journeyId={journeyId} />
  );
}

export default observer(CreateJourney);
