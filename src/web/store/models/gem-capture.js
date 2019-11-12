import { observable, action } from 'mobx';

import { sanitizeObject } from '../../util/sanitize';

const FIELDS_TO_SANITIZE = [
  'id',
  'title',
  'description',
  'url',
  'sequenceNumber',
];

export default class GemCaptureModel {
  @observable id;
  @observable title;
  @observable description;
  @observable url;
  @observable sequenceNumber;

  constructor({
    id = undefined,
    title = '',
    description = '',
    url = '',
    sequenceNumber = '',
  } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.url = url;
    this.sequenceNumber = sequenceNumber;
  }

  get sanitized() {
    return sanitizeObject(this, FIELDS_TO_SANITIZE);
  }

  get errors() {
    const errors = {};

    if (!this.title) {
      errors.title = 'Gem capture title is required';
    }

    return errors;
  }

  @action
  onFieldChange = event => {
    this[event.target.name] = event.target.value;
  };
}
