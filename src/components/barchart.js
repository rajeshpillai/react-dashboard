import React, { Component } from "react";
import axios from "axios";
import { Chart, Axis, Series, Tooltip, Cursor, Line, Bar } from "react-charts";
var _ = require("lodash");

export default class BarChart extends Component {
  constructor(props) {
    super(props);
    this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
    this.fetchData = this.fetchData.bind(this);

    this.globalFilters = this.props.globalFilters
    this.filters =[];

    var dim = {Name:'ProductInventory.Shelf'};

    var measure = {Expression:'sum(ProductInventory.Quantity)'};

    this.state = {
      dimensions:[dim],
      measure: [measure],   
      isFormVisible: false,
      showSettings: false
    };

    this.fetchData();
  }


  

//   data=[
//     // {
//     //     label: "Series 1",
//     //     data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
//     // },
//     // {
//     //     label: "Series 2",
//     //     data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
//     // }
//   //   {
//   //     label: "Series 1",
//   //     data: [['P1', 1], ['P2', 2], ['P3', 4], ['P4', 2], ['P5', 7]]
//   // }
//   {
//     label: "Series 1",
//     data: [{x:'P1',y:1},{x:'P2',y:3},{x:'P3',y:10}]
// }
 //];


  serviceBaseUrl = "http://localhost:57387/api/";

  fetchData() {
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
      Type: "chart"
    };

    //Derive filtesr from Global filters.
    var filterList = [];
    if(this.props.globalFilters){
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
      .post(this.serviceBaseUrl + "data/getData", widgetModel)
      .then(response => {
        console.log("response", response);
        if (response && response.data) {
          //debugger;
          var graphData = [];
          _.each(response.data, function (item) {
            var yValue = item[that.state.measure[0].Expression];
            var xValue = item[that.state.dimensions[0].Name];
            graphData.push({x:xValue, y:yValue});
          })
          this.setState({
            data: [
              {
                label: "Series 1",
                data: graphData
              }],
              showSettings:true             
          });
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  handleMeasureChange = (i) =>(evt) =>{
      //debugger;
      const measures = this.state.measure.map((m, midx) => {
        if (i !== midx) return m;
        return { ...m, Expression: evt.target.value };
      });
      
      this.setState({ measure: measures });
  }

  handleDimChange = (i) =>(evt) =>{
    //debugger;
    const dims = this.state.dimensions.map((m, midx) => {
      if (i !== midx) return m;
      return { ...m, Name: evt.target.value };
    });
    
    this.setState({ dimensions: dims });
}

  ShowConfigForm = () => {
   
    let dims = this.state.dimensions.map((dim,i)=>{
      return( <div  key={i}>
        <label>Dimension:</label>
         <input         
           type="text"
           placeholder="Enter Dimention"
           value= {dim.Name} 
           onChange ={this.handleDimChange(i)}
         />      
       </div>)
       })

    let measures = 
         this.state.measure.map((m,i)=>{
          return( <div key={i}>
            <label>Measure:</label>
             <input         
               type="text"
               placeholder="Enter Expression"
               value= {m.Expression} 
               onChange ={this.handleMeasureChange(i)}
             />             
           </div>)
      })

      let save = (<div><button onClick={this.saveForm}>Apply</button> 
                  <button onClick={(e) => this.toggleConfirmForm(e)}>Cancel</button>
                  </div>)
   
      let ui=[dims,measures,save];     

    return ui;
  };

  saveForm = () => {
    this.toggleConfirmForm();
    this.props.onConfigurationChange({
      measure: this.state.measure,
      dimensions: this.state.dimensions,
      title: this.state.title,
      layoutId: this.state.layoutId,
      filters: this.state.filters
    });
    this.fetchData();
    // let measure = {
    //   Expression: this.inpExpr.value // this.state.expression
    // };

    // this.setState(
    //   {
    //     expression: this.inpExpr.value,
    //     measure: [measure]
    //   },
    //   () => {
    //     this.props.onConfigurationChange({
    //       measure: [measure],
    //       title: this.state.title,
    //       layoutId: this.state.layoutId,
    //       filters: this.state.filters
    //     });
    //     this.fetchData();
    //   }
    // );
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.globalFilters != this.props.globalFilters) {
      this.fetchData();
    }
  }
  componentDidMount() {
    console.log("componentDidMount");
    this.fetchData();
  }

  toggleConfirmForm = () => {
    this.setState(prevState => ({
      isFormVisible: !prevState.isFormVisible,
      showSettings: prevState.isFormVisible
    }));
  };

  render() {
    console.log("KPI: Render");
    var showSettingLinkUI = (<span><a href="#" onClick={(e) => this.toggleConfirmForm(e)}>Settings</a></span>);

    var defaultView = (
      <div>
        <button onClick={this.toggleConfirmForm}>Add Measure</button>
      </div>
    );

    var view = (
      <Chart data={this.state.data}>
            <Axis primary type="ordinal" />
            <Axis type="linear" stacked />
            <Series type={Bar} />
            <Cursor primary />
            <Cursor />
            <Tooltip />
         </Chart>
    );

    return (
      <React.Fragment>
        {(!this.state.data || (this.state.data && this.state.data.length == 0)) && defaultView}
        {this.state.showSettings && showSettingLinkUI }
        {!this.state.isFormVisible && this.state.data && this.state.data.length > 0 && view}
        {this.state.isFormVisible && this.ShowConfigForm()}
      </React.Fragment>
    );
  }
}
