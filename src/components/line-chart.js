import React, { Component } from "react";
import axios from "axios";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart as ReLineChart,
  Line
} from "recharts";
import Toolbox from "./toolbox.js";
import PropertyWindow from "./property-window";
import ContainerDimensions from "react-container-dimensions";
import { scaleOrdinal, schemeCategory10 } from "d3-scale";
var _ = require("lodash");
const colors = scaleOrdinal(schemeCategory10).range();

const data = [
  { "Enter Dimension": "x1", "Enter Expression": 100 },
  { "Enter Dimension": "x2", "Enter Expression": 200 },
  { "Enter Dimension": "x3", "Enter Expression": 50 }
];

export default class LineChart extends Toolbox {
  constructor(props) {
    super(props);
    this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
    this.saveForm = this.saveForm.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.ShowConfigForm = this.ShowConfigForm.bind(this);

    this.globalFilters = props.globalFilters;
    this.filters = [];
    this.layoutId = props.layoutId;
    this.id = props.id;
    this.dimensions = props.dimensions;
    this.measure = props.measure;

    if (!this.dimensions || !this.measure) {
      // var dim = {Name:'employee1.city'};
      // //var dim2 = {Name:'skills1.skill'};
      // var measure = {Expression:'count(employee1.city)'};
      // var measure2 = {Expression:'count(employee1.ename)'};

      var dim = { Name: "Enter Dimension" };
      //var dim2 = {Name:'skills1.skill'};
      var measure = { Expression: "Enter Expression" };
      this.dimensions = [dim];
      this.measure = [measure];
      this.defaultValue = true;
    }

    // this.dimensions = [{Name:""}];
    // this.measure = [{Expression:""}];

    this.state = {
      dimensions: this.dimensions,
      measure: this.measure,
      isFormVisible: props.isFormVisible,
      showSettings: true,
      data: data
    };
  }

  fetchData() {
    if (this.defaultValue) {
      return;
    }
    // if (null == this.state.expression || this.state.expression == "") {
    //   return;
    // }
    // var name = this.state.measureText;
    var widgetModel = {
      Dimension: this.state.dimensions,
      // Measure: [
      //   {
      //     Expression: this.state.expression,
      //     DisplayName: this.state.Expression
      //   }
      // ],
      Measure: this.state.measure,
      Type: "linechart",
      AppId: this.appId
    };

    //Derive filtesr from Global filters.
    var filterList = [];
    if (this.props.globalFilters) {
      filterList = _.clone(this.props.globalFilters);
      //   if (this.state.dimensions && this.state.dimensions.length > 0){
      //     var dimName = this.state.dimensions[0].Name;
      //     this.props.globalFilters.map(function(filter,i){
      //       if(filter.ColName == dimName){
      //         _.remove(filterList, { 'ColName': dimName });
      //       }
      //     })

      //  }
    }
    //if (this.state.filters) {
    widgetModel.FilterList = filterList;
    //}

    var that = this;
    axios
      .post(this.serviceGetDataUrl, widgetModel)
      .then(response => {
        console.log("response", response);
        if (response && response.data && response.data.Data) {
          let data = response.data.Data;
          // // var graphData = [];
          // // _.each(data, function (item) {
          // //       var yValue = item[that.state.measure[0].Expression];
          // //       var xValue = item[that.state.dimensions[0].Name];
          // //       graphData.push({x:xValue, y:yValue});
          // //     })

          // //debugger;
          // var graphData = [];
          // if(that.state.measure.length == 1){
          //   var obj = { 'label': that.state.dimensions[0].Name, 'data': [] };
          //   _.each(data, function (item) {
          //     var yValue = item[that.state.measure[0].Expression];
          //     var xValue = item[that.state.dimensions[0].Name];
          //     obj.data.push({x:xValue, y:yValue});
          //   })
          //   graphData.push(obj);
          // } else if(that.state.measure.length > 1){
          //   _.each(that.state.measure, function (ms) {
          //     var obj = { 'label': ms.Expression, 'data': [] };
          //     var dimName = that.state.dimensions[0].Name;

          //     _.each(data, function (item) {
          //       var yValue = item[ms.Expression] == null? 0: item[ms.Expression];
          //       var xValue = item[that.state.dimensions[0].Name];
          //       obj.data.push({x:xValue, y:yValue});
          //     })
          //     graphData.push(obj);
          //   })
          // }

          this.setState({
            // data: [
            //   {
            //     label: that.state.dimensions[0].Name,
            //     data: graphData
            //   }
            // ]
            //data: graphData
            //data: [{values: data}]  //for nvd3
            data: data,
            showSettings: true
          });
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  handleMeasureChange = i => evt => {
    this.measure = this.measure.map((m, midx) => {
      if (i !== midx) return m;
      return { ...m, Expression: evt.target.value };
    });
  };

  handleDimChange = i => evt => {
    //debugger;
    // console.log("this.dimensions**********",this.dimensions);
    this.dimensions = this.dimensions.map((m, midx) => {
      if (i !== midx) return m;
      return { ...m, Name: evt.target.value };
    });
  };

  ShowConfigForm() {
    let dims = this.state.dimensions.map((dim, i) => {
      return (
        <li key={"dim" + i} className="input-group mb-1">
          <input
            type="text"
            placeholder="Enter Dimension"
            className="form-control"
            defaultValue={this.state.dimensions[i].Name}
            onChange={this.handleDimChange(i)}
          />
          <div className="input-group-append">
            <a
              href="#"
              id="removeDimensionField"
              className="btn btn-danger"
              onClick={() => this.deleteDimension(dim)}
            >
              <i className="fa fa-remove" />
            </a>
          </div>
        </li>

        // <div key={i}>
        //   <label>Dimension:</label>
        //   <input
        //     type="text"
        //     placeholder="Enter Dimension"
        //     defaultValue={this.state.dimensions[i].Name}
        //     onChange={this.handleDimChange(i)}
        //   />
        // </div>
      );
    });

    let measures = this.state.measure.map((m, i) => {
      return (
        <li key={"measure" + i} className="input-group mb-1">
          <input
            type="text"
            placeholder="Enter Expression"
            className="form-control"
            defaultValue={this.state.measure[i].Expression}
            onChange={this.handleMeasureChange(i)}
          />
          <div className="input-group-append">
            {/* <a href="#" id="removeMeasuresField" className="btn btn-success">
            <i className="fa fa-save" />
          </a> */}
            <a
              href="#"
              id="removeMeasuresField"
              className="btn btn-danger"
              onClick={() => this.deleteMeasure(m)}
            >
              <i className="fa fa-remove" />
            </a>
          </div>
        </li>

        // <div key={i}>
        //   <label>Measure:</label>
        //   <input
        //     type="text"
        //     placeholder="Enter Expression"
        //     defaultValue={this.state.measure[i].Expression}
        //     onChange={this.handleMeasureChange(i)}
        //   />
        //   <span>
        //     <a href="#" onClick={() => this.addNewMeasure()}>
        //       +
        //     </a>
        //   </span>
        //   <span>
        //     <a href="#" onClick={() => this.deleteMeasure(m)}>
        //       X
        //     </a>
        //   </span>
        // </div>
      );
    });

    let save = (
      <div key="button">
        <button className="btn btn-primary" onClick={() => this.saveForm()}>
          Apply
        </button>
        &nbsp;&nbsp;{" "}
        <button
          className="btn btn-danger"
          onClick={e => this.toggleConfirmForm(e)}
        >
          Cancel
        </button>
      </div>
    );

    let ui = (
      <PropertyWindow>
        <div style={this.property_window}>
          <h2>
            {" "}
            - <i>Line Chart</i>
          </h2>
          <hr />
          <h5>
            Dimension
            {/* {"  "}
            <a
              href="#"
              id="addDimensionField"
              className="btn btn-xs btn-info"
              onClick={() => this.addNewDimension()}
            >
              <i className="fa fa-plus" />
            </a> */}
          </h5>
          <ul id="dimensions-wrapper" className="list-unstyled">
            {dims}
          </ul>

          <h5>
            Measures{" "}
            <a
              href="#"
              id="addMeasuresField"
              className="btn btn-xs btn-info"
              onClick={() => this.addNewMeasure()}
            >
              <i className="fa fa-plus" />
            </a>
          </h5>
          <ul id="measures-wrapper" className="list-unstyled">
            {measures}
          </ul>
          {save}
        </div>
      </PropertyWindow>
    );
    return ui;
  }

  addNewMeasure() {
    var m = {};
    this.measure.push(m);
    this.setState({
      measure: this.measure
    });
  }

  deleteMeasure(m) {
    var measure = this.measure.filter(l => {
      return l.Expression != m.Expression;
    });
    this.setState({
      measure
    });
    this.measure = measure;
  }

  saveForm() {
    this.defaultValue = false;
    this.toggleConfirmForm();
    this.setState(
      {
        dimensions: this.dimensions,
        measure: this.measure
      },
      () => {
        this.props.onConfigurationChange({
          dimensions: this.dimensions,
          measure: this.measure,
          title: this.state.title,
          layoutId: this.layoutId,
          //filters: this.state.filters,
          id: this.id
        });
        this.fetchData();
      }
    );
  }

  componentWillUnmount() {
    console.log("Unmounting LineChart....Why ???");
  }

  render() {
    console.log("LineChart: Render ", this.state.hello);
    var showSettingLinkUI = (
      <span>
        <a href="#" onClick={e => this.toggleConfirmForm(e)}>
          Settings
        </a>{" "}
        <a className="right" href="#" onClick={this.onDeleteBox}>
          X
        </a>
      </span>
    );

    var defaultView = (
      <div>
        <button onClick={this.toggleConfirmForm}>Add Measure</button>
      </div>
    );

    var reChartLineView = this.measure.map((m, i) => {
      return (
        <Line
          key={i}
          type="monotone"
          dataKey={m ? m.Expression : ""}
          stroke={colors[i % 10]}
        />
      );
    });

    var view = (
      <ContainerDimensions>
        {({ width, height }) => (
          <ReLineChart
            width={width}
            height={height - 15}
            data={this.state.data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={this.dimensions ? this.dimensions[0].Name : ""} />
            <YAxis />
            <Tooltip />
            <Legend />
            {reChartLineView}
          </ReLineChart>
        )}
      </ContainerDimensions>
    );

    console.log("LineChart render called");

    return (
      <React.Fragment>
        {(!this.state.data ||
          (this.state.data && this.state.data.length == 0)) &&
          defaultView}
        {this.state.showSettings && this.props.mode != "preview" && showSettingLinkUI}
        {this.state.data && this.state.data.length > 0 && view}
        {this.state.isFormVisible && this.props.mode != "preview" && this.ShowConfigForm()}
      </React.Fragment>
    );
  }
}
