import React, {Component} from "react";
import {Link} from "react-router";

import moment from "moment";

export default class Toy extends Component {
  render(){
    const {toy} = this.props;
    const portsInfo = toy.container && toy.container.Ports ? toy.container.Ports.map((port)=>{
      return `${port.PrivatePort}:${port.PublicPort}/${port.Type}`;
    }).join(", ") : "";
    return <tr>
      <td><Link to={`/toys/${toy.name}`}>{toy.name}</Link></td>
      <td>{moment(toy.image.Created * 1000).format("YYYY/MM/DD hh:mm")}</td>
      <td>{portsInfo}</td>
      <td>{toy.container && toy.container.State ?
           <button className={"btn btn-success btn-xs"}>{toy.container.State}</button> :
           <button className={"btn btn-danger btn-xs"}>{"未起動"}</button>}</td>
      </tr>;
  }
}
