import React, { Component } from "react";
import axios from "axios";
import { Chart, Axis, Series, Tooltip, Cursor, Line, Bar } from "react-charts";

export default class LineChart extends Component {
  constructor() {
    super();
    this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }


  state = {
    measure: [],
    value: "",
    expression: "",
    measureText: "",
    isFormVisible: false
  };

  data=[
    {
        label: "Series 1",
        data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
    },
    {
        label: "Series 2",
        data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
    }
];


  serviceBaseUrl = "http://localhost:57387/api/";

  fetchData() {
    if (null == this.state.expression || this.state.expression == "") {
      return;
    }
    var name = this.state.measureText;
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

    if (this.state.filters) {
      widgetModel.FilterList = this.state.filters;
    }

    axios
      .post(this.serviceBaseUrl + "data/getData", widgetModel)
      .then(response => {
        console.log("response", response);
        if (response && response.data) {
          this.setState({
            value: response.data[0][this.state.expression]
          });
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }


  ShowConfigForm = () => {
    let form = (
      <div>
        <input
          ref={inpExpr => (this.inpExpr = inpExpr)}
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
      Expression: this.inpExpr.value // this.state.expression
    };

    this.setState(
      {
        expression: this.inpExpr.value,
        measure: [measure]
      },
      () => {
        this.props.onConfigurationChange({
          measure: [measure],
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
        <Chart data={this.data}>
            <Axis primary type="ordinal" position="left" />
            <Axis type="linear" stacked position="bottom" />
            <Series type={Line} />
            <Cursor primary />
            <Cursor />
            <Tooltip />
         </Chart>
    );
  }
}
