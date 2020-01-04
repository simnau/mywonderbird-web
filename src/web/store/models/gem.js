import { observable, action } from 'mobx';
import uuidv4 from 'uuid/v4';

import { sanitizeObject } from '../../util/sanitize';
import GemCaptureModel from './gem-capture';

const FIELDS_TO_SANITIZE = [
  'id',
  'title',
  'description',
  'lat',
  'lng',
  'sequenceNumber',
];

export default class GemModel {
  @observable id;
  @observable title;
  @observable description;
  @observable lat;
  @observable lng;
  @observable sequenceNumber;
  @observable gemCaptures;

  constructor({
    id,
    title = '',
    description = '',
    lat = '',
    lng = '',
    sequenceNumber = '',
    gemCaptures = [],
  } = {}) {
    this.id = id || uuidv4();
    this.title = title;
    this.description = description;
    this.lat = lat;
    this.lng = lng;
    this.sequenceNumber = sequenceNumber;
    this.gemCaptures = gemCaptures.map(
      (gemCapture, index) =>
        new GemCaptureModel({ ...gemCapture, sequenceNumber: index + 1 }),
    );
  }

  get sanitized() {
    const sanitizedData = {
      gemCaptures: this.gemCaptures.map(gemCapture => gemCapture.sanitized),
    };

    return sanitizeObject(this, FIELDS_TO_SANITIZE, sanitizedData);
  }

  get errors() {
    let errors = {};

    if (!this.title) {
      errors.title = 'Gem title is required';
    }

    if (!this.lat) {
      errors.lat = 'Gem latitude is required';
    }

    if (!this.lng) {
      errors.lng = 'Gem longitude is required';
    }

    errors = this.gemCaptures.reduce((acc, day, index) => {
      const gemCaptureErorrs = day.errors;

      if (Object.keys(gemCaptureErorrs).length === 0) {
        return acc;
      }

      return {
        ...acc,
        [`Gem Capture ${index + 1}`]: gemCaptureErorrs,
      };
    }, errors);

    return errors;
  }

  @action
  onFieldChange = event => {
    this[event.target.name] = event.target.value;
  };

  @action
  addGemCaptures = (...captures) => {
    this.gemCaptures = [
      ...this.gemCaptures,
      ...captures.map((capture, index) => {
        return new GemCaptureModel({
          ...capture,
          sequenceNumber: this.gemCaptures.length + index + 1,
        });
      }),
    ];
  };

  @action
  removeGemCapture = index => {
    this.gemCaptures.splice(index, 1);
    this.gemCaptures.forEach((gemCapture, index) => {
      gemCapture.sequenceNumber = index + 1;
    });
  };

  @action
  moveGemCaptureLeft = index => {
    if (index <= 0 || index >= this.gemCaptures.length) {
      return;
    }

    const gemCaptureToMove = this.gemCaptures[index];
    const gemCaptureOnLeft = this.gemCaptures[index - 1];

    gemCaptureToMove.sequenceNumber -= 1;
    gemCaptureOnLeft.sequenceNumber += 1;

    this.gemCaptures[index - 1] = gemCaptureToMove;
    this.gemCaptures[index] = gemCaptureOnLeft;
  };

  @action
  moveGemCaptureRight = index => {
    if (index < 0 || index >= this.gemCaptures.length - 1) {
      return;
    }

    const gemCaptureToMove = this.gemCaptures[index];
    const gemCaptureOnRight = this.gemCaptures[index + 1];

    gemCaptureToMove.sequenceNumber += 1;
    gemCaptureOnRight.sequenceNumber -= 1;

    this.gemCaptures[index + 1] = gemCaptureToMove;
    this.gemCaptures[index] = gemCaptureOnRight;
  };
}
