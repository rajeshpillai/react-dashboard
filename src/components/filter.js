import React, { Component } from "react";
import axios from "axios";
var _ = require("lodash");

export default class Filter extends Component {
  constructor(props) {
    super(props);
    this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.test = "testData";
  }

  state = {
    dimensions: [],
    data: [],
    title: this.props.title,
    dimensionName: "",
    isFormVisible: false,
    selectedValue: ""
  };

  serviceBaseUrl = "http://localhost:57387/api/";

  fetchData() {
    //var name =  this.inpDim.value ? this.inpDim.value : "";
    //if (!name) {
      var name ="";
      if (this.state.dimensions && this.state.dimensions.length > 0) {
        name = this.state.dimensions[0].Name;        
      }
   // }

    // var sameFilterRequestList = _.filter(this.state.filters, { ColName: name });
    // //debugger;
    // //if (!isFirstTime && scope.type == "dropdown" && sameFilterRequestList.length > 0) {
    // if (sameFilterRequestList.length > 0) {
    //   //moveSelectedOptionOnTop();
    //   return false;
    // }

    //debugger;
    var widgetModel = {
      Dimension: this.state.dimensions,
      Type: "filter"
    };

    if (this.state.filters) {
      widgetModel.FilterList = this.state.filters;
    }

    axios
      .post(this.serviceBaseUrl + "data/getData", widgetModel)
      .then(response => {
        console.log("response", response);
        if (response && response.data) {
          this.setState({
            data: response.data,
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
      </div>
    );
    return form;
  };

  static getDerivedStateFromProps(props, state) {
    console.log("filter:gds");
    return {
      filters: props.filters,
      layoutId: props.layoutId,
      dimensions: props.dimensions
        ? props.dimensions
        : state.dimensions
          ? state.dimensions
          : [],
      filters: props.filters //,
      //dimensionName: (props.dimensions && props.dimensions.length) > 0? props.dimensions[0].Name : props.dimensionName
    };
    // }
    // if (props && props.layoutId != null) {
    //   return {
    //     layoutId: props.layoutId,
    //     dimensions: props.dimensions,
    //     filters: props.filters,
    //     dimensionName: (props.dimensions && props.dimensions.length) > 0? props.dimensions[0].Name :""
    //   };
    // }
    // if (props && props.dimensions != null && props.dimensions.length > 0) {
    //   return {
    //     dimensions: props.dimensions
    //   };
    // }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.filters != this.props.filters) {
      this.fetchData();
    }
    //
    let test = 0;
    console.log("componentDidUpdate state", this.state);
  }

  handleSelectChange = e => {
    this.setState({
      selectedValue: e.target.value
    });

    var filter = {
      colName: this.state.dimensionName,
      values: [e.target.value]
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
          filters: this.state.filters
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

  getDataToSave = () => {
    return this.state;
  };

  render() {
    console.log("Filter: Render");
    var defaultView = (
      <div>
        <button onClick={this.toggleConfirmForm}>Add Dimension</button>
      </div>
    );

    var options = this.state.data.map(v => {
      return (
        <option
          key={v[this.state.dimensionName]}
          value={v[this.state.dimensionName]}
        >
          {v[this.state.dimensionName]}
        </option>
      );
    });

    var view = (
      <div>
        <label>Filter - </label>
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
        {this.state.dimensions.length == 0 && defaultView}
        {this.state.dimensions.length > 0 && view}
        {this.state.isFormVisible && this.ShowConfigForm()}
      </React.Fragment>
    );
  }
}
