import { observable, action } from 'mobx';
import uuidv4 from 'uuid/v4';

import NestModel from './nest';
import GemModel from './gem';

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
