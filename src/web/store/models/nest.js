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
];

export default class NestModel {
  @observable id;
  @observable title;
  @observable description;
  @observable lat;
  @observable lng;
  @observable platform;
  @observable idOnPlatform;

  constructor({
    id = undefined,
    title = '',
    description = '',
    lat = '',
    lng = '',
    platform = '',
    idOnPlatform = '',
  } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.lat = lat;
    this.lng = lng;
    this.platform = platform;
    this.idOnPlatform = idOnPlatform;
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
      errors. lat = 'Nest latitude is required';
    }

    if (!this.lng) {
      errors.lng = 'Nest longitude is required';
    }

    if (!this.platform) {
      errors.platform = 'Nest platform is required';
    }

    if (!this.idOnPlatform) {
      errors.idOnPlatform = 'Nest id on platform is required';
    }

    return errors;
  }

  @action
  onFieldChange = event => {
    this[event.target.name] = event.target.value;
  };
}
