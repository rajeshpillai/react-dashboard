import React, { Component } from 'react';
import axios from 'axios';

export default class Filter extends Component {
   
    constructor(props){
        super(props);
        this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
        this.fetchData = this.fetchData.bind(this);
       
    }

    state ={
        dimensions: [],      
        data :[],
        title: this.props.title,
        dimensionText: "",
        isFormVisible: false,
        selectedValue : ""
    }

    serviceBaseUrl = "http://localhost:57387/api/";
   fetchData() {
    var name = this.state.dimensionText;
    //debugger;
    var widgetModel = {
        Dimension: this.state.dimensions,
        Type: 'filter'
    }
    
    if(this.state.filters){
        widgetModel.FilterList=this.state.filters;    
    }

    axios
      .post(this.serviceBaseUrl + "data/getData", widgetModel)
      .then(response => {
        console.log("response", response);
        if (response && response.data) {
          this.setState({
            data: response.data
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
          type="text"
          placeholder="Enter Dimension"
          onChange={this.handleChange}
          value={this.state.dimensionText}
        />
        <button onClick={this.saveForm}>Apply</button>
      </div>
    );
    return form;
  };

  static getDerivedStateFromProps(props, state) {
      console.log('filter:gds');
    // if (state && state.measure != null && state.measure.length === 0) {
    //   return {
    //     measure: props.measure
    //   };
    // }
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

  handleChange = e => {
    this.setState({
        dimensionText: e.target.value
    });
  };

  handleSelectChange = e =>{
    this.setState({
        selectedValue: e.target.value
    });

    var filter = {colName: this.state.dimensionText,
                  values : [e.target.value]};

    this.props.onFilterChange(filter);
  };

  saveForm = () => {
     //debugger;
    this.toggleConfirmForm();
    let dimension = {
        Name: this.state.dimensionText
    };

    this.setState({
        dimensions: [dimension]
    }, () => {
        this.fetchData();
    });

    
  };

  toggleConfirmForm = () => {
    this.setState(prevState => ({
      isFormVisible: !prevState.isFormVisible
    }));
  };

    render(){
        console.log("Filter: Render");
        var defaultView = (
            <div>
              <button onClick={this.toggleConfirmForm}>Add Dimension</button>
            </div>
          );

          var options = this.state.data.map((v)=>{
            return <option key={v[this.state.dimensionText]} value={v[this.state.dimensionText]}>{v[this.state.dimensionText]}</option>
          })
      
          var view = (
            <div>
              <label>Filter - </label>        
            <span>
                <select value={this.state.selectedValue} onChange={this.handleSelectChange}>
                    <option value="">Select</option>
                    {options}
                </select>
            </span>        
            </div>
          );

        return (
            <React.Fragment>
                <h2>{this.state.title} - </h2>
                {this.state.dimensions.length == 0 && defaultView}
                {this.state.dimensions.length > 0 && view}
                {this.state.isFormVisible && this.ShowConfigForm()}
            </React.Fragment>
            )
    }
}