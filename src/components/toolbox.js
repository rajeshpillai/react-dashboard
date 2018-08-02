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
          isFormVisible:  !prevState.isFormVisible,
          showSettings: true //prevState.isFormVisible
        }));

        //this.ShowConfigForm();
        
        // var data = {           
        //     layoutId: this.layoutId
        //   }

        // this.onSetPropertyForm(data);

        this.onSetPropertyWindowActive(this.layoutId);
    };

    onSetPropertyWindowActive(layoutId){
        this.props.onSetPropertyWindowActive(layoutId);
    }
    
    setFormVisibility(flag){
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
        } else if (prevProps.isFormVisible != this.props.isFormVisible){
            this.setFormVisibility(this.props.isFormVisible);
        }
        //
       // let test = 0;
        console.log("componentDidUpdate state", this.state);
      }

      getRandomColor(){
        return  'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
      }

}