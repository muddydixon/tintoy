import React, {Component} from "react";
import {Link} from "react-router";
import FullScreen from "react-fullscreen";

import ConfigStore from "../stores/config-store";
import Loader from "./loader";
import ToyAction from "../actions/toy-action";

export default class ToyEdit extends Component {
  constructor(props){
    super(props);
    this.state = {onLoading: false};
  }
  onSubmit(ev){
    ev.preventDefault();
    const name       = this.props.params.toyId;
    const dockerfile = this.refs.dockerfile.value.trim();
    const runoptions = this.refs.runoptions.value.trim();
    ToyAction.modify({name, dockerfile, runoptions}).then(()=>{
      console.log("modified");
      this.setState({onLoading: false});
      this.context.router.push("/");
    }).catch((err)=>{
      console.log(err);
    });
    this.setState({onLoading: true});
  }
  render(){
    const {toys} = this.props.data;
    const config = ConfigStore.getState();
    if(toys.length === 0) return null;
    const {name, dockerfile, image, container, runoptions} = toys.find((toy)=>{
      return toy.image.RepoTags[0].indexOf(this.props.params.toyId) > -1;
    });
    return <div className="container fluid-row">
      {this.state.onLoading ? <FullScreen><Loader /></FullScreen> : null}
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className="form-group">
          <label>Name</label>
          <h3>{name}</h3>
        </div>
        <div className="form-group">
          <label>Dockerfile</label>
          <div>
            <textarea rows={(dockerfile || "").split(/\n/).length + 10} ref="dockerfile" className="form-control"
              defaultValue={dockerfile} />
          </div>
        </div>
        <div className="form-group">
          <label>Runoptions (one opt in each line)</label>
          <div>
            <textarea rows={(runoptions || "").split(/\n/).length + 3} ref="runoptions" className="form-control"
              defaultValue={runoptions || ""} />
          </div>
        </div>
        <button className="btn btn-primary">Update</button>
      </form>

      <div className="bs-callout bs-callout-info">
        <h4>How to use</h4>
        <p>If connect your resources, open bot IPs</p>
        <ul>
          {(config.hosts || []).map((ip)=> <li key={ip}>{ip}</li>)}
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

ToyEdit.contextTypes = {router: React.PropTypes.object.isRequired};
