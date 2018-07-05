import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";

export default class Kpi extends Component {
  constructor(props) {
    super(props);
    this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
    this.fetchData = this.fetchData.bind(this);

    this.test = "testData";
    this.isFirstTime= props.isFirstTime;

    this.state = {
      measure: props.measure,
      value: "",
      expression: "",
      measureText: "",
      isFormVisible: false,
      layoutId: props.layoutId
      
    };
  }

  

  serviceBaseUrl = "http://localhost:57387/api/";

  fetchData() {
    //if (!this.state.measure || (this.state.measure && this.state.measure.length == 0 && ( null == this.state.expression || this.state.expression == ""))) {
    // if(this.state.isFirstTime) {
    //   return;
    // }
    
    var widgetModel = {
      Dimension: this.state.dimensions,
      Measure: [
        {
          Expression: this.state.expression,
          DisplayName: this.state.Expression
        }
      ],
      Type: "kpi"
    };

   

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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.globalFilters != this.props.globalFilters) {
      this.fetchData();
    }
    //
    console.log("componentDidUpdate state", this.state);
  }

  componentDidMount() {
    if(this.isFirstTime) {
      return;
    }
    this.fetchData();
  }

  ShowConfigForm = () => {
    let form = (
      <div>
        <input
          ref={(inpExpr)=>this.inpExpr = inpExpr}
          type="text"
          placeholder="Enter expression"
          defaultValue={this.state.expression}
        />
        <button onClick={this.saveForm}>Apply</button>
      </div>
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
        measure: [measure]//,
        //isFirstTime: false
      },
      () => {
        this.props.onConfigurationChange({
          measure: [measure],
          title: this.state.title,
          layoutId: this.state.layoutId,
          //filters: this.state.filters,
          isFirstTime: false
        });
        this.fetchData();
      }
    );
  };

  toggleConfirmForm = () => {
    this.setState(prevState => ({
      isFormVisible: !prevState.isFormVisible
    }));
  };

  render() {
    console.log("KPI: Render");
    var defaultView = (
      <div>
        <button onClick={this.toggleConfirmForm}>Add Measure</button>
      </div>
    );

    var view = (
      <div>
        <label>KPI - </label>
        <span>{this.state.value}</span>
      </div>
    );

    return (
      <React.Fragment>
        {(this.state.measure == null || this.state.measure.length == 0)  && defaultView}
        {(this.state.measure != null && this.state.measure.length > 0) && view}
        {this.state.isFormVisible && this.ShowConfigForm()}
      </React.Fragment>
    );
  }
}
