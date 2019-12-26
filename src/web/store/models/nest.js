import { observable, action } from 'mobx';

import { sanitizeObject } from '../../util/sanitize';

const FIELDS_TO_SANITIZE = [
  'id',
  'title',
  'description',
  'lat',
  'lng',
  'platform',
  'idOnPlatform',
  'url',
];

export default class NestModel {
  @observable id;
  @observable title;
  @observable description;
  @observable lat;
  @observable lng;
  @observable platform;
  @observable idOnPlatform;
  @observable url;

  constructor({
    id = undefined,
    title = '',
    description = '',
    lat = '',
    lng = '',
    platform = '',
    idOnPlatform = '',
    url = '',
  } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.lat = lat;
    this.lng = lng;
    this.platform = platform;
    this.idOnPlatform = idOnPlatform;
    this.url = url;
  }

  get sanitized() {
    return sanitizeObject(this, FIELDS_TO_SANITIZE);
  }

  get errors() {
    const errors = {};

    if (!this.title) {
      errors.title = 'Nest title is required';
    }

    if (!this.lat) {
      errors.lat = 'Nest latitude is required';
    }

    if (!this.lng) {
      errors.lng = 'Nest longitude is required';
    }

    return errors;
  }

  @action
  onFieldChange = event => {
    this[event.target.name] = event.target.value;
  };
}
