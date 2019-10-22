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
    this.gemCaptures = gemCaptures;
  }

  @action
  onFieldChange = event => {
    this[event.target.name] = event.target.value;
  };

  @action
  addGemCapture = () => {
    this.gemCaptures.push(
      new GemCaptureModel({ sequenceNumber: this.gemCaptures.length + 1 }),
    );
  };

  @action
  removeGemCapture = (index) => {
    this.gemCaptures.splice(index, 1);
    this.gemCaptures.forEach((gemCapture, index) => {
      gemCapture.sequenceNumber = index + 1;
    });
  };
}
