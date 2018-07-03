import React, { Component } from "react";
import axios from "axios";

export default class Kpi extends Component {
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

  serviceBaseUrl = "http://localhost:57387/api/";

  fetchData() {
      if(null == this.state.expression || this.state.expression == ""){
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
        Type: 'kpi'
    };

    if(this.state.filters){
        widgetModel.FilterList=this.state.filters;    
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

  static getDerivedStateFromProps(props, state) {
    if (state && state.measure != null && state.measure.length === 0) {
      return {
        measure: props.measure
      };
    }
    if (props && props.filters != null && props.filters.length > 0) {
        return {
          filters: props.filters
        };
      }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.filters != this.props.filters){
      this.fetchData();
    }
  //
  let test=0;
  console.log("componentDidUpdate state", this.state);
}

  componentDidMount() {
    this.fetchData();
  }

//   onInputChange = event => {
//     event.preventDefault();
//     let measureValue = event.target.value;

//     this.setState({
//       measureText: measureValue
//     });

//     this.setState(
//       {
//         measure: [
//           {
//             Expression: measureValue
//           }
//         ]
//       },
//       () => {
//         this.fetchData();
//       }
//     );
//   };

  ShowConfigForm = () => {
    let form = (
      <div>
        <input
          type="text"
          placeholder="Enter expression"
          onChange={this.handleChange}
          value={this.state.expression}
        />
        <button onClick={this.saveForm}>Apply</button>
      </div>
    );
    return form;
  };

  handleChange = e => {
    this.setState({
      expression: e.target.value
    });
  };

  saveForm = () => {
    this.toggleConfirmForm();
    let measure = {
      Expression: this.state.expression
    };

    this.setState({
      measure: [measure]
    });

    this.fetchData();
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
        {this.state.measure == null && defaultView}
        {this.state.measure != null && view}
        {this.state.isFormVisible && this.ShowConfigForm()}
      </React.Fragment>
    );
  }
}
