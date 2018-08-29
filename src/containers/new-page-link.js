import React, { Component } from "react";
import ReactDOM from 'react-dom';

export default class NewPageLink extends Component {
    
  render() {
    // STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
    return ReactDOM.createPortal(this.props.children, document.getElementsByClassName('addNewPage'));
  }

  
}