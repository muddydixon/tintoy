import React, {Component} from "react";

export default class Config extends Component {
  render(){
    const {config} = this.props.data;
    if(!config) return null;
    const keyList = Object.keys(config).map((key)=> <tr key={key}><td>{key}</td><td>{
      Array.isArray(config[key]) ? config[key].join(", ") : config[key]
    }</td></tr>);
    return <div className="container">
      <table className="table">
      <thead>
      <tr><th>Key</th><th>Val</th></tr>
      </thead>
      <tbody>
      {keyList}
      </tbody>
      </table>
    </div>;
  }
}
