import { observable, action } from 'mobx';

import GemCaptureModel from './gem-capture';

export default class GemModel {
  @observable title;
  @observable description;
  @observable lat;
  @observable lng;
  @observable sequenceNumber;
  @observable gemCaptures;

  constructor({
    title = '',
    description = '',
    lat = '',
    lng = '',
    sequenceNumber = '',
    gemCaptures = [],
  } = {}) {
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

  @action
  onFieldChange = event => {
    this[event.target.name] = event.target.value;
  };

  @action
  addGemCaptures = (...captures) => {
    this.gemCaptures = [...this.gemCaptures, ...captures.map((capture, index) => {
      return new GemCaptureModel({ ...capture, sequenceNumber: this.gemCaptures.length + index + 1 });
    })];
  };

  @action
  removeGemCapture = index => {
    this.gemCaptures.splice(index, 1);
    this.gemCaptures.forEach((gemCapture, index) => {
      gemCapture.sequenceNumber = index + 1;
    });
  };
}
