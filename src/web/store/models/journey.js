import { observable, action } from 'mobx';
import uuidv4 from 'uuid/v4';
import moment from 'moment';

import Day from './day';

export default class JourneyModel {
  @observable id;
  @observable title;
  @observable description;
  @observable type;
  @observable startDate;
  @observable days;

  constructor({
    id,
    title = '',
    description = '',
    type = '',
    startDate = new Date(),
    days = [],
  } = {}) {
    this.id = id || uuidv4();
    this.title = title;
    this.description = description;
    this.type = type;
    this.startDate = moment(startDate).toDate();
    this.days = days.map(day => new Day(day));
  }

  @action
  onFieldChange = event => {
    this[event.target.name] = event.target.value;
  };

  @action
  onStartDateChange = value => {
    this.startDate = value;
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
