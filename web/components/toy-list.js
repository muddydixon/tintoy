import React, {Component} from "react";
import Toy from "./toy";

export default class ToyList extends Component {
  render(){
    const {toys, config} = this.props.data;
    return <div className="container">
      <table className="table">
      <thead>
      <tr>
      <th>Name</th><th>Created</th><th>Ports</th><th>Status</th><th>Link</th>
      </tr>
      </thead>
      <tbody>
      {toys.map((toy)=> <Toy key={toy.name} toy={toy} config={config} />)}
      </tbody>
      </table>
    </div>;
  }
}
