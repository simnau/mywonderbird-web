import { observable, action } from 'mobx';

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

  @action
  onFieldChange = event => {
    this[event.target.name] = event.target.value;
  };
}
