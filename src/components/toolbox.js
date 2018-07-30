import React, { Component } from "react";
import axios from "axios";
var _ = require("lodash");

export default class Toolbox extends Component {

    constructor(props){
        super(props);
        this.property_window ={
            position: "fixed",
            right: "0px",
            zIndex: "9999",
            background: "cyan",
            height: "100vh",
            top: "50px",
            minWidth: "250px"
          }
          
    }
    

    
    onDeleteBox = () => {
        this.props.onDeleteBox({
        layoutId: this.layoutId,
        id: this.id
        });
    }
    

    

    toggleConfirmForm = (e) => {
        if(e){
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
    };
    

    componentDidMount() {
        console.log("componentDidMount");
        this.fetchData();
    }
      
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.globalFilters != this.props.globalFilters) {
          this.isFirstTime = true;
          this.fetchData();
        }
        //
       // let test = 0;
        console.log("componentDidUpdate state", this.state);
      }

}