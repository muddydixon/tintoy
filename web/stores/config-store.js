import dispatcher from "../dispatcher";
import {ReduceStore} from "flux/utils";
import Const from "../constants";

class ConfigStore extends ReduceStore {
  getInitialState(){
    return {};
  }
  reduce(state, action){
    switch(action.type){
    case Const.CONFIG_FETCH:
      return Object.assign({}, action.config);
    default:
      return state;
    }
  }
}

export default new ConfigStore(dispatcher);
