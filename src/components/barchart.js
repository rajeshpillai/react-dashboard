import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from "axios";
import { Chart, Axis, Series, Tooltip, Cursor, Line, Bar } from "react-charts";
import $ from "jquery";
var _ = require("lodash");


export default class BarChart extends Component {
  constructor(props) {
    super(props);
    this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
    this.fetchData = this.fetchData.bind(this);

    this.globalFilters = this.props.globalFilters
    this.filters =[];

    // var dim = {Name:'ProductInventory.Shelf'};

    // var measure = {Expression:'sum(ProductInventory.Quantity)'};

    var dim = {Name:'employee1.city'};
    var measure = {Expression:'count(employee1.ename)'};
    //var measure2 = {Expression:'sum(Product.Weight)'};

    this.state = {
      dimensions:[dim],
      measure: [measure],//,measure2],   
      isFormVisible: false,
      showSettings: false
    };

    this.fetchData();
  }

  componentDidCatch(error, info){
     // Display fallback UI
     this.setState({ hasError: true });
     // You can also log the error to an error reporting service
    console.log("Error in bar chart", error);
  }
  // data = [
  //   {
  //     label: "India",
  //     data: [{ x: 'A', y: 10 }, { x: 'B', y: 10 }, { x: 'C', y: 10 }]
  //   },
  //   {
  //     label: "US",
  //     data: [{ x: 'sas', y: 10 }, { x: 'T2', y: 10 }, { x: 'T3', y: 10 }]
  //   },
  //   {
  //     label: "Germani",
  //     data: [{ x: 'aA', y: 10 }, { x: 'C2', y: 10 }, { x: 'C3', y: 10 }]
  //   }
  // ];
  
  

//   data=[
//     {
//         label: "Series 1",
//         data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
//     },
//     {
//         label: "Series 2",
//         data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
//     }
//   //   {
//   //     label: "Series 1",
//   //     data: [['P1', 1], ['P2', 2], ['P3', 4], ['P4', 2], ['P5', 7]]
//   // },
// //   {
// //     //label: "Series 1",
// //     data: [{'key': 'S',x:'P1',y:1},{'key': 'S',x:'P2',y:3},{'key': 'S',x:'P3',y:10}]
// // }
//  ];


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
          // var graphData = [];
          // _.each(response.data, function (item) {
          //       var yValue = item[that.state.measure[0].Expression];
          //       var xValue = item[that.state.dimensions[0].Name];
          //       graphData.push({x:xValue, y:yValue});
          //     })

          //debugger;
          var graphData = [];
          if(that.state.measure.length == 1){
            var obj = { 'label': that.state.dimensions[0].Name, 'data': [] };
            _.each(response.data, function (item) {
              var yValue = item[that.state.measure[0].Expression];
              var xValue = item[that.state.dimensions[0].Name];
              obj.data.push({x:xValue, y:yValue});
            })
            graphData.push(obj);
          } else if(that.state.measure.length > 1){
            _.each(that.state.measure, function (ms) {   
              var obj = { 'label': ms.Expression, 'data': [] };
              var dimName = that.state.dimensions[0].Name;

              _.each(response.data, function (item) {
                var yValue = item[ms.Expression] == null? 0: item[ms.Expression];
                var xValue = item[that.state.dimensions[0].Name];
                obj.data.push({x:xValue, y:yValue});               
              })
              graphData.push(obj);
            })
          }

         
          this.setState({
            // data: [
            //   {
            //     label: that.state.dimensions[0].Name,
            //     data: graphData
            //   }
            // ]
            //data: graphData
            data: response.data
            ,
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

      let save = (<div key="button"><button onClick={this.saveForm}>Apply</button> 
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
    var dimple = window.dimple;
    this.svg = dimple.newSvg("#chart");
    this.chart = new dimple.chart(this.svg, "100%","100%");
    this.chart.addCategoryAxis("x", "employee1.city");
    this.chart.addMeasureAxis("y", "count(employee1.ename)");
    this.chart.addSeries(null, dimple.plot.bar);
   
    this.fetchData();

    // var that = this;
    //   // Add a method to draw the chart on resize of the window
    //   window.onresize = function () {
    //     // As of 1.1.0 the second parameter here allows you to draw
    //     // without reprocessing data.  This saves a lot on performance
    //     // when you know the data won't have changed.
    //     that.chart.draw(0, true);
    // };
  }

  toggleConfirmForm = () => {
    this.setState(prevState => ({
      isFormVisible: !prevState.isFormVisible,
      showSettings: prevState.isFormVisible
    }));
  };

  // componentDidUpdate(prevProps, prevState) {

  //   var svg = $("#chart svg");
  //   svg.height("80px");
  //   svg.width("180px");
  //   // var node = ReactDOM.findDOMNode(this.svg);
  //   // node.height = "80%";
  //   // node.width ="80%";
  // }

  render() {
    console.log("KPI: Render");
    var showSettingLinkUI = (<span><a href="#" onClick={(e) => this.toggleConfirmForm(e)}>Settings</a></span>);

    var defaultView = (
      <div>
        <button onClick={this.toggleConfirmForm}>Add Measure</button>
      </div>
    );

    
    // var data = [
    //   { "Word":"Hello", "Awesomeness":2000 },
    //   { "Word":"World", "Awesomeness":3000 }
    // ];
    var data = this.state.data;
    var dimple = window.dimple;
    //var chart = new dimple.chart(this.svg, data);
    var chart = this.chart;
    if(chart && this.state.data){
      //debugger;
      chart.data = data;
      
      var svg = $("#chart svg");      
      //debugger;
       svg.height(svg.parent().height()-10);
       svg.width(svg.parent().width()-10);
      //
      chart.draw();

      //chart.draw(0,true);
    }

    var view = (
      <span></span>
      
      // <Chart data={this.state.data}>
      //       <Axis primary type="ordinal" />
      //       <Axis type="linear" stacked />
      //       <Series type={Bar} />
      //       <Cursor primary />
      //       <Cursor />
      //       <Tooltip />
      //    </Chart>
    );

    console.log("barchart render called");

    return (      
      <React.Fragment>
        {(!this.state.data || (this.state.data && this.state.data.length == 0)) && defaultView}
        {this.state.showSettings && showSettingLinkUI }
        {!this.state.isFormVisible && this.state.data && this.state.data.length > 0 && view}
        {this.state.isFormVisible && this.ShowConfigForm()}
        <div id="chart" width="100%" height="100%"></div>
      </React.Fragment>
    );
  }
}
