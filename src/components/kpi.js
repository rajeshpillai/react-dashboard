import React, { Component } from "react";
import axios from "axios";
import Toolbox from "./toolbox.js";
import PropertyWindow from "./propertywindow";
import _ from "lodash";
import { SketchPicker } from 'react-color';

export default class Kpi extends Toolbox {
  constructor(props) {
    super(props);
    this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
    this.fetchData = this.fetchData.bind(this);

    this.test = "testData";
    this.isFirstTime= props.isFirstTime;
    this.layoutId= props.layoutId;
    this.id = props.id;

    this.state = {
      measure: props.measure,
      value: "",
      expression: (props.measure && props.measure.length > 0)?props.measure[0].Expression:"",
      measureText: "",
      isFormVisible: props.isFormVisible,      
      showSettings: (props.measure && props.measure.length > 0)? true: false,
      bgColor: "#fff",
      txtColor  : "#000"
    };
  }

  

  serviceBaseUrl = "http://localhost:57387/api/";

  fetchData() {
    //if (!this.state.measure || (this.state.measure && this.state.measure.length == 0 && ( null == this.state.expression || this.state.expression == ""))) {
    // if(this.state.isFirstTime) {
    //   return;
    // }
    
    var widgetModel = {
     // Dimension: this.state.dimensions,
      Measure: [],
      Type: "kpi"
    };
   
    if(this.state.expression){      
      widgetModel.Measure = [{
          Expression: this.state.expression,
          DisplayName: this.state.Expression
      }];
    }

   

    //debugger;
    //Derive filtesr from Global filters.
    var filterList =[]
    if(this.props.globalFilters){
      filterList = _.clone(this.props.globalFilters);                
        // this.props.globalFilters.map(function(filter,i){
        //   if(filter.ColName == dimName){
        //     _.remove(filterList, { 'ColName': dimName });
        //   }
        // })    
    }
    //if (this.state.filters) {
      widgetModel.FilterList = filterList;
    //}

    axios
      .post(this.serviceBaseUrl + "data/getData", widgetModel)
      .then(response => {
        console.log("response", response);
        if (response && response.data) {
          this.setState({
            value: response.data[0][this.state.expression],            
            measureText : this.state.expression
          });
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.globalFilters != this.props.globalFilters) {
  //     this.fetchData();
  //   }
  //   //
  //   console.log("componentDidUpdate state", this.state);
  // }

  // componentDidMount() {
  //   if(this.isFirstTime) {
  //     return;
  //   }
  //   this.fetchData();
  // }

  ShowConfigForm = () => {
    let form = (
      <PropertyWindow>
        <div style={this.property_window}>
         <label>Expression: </label>  
          <input
            ref={(inpExpr)=>this.inpExpr = inpExpr}
            type="text"
            placeholder="Enter expression"
            defaultValue={this.state.expression}
          />
          <br />
          <div>Presentation</div>
            <div className="row">
                <div>
                  <label>Background Color: </label>  
                  <input
                    ref={(bgColor)=>this.bgColor = bgColor}
                    type="text"
                    placeholder="Enter Background Color"
                    defaultValue={this.state.bgColor}
                  />  <SketchPicker/>
              </div>
            </div>
            <div className="row">
                <div>
                  <label>Text Color: </label>  
                  <input
                    ref={(txtColor)=>this.txtColor = txtColor}
                    type="text"
                    placeholder="Enter Text Color"
                    defaultValue={this.state.txtColor}
                  />
              </div>
            </div>
          <button onClick={this.saveForm}>Apply</button>
          &nbsp;&nbsp; <button onClick={(e) => this.toggleConfirmForm(e)}>Cancel</button>
        </div>
      </PropertyWindow>
    );
    return form;
  };

  saveForm = () => {
    this.toggleConfirmForm();
    let measure = {
      Expression: this.inpExpr.value, // this.state.expression
    };

    this.setState(
      {
        expression: measure.Expression,
        measure: [measure],
        bgColor : this.bgColor.value,
        txtColor : this.txtColor.value
        //isFirstTime: false
      },
      () => {
        this.props.onConfigurationChange({
          measure: [measure],
          title: this.state.title,
          layoutId: this.layoutId,
          //filters: this.state.filters
          id: this.id
        });
        this.fetchData();
      }
    );
  };

  // toggleConfirmForm = () => {
  //   this.setState(prevState => ({
  //     isFormVisible: !prevState.isFormVisible,
  //     showSettings: prevState.isFormVisible
  //   }));
  // };

  // onDeleteBox = () => {
  //   this.props.onDeleteBox({
  //     layoutId: this.layoutId,
  //     id: this.id
  //   });
  // }

  // onSetPropertyForm  = () => {    
  //   let form = (
  //     <div>
  //        <label>Expression: </label>
  //       <input
  //         ref={(inpExpr)=>this.inpExpr = inpExpr}
  //         type="text"
  //         placeholder="Enter expression"
  //         defaultValue={this.state.expression}
  //         //value=
  //       />
  //       <br/>
  //       <button onClick={this.saveForm}>Apply</button>
  //       &nbsp;&nbsp; <button onClick={(e) => this.toggleConfirmForm(e)}>Cancel</button>
  //     </div>
  //   );

  //   var data = {
  //     form:form,
  //     layoutId: this.layoutId
  //   }
  //   this.props.onSetPropertyForm(data);
  //   //this.props.onSetPropertyForm(form);
  // }

  render() {
    console.log("KPI: Render");
    var showSettingLinkUI = (<span><a href="#" onClick={(e) => this.toggleConfirmForm(e)}>Settings</a> <a className="right" href="#" onClick={this.onDeleteBox}>X</a></span>);

    var defaultView = (
      <div>
        <button onClick={this.toggleConfirmForm}>Add Measure</button>
        <a href="#" onClick={this.onDeleteBox}>X</a> 
      </div>
    );

    var view = (
      <div style={{backgroundColor:this.state.bgColor,color:this.state.txtColor}}>
        <label>KPI - </label>
        <span>{this.state.value}</span>
      </div>
    );

    return (
      <React.Fragment>
        {(this.state.measure == null || this.state.measure.length == 0)  && defaultView}
        {this.state.showSettings && showSettingLinkUI }
        {(this.state.measure != null && this.state.measure.length > 0) && view}
        {this.state.isFormVisible && this.ShowConfigForm()}
      </React.Fragment>
    );
  }
}
