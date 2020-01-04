import React, { useEffect } from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { useHistory, useParams } from 'react-router-dom';

import { get, post, put } from '../../../../util/fetch';
import JourneyModel from '../../../../store/models/journey';
import FormContext from '../../../../contexts/form';

import CreateEditJourney from '../../../../components/create-edit-journey';
import { CenteredContainer } from '../../../../components/layout/containers';
import Loader from '../../../../components/loader';

function CreateJourney() {
  const history = useHistory();
  const { id: journeyId } = useParams();
  const state = useObservable({
    selectedDay: null,
    selectedGem: null,
    selectedNest: null,
    journey: new JourneyModel({ days: [{ dayNumber: 1 }] }),
    submitted: false,
    isLoading: true,
    currentDay: 0,
  });

  const isEdit = !!journeyId;

  if (isEdit) {
    useEffect(() => {
      const fetchJourney = async () => {
        try {
          const response = await get(`/api/journeys/${journeyId}`);
          state.journey = new JourneyModel(response.data);
        } catch (e) {
          console.log(e);
        } finally {
          state.isLoading = false;
        }
      };
      fetchJourney();
    }, []);
  } else {
    state.isLoading = false;
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
      const url = '/api/journeys';
      await post(url, state.journey.sanitized);
    }
    history.push('/admin/journeys');
  };

  if (state.isLoading) {
    return (
      <CenteredContainer height="400px">
        <Loader />
      </CenteredContainer>
    );
  }

  return (
    <FormContext.Provider value={{ submitted: state.submitted }}>
      <CreateEditJourney state={state} onSave={onSave} journeyId={journeyId} />
    </FormContext.Provider>
  );
}

export default observer(CreateJourney);
