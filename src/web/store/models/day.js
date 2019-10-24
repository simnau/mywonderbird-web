import { observable, action } from 'mobx';

import NestModel from './nest';
import GemModel from './gem';

export default class DayModel {
  @observable title;
  @observable description;
  @observable dayNumber;
  @observable gems;
  @observable nest;

  constructor({
    title = '',
    description = '',
    dayNumber = '',
    gems = [],
  } = {}) {
    this.title = title;
    this.description = description;
    this.dayNumber = dayNumber;
    this.gems = gems;
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
  addGem = (gem) => {
    this.gems.push(new GemModel({ ...gem, sequenceNumber: this.gems.length + 1 }));
  };

  @action
  removeGem = index => {
    this.gems.splice(index, 1);
    this.gems.forEach((gem, index) => {
      gem.sequenceNumber = index + 1;
    });
  };
}
