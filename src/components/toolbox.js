import React, { Component } from "react";
import axios from "axios";
var _ = require("lodash");

export default class Toolbox extends Component {
  constructor(props) {
    super(props);
    this.property_window = {
      // position: "fixed",
      // right: "0px",
      // zIndex: "9999",
      // background: "cyan",
      // height: "100vh",
      // top: "50px",
      // minWidth: "250px"
      position: "absolute",
      /* opacity: 0; */
      /*display: none;*/
      top: "356px",
      /* right: -2000px; */
      right: 0,
      transform: "translateY(-50%)",
      width: "340px",
      height: "615px",
      maxHeight: "615px",
      overflow: "auto",
      padding: "15px",
      background: "#fff",
      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
      boxSizing: "border-box",
      transition: "all 0.2s",
      zIndex: "1000"
    };

    this.serviceBaseUrl = "http://localhost:57387/api/";
    this.serviceGetDataUrl = this.serviceBaseUrl + "data/getData";
    this.appId = props.appId;
  }

  onDeleteBox = () => {
    this.props.onDeleteBox({
      layoutId: this.layoutId,
      id: this.id
    });
  };

  toggleConfirmForm = e => {
    if (e) {
      e.preventDefault();
    }

    this.setState(prevState => ({
      isFormVisible: !prevState.isFormVisible,
      showSettings: true //prevState.isFormVisible
    }));

    //this.ShowConfigForm();

    // var data = {
    //     layoutId: this.layoutId
    //   }

    // this.onSetPropertyForm(data);

    this.onSetPropertyWindowActive(this.layoutId);
  };

  onSetPropertyWindowActive(layoutId) {
    this.props.onSetPropertyWindowActive(layoutId);
  }

  setFormVisibility(flag) {
    this.setState({
      isFormVisible: flag
    });
  }

  componentDidMount() {
    console.log("componentDidMount");
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    //debugger;
    if (prevProps.globalFilters != this.props.globalFilters) {
      this.isFirstTime = true;
      this.fetchData();
    } else if (prevProps.isFormVisible != this.props.isFormVisible) {
      this.setFormVisibility(this.props.isFormVisible);
    }
    //
    // let test = 0;
    console.log("componentDidUpdate state", this.state);
  }

  getRandomColor() {
    return (
      "rgb(" +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      ")"
    );
  }
}
