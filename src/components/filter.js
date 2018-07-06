import React, { Component } from "react";
import axios from "axios";
var _ = require("lodash");

export default class Filter extends Component {
  constructor(props) {
    super(props);
    this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.test = "testData";

    this.id =  this.props.id;
    this.globalFilters = this.props.globalFilters
    this.filters =[];

    this.state = {
      dimensions: props.dimensions,
      data: [],
      title: this.props.title,
      dimensionName: "",
      isFormVisible: false,
      selectedValue: "",
      //filters: [],
      layoutId: this.props.layoutId,
      showSettings: false
    };
  }

  serviceBaseUrl = "http://localhost:57387/api/";

  fetchData() {
   
      var name ="";
      if (this.state.dimensions && this.state.dimensions.length > 0) {
        name = this.state.dimensions[0].Name;        
      }
   

    var widgetModel = {
      Dimension: this.state.dimensions,
      Type: "filter"
    };
    //debugger;
    //Derive filtesr from Global filters.
    var filterList = [];
    if(this.props.globalFilters){
      filterList = _.clone(this.props.globalFilters);
      if (this.state.dimensions && this.state.dimensions.length > 0){ 
        var dimName = this.state.dimensions[0].Name;     
        this.props.globalFilters.map(function(filter,i){
          if(filter.ColName == dimName){
            _.remove(filterList, { 'ColName': dimName });
          }
        })

     }
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
            data: response.data,
            count: response.data.length,
            dimensionName : name
          });
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  componentDidMount() {
    console.log("componentDidMount");
    this.fetchData();
  }

  ShowConfigForm = () => {
    let form = (
      <div>
        <input
          ref={(inpDim)=>this.inpDim = inpDim}
          type="text"
          placeholder="Enter Dimension"
          defaultValue={this.state.dimensionName}
        />
        <button onClick={this.saveForm}>Apply</button>
        &nbsp;&nbsp; <button onClick={(e) => this.toggleConfirmForm(e)}>Cancel</button>
      </div>
    );
    return form;
  };

  // static getDerivedStateFromProps(props, state) {
  //   console.log("filter:gds");
  //   var obj={};
  //   var isChanged=false;
  //   if(props.filters != state.filters){
  //     obj.filters = props.filters;
  //     isChanged = true;
  //   }
  //   if(props.layoutId != state.layoutId){
  //     obj.layoutId = props.layoutId;
  //     isChanged = true;
  //   }
  //   if(props.dimensions != state.dimensions){     
  //     obj.dimensions = props.dimensions;
  //     if(!props.dimensions && state.dimensions){
  //       obj.dimensions = state.dimensions;
  //     }
  //     isChanged = true;
  //   }
  //   if(isChanged){
  //     return obj;
  //   }
   
  //   // return {
  //   //   filters: props.filters,
  //   //   layoutId: props.layoutId,
  //   //   dimensions: props.dimensions
  //   //     ? props.dimensions
  //   //     : state.dimensions
  //   //       ? state.dimensions
  //   //       : []
  //   //   //dimensionName: (props.dimensions && props.dimensions.length) > 0? props.dimensions[0].Name : props.dimensionName
  //   // };
    
  //   return null;
  // }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.globalFilters != this.props.globalFilters) {
      this.fetchData();
    }
    //
   // let test = 0;
    console.log("componentDidUpdate state", this.state);
  }

  handleSelectChange = e => {
    e.stopPropagation();
    this.setState({
      selectedValue: e.target.value
    });

    var filter = {
      colName: this.state.dimensionName,
      values: [e.target.value],
      type: 'filter'//,
      //operationType: 
    };

    this.props.onFilterChange(filter, this);
  };

  saveForm = () => {
    this.toggleConfirmForm();

    let dimension = {
      Name: this.inpDim.value // this.state.dimensionName
    };

    this.setState(
      {
        dimensionName: this.inpDim.value,
        dimensions: [dimension]
      },
      () => {
        this.props.onConfigurationChange({
          dimensions: [dimension],
          title: this.state.title,
          layoutId: this.state.layoutId,
          //filters: this.state.filters,
          id: this.id
        });
        this.fetchData();
      }
    );
  };

  toggleConfirmForm = (e) => {
    if(e){
      e.preventDefault();
    }
   
    this.setState(prevState => ({
      isFormVisible: !prevState.isFormVisible,
      showSettings: prevState.isFormVisible
    }));
  };

  getDataToSave = () => {
    return this.state;
  };

  render() {
    console.log("Filter: Render");
    var showSettingLinkUI = (<span><a href="#" onClick={(e) => this.toggleConfirmForm(e)}>Settings</a></span>);

    var defaultView = (
      <div>
        <button onClick={(e) => this.toggleConfirmForm(e)}>Add Dimension</button>                 
      </div>
    );

    var options = this.state.data.map((v,i) => {
      return (
        <option
          key={i}
          value={v["'" + this.state.dimensionName + "'"]}
        >
          {v["'" + this.state.dimensionName + "'"]}
        </option>
      );
    });

    var view = (
      <div>
        <label>Filter - ({this.state.count})</label>
        <span>
          <select
            value={this.state.selectedValue}
            onChange={this.handleSelectChange}
          >
            <option value="">Select</option>
            {options}
          </select>
        </span>
      </div>
    );

    return (
      <React.Fragment>       
        {(!this.state.dimensions || (this.state.dimensions && this.state.dimensions.length == 0)) && defaultView}
        {this.state.showSettings && showSettingLinkUI }
        {!this.state.isFormVisible && this.state.dimensions && this.state.dimensions.length > 0 && view}
        {this.state.isFormVisible && this.ShowConfigForm()}
      </React.Fragment>
    );
  }
}
