import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class PortalCommon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let type = this.props.type;
    var target = null;
    if (type.toLowerCase() == "id") {
      target = document.getElementById(this.props.target);
    } else if (type.toLowerCase() == "class") {
      target = document.getElementsByClassName(this.props.target);
    }

    if (!target) {
      target = document.getElementById("root");
    }
    // STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
    return ReactDOM.createPortal(this.props.children, target);
  }
}
