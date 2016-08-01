import React, {Component} from "react";
import {Link} from "react-router";
import FullScreen from "react-fullscreen";

import Loader from "./loader";
import ToyAction from "../actions/toy-action";

const placeholderDockerfile = `FROM <image>
EXPOSE 8080
ENTRYPOINT <entrypoint>
CMD <command>`;
const placeholderRunoptions = `--env XXX=XXX
--env YYY=YYY
--restart=always
--privileged
# ignore port, volumes`;

export default class ToyCreate extends Component {
  constructor(props){
    super(props);
    this.state = {onLoading: false};
  }
  onSubmit(ev){
    ev.preventDefault();
    const name       = this.refs.name.value.trim();
    const dockerfile = this.refs.dockerfile.value.trim();
    const runoptions = this.refs.runoptions.value.trim();
    ToyAction.create({name, dockerfile, runoptions}).then(()=>{
      this.setState({onLoading: false});
      this.context.router.push("/");
    });
    this.setState({onLoading: true});
  }
  render(){
    const {config} = this.props.data;
    const runAttrs = ["ENV"];

    return <div className="container fluid-row">
      {this.state.onLoading ? <FullScreen><Loader /></FullScreen> : null}
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" ref="name" className="form-control" placeholder="image name"/>
        </div>
        <div className="form-group">
          <label>Dockerfile</label>
          <div>
            <textarea rows={placeholderDockerfile.split(/\n/).length + 10} ref="dockerfile" className="form-control"
              defaultValue={placeholderDockerfile} placeholder={placeholderDockerfile}/>
          </div>
        </div>
        <div className="form-group">
          <label>Runoptions</label>
          <div>
            <textarea rows={(placeholderRunoptions || "").split(/\n/).length + 3} ref="runoptions" className="form-control"
              defaultValue={placeholderRunoptions || ""} />
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

ToyCreate.contextTypes = {router: React.PropTypes.object.isRequired};
