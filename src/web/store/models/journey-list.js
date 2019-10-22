import { observable, action } from 'mobx';

import JourneyModel from './journey';

export default class JourneyListModel {
  @observable journeys = [];

  @action
  addJourney(journey) {
    this.journeys.push(new JourneyModel(journey));
  }

  @action
  setJourneys(journeys) {
    this.journeys = journeys;
  }
}
