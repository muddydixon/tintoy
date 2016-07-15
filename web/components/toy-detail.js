import React, {Component} from "react";
import {Link} from "react-router";

export default class ToyDetail extends Component {
  render(){
    const {toys} = this.props.data;
    if(toys.length === 0) return null;
    const toy = toys.find((toy)=> toy.image.RepoTags[0].indexOf(this.props.params.toyId));
    const name = toy.name;

    return <div className="container">
      <h1>{name}</h1>
      <table>
      </table>
      </div>;
  }
}
