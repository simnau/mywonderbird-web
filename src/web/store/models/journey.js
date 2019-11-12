import { observable, action } from 'mobx';
import uuidv4 from 'uuid/v4';
import moment from 'moment';

import { sanitizeObject } from '../../util/sanitize';
import Day from './day';

const FIELDS_TO_SANITIZE = ['id', 'title', 'description', 'type'];

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

  get sanitized() {
    const sanitizedData = {
      startDate: moment(this.startDate).format('YYYY-MM-DD'),
      days: this.days.map(day => day.sanitized),
    };

    return sanitizeObject(this, FIELDS_TO_SANITIZE, sanitizedData);
  }

  get errors() {
    let errors = {};

    if (!this.title) {
      errors.title = 'Journey title is required';
    }

    if (!this.startDate) {
      errors.startDate = 'Journey start date is required';
    }

    errors = this.days.reduce((acc, day, index) => {
      const dayErrors = day.errors;

      if (Object.keys(dayErrors).length === 0) {
        return acc;
      }

      return {
        ...acc,
        [`days[${index}]`]: dayErrors,
      };
    }, errors);

    return errors;
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
