import { observable } from 'mobx';
import JourneyListModel from './journey-list';

export default class StoreModel {
  @observable journey = new JourneyListModel();
}
