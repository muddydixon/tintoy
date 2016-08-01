import React, {Component} from "react";

export default class Loader extends Component {
  render(){
    const style = {
      opacity: 0.5,
      background: "grey",
      zIndex: 1001,
      position: "absolute",
      top: 0,
      left: 0,
      width: this.props.width,
      height: this.props.height,
      verticalAlign: "middle"
    };
    return <div style={style} className="text-center">
      <i className="fa fa-refresh fa-spin fa-5x" />
      </div>;
  }
}
