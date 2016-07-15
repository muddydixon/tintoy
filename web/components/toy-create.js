import React, {Component} from "react";
import {Link} from "react-router";

import ToyAction from "../actions/toy-action";

const placeholder = `FROM <image>
EXPOSE 8080
ENTRYPOINT <entrypoint>
CMD <command>
`;

export default class ToyEdit extends Component {
  onSubmit(ev){
    ev.preventDefault();
    const name       = this.refs.name.value.trim();
    const dockerfile = this.refs.dockerfile.value.trim();
    ToyAction.create({name, dockerfile});
  }
  render(){
    const {config} = this.props.data;

    return <div className="container fluid-row">
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" ref="name" className="form-control" placeholder="image name"/>
        </div>
        <div className="form-group">
          <label>Dockerfile</label>
          <div>
            <textarea rows={placeholder.split(/\n/).length + 10} ref="dockerfile" className="form-control"
              defaultValue={placeholder} placeholder={placeholder}/>
          </div>
        </div>
        <button className="btn btn-primary">Create</button>
      </form>
      <div className="bs-callout bs-callout-info">
        <h4>How to use</h4>
        <p>If connect your resources, open bot IPs</p>
        <ul>
          {(config.ips || []).map((ip)=> <li key={ip}>{ip}</li>)}
        </ul>
      </div>
      <div className="bs-callout bs-callout-info">
        <h4>How to use</h4>
        <ol>
          <li>Specify cool Hubot name</li>
          <li>Go mattermost and then click AccountSettings > Integrations.</li>
          <li>Create Incoming Webhook to your desiring channel</li>
          <li>Create Outgoing Webhook watching your desiring channel, and set "{"http://<YOUR BRIGADE DOMAIN>/brigade/<YOUR HUBOT NAME>"}"to Callback Url </li>
          <li>Get Outgoing Webhook token and Incoming Webhook URL</li>
          <li>Go Brigade.</li>
          <li>Input Hubot name</li>
          <li>Input Incoming url</li>
          <li>Input Outgoing Token</li>
          <li>Input Icon url (optional)</li>
          <li>Write script</li>
        </ol>
      </div>
    </div>;
  }
}
