import React, {Component} from "react";

import ToyStore from "../stores/toy-store";
import ConfigStore from "../stores/config-store";

import ToyAction from "../actions/toy-action";
import ConfigAction from "../actions/config-action";

import Header from "../components/header";

export default class App extends Component {
  static getStores(){
    return [ToyStore, ConfigStore];
  }

  static calculateState(){
    return {
      toys: ToyStore.getState(),
      config: ConfigStore.getState()
    };
  }
  componentDidMount(){
    ConfigAction.fetch();
    ToyAction.fetchAll();
  }
  render(){
    console.info(this.state);
    return <div>
      <Header />
      {React.cloneElement(this.props.children, {data: this.state})}
      </div>;
  }
}
