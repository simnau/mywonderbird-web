import { observable, action } from 'mobx';

import Day from './day';

export default class JourneyModel {
  @observable title;
  @observable description;
  @observable type;
  @observable startDate;
  @observable days;

  constructor({
    title = '',
    description = '',
    type = '',
    startDate = '',
    days = [],
  } = {}) {
    this.title = title;
    this.description = description;
    this.type = type;
    this.startDate = startDate;
    this.days = days;
  }

  @action
  onFieldChange = event => {
    this[event.target.name] = event.target.value;
  };

  @action
  addDay = () => {
    this.days.push(new Day({ dayNumber: this.days.length + 1 }));
  };

  @action
  removeDay = index => {
    this.days.splice(index, 1);
    this.days.forEach((day, index) => {
      day.dayNumber = index + 1;
    });
  };
}
