import dispatcher from "../dispatcher";
import {ReduceStore} from "flux/utils";
import Const from "../constants";

class ToyStore extends ReduceStore {
  getInitialState(){
    return [];
  }
  reduce(state, action){
    switch(action.type){
    case Const.TOY_FETCH_ALL:
      return action.toys;
    case Const.TOY_CREATE:
      return state.concat(action.toy);
    case Const.TOY_MODIFY:
      const toys = state.map((toy)=> toy.name === action.toy.name ? action.toy : toy);
      return toys;
    default:
      return state;
    }
  }
}

export default new ToyStore(dispatcher);
