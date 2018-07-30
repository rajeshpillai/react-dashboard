import React, { Component } from "react";
import ReactDOM from 'react-dom';
//import Toolbox from "./toolbox.js";
//import axios from "axios";
//var _ = require("lodash");

export default class PropertyWindow extends Component {
    
  render() {
    // STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
    return ReactDOM.createPortal(this.props.children, document.getElementById('prop-root'));
  }

  
}