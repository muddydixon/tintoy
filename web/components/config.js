import React, {Component} from "react";

import ConfigAction from "../actions/config-action";

export default class Config extends Component {
  constructor(props){
    super(props);
    this.state = {
      adding:false
    };
  }
  onAddRow(){
    this.setState({adding:true});
  }
  onKeyPress(ev){
    if(ev.key === "Enter" || ev.charCode === 13){
      const key = this.refs.key.value.trim();
      const val = this.refs.val.value.trim();
      ConfigAction.set(key, val);
    }
  }
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
      {this.state.adding ? <tr>
        <td><input ref="key" className="form-control" onKeyPress={this.onKeyPress.bind(this)} /></td>
        <td><input ref="val" className="form-control" onKeyPress={this.onKeyPress.bind(this)} /></td></tr> :
        null}
      </tbody>
      </table>
      <button className="btn btn-info" onClick={this.onAddRow.bind(this)}>追加</button>
    </div>;
  }
}
