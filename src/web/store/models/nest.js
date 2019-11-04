import { observable, action } from 'mobx';

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

  @action
  onFieldChange = event => {
    this[event.target.name] = event.target.value;
  };
}
