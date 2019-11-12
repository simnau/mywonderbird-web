import { observable, action } from 'mobx';
import uuidv4 from 'uuid/v4';

import { sanitizeObject } from '../../util/sanitize';
import NestModel from './nest';
import GemModel from './gem';

const FIELDS_TO_SANITIZE = ['id', 'title', 'description', 'dayNumber'];

export default class DayModel {
  @observable id;
  @observable title;
  @observable description;
  @observable dayNumber;
  @observable gems;
  @observable nest;

  constructor({
    id,
    title = '',
    description = '',
    dayNumber = '',
    gems = [],
    nest = null,
  } = {}) {
    this.id = id || uuidv4();
    this.title = title;
    this.description = description;
    this.dayNumber = dayNumber;
    this.gems = gems.map(gem => new GemModel(gem));
    this.nest = nest ? new NestModel(nest) : null;
  }

  get sanitized() {
    const sanitizedData = {
      gems: this.gems.map(gem => gem.sanitized),
      nest: this.nest ? this.nest.sanitized : null,
    };

    return sanitizeObject(this, FIELDS_TO_SANITIZE, sanitizedData);
  }

  get errors() {
    let errors = {};

    if (!this.title) {
      errors.title = 'Day title is required';
    }

    if (this.nest && Object.keys(this.nest.errors).length > 0) {
      errors.nest = this.nest.errors;
    }

    errors = this.gems.reduce((acc, day, index) => {
      const gemErrors = day.errors;

      if (Object.keys(gemErrors).length === 0) {
        return acc;
      }

      return {
        ...acc,
        [`gems[${index}]`]: gemErrors,
      };
    }, errors);

    return errors;
  }

  @action
  onFieldChange = event => {
    this[event.target.name] = event.target.value;
  };

  @action
  addNest = () => {
    this.nest = new NestModel();
  };

  @action
  removeNest = () => {
    this.nest = null;
  };

  @action
  addGem = gem => {
    this.gems.push(
      new GemModel({ ...gem, sequenceNumber: this.gems.length + 1 }),
    );
  };

  @action
  removeGem = index => {
    this.gems.splice(index, 1);
    this.gems.forEach((gem, index) => {
      gem.sequenceNumber = index + 1;
    });
  };
}
