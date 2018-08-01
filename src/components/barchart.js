import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from "axios";
import { Chart, Axis, Series, Tooltip, Cursor, Line, Bar } from "react-charts";
//import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from  "recharts";
import NVD3Chart from "react-nvd3";
//import { VictoryChart,VictoryBar } from "victory";
//import Chart from "chart.js";
import $ from "jquery";
import ChartistGraph from 'react-chartist';
import {XYPlot, LineSeries} from 'react-vis';
import Dimensions from 'react-dimensions'
var _ = require("lodash");


// import recharts from 'recharts';

const data = [
  {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
  {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
  {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
  {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
  {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
  {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
  {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

class BarChart1 extends Component {
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
      showSettings: false,
      containerWidth: 87,
      containerHeight: 98
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
            data: [{values: response.data}]
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
    // if($(".react-grid-item").length > 0){
    //   this.height =  window.getComputedStyle($(".react-grid-item")[0]).height.replace("px","");
    //   this.width =  window.getComputedStyle($(".react-grid-item")[0]).width.replace("px","");
    // }
    
  }
  componentDidMount() {
    console.log("componentDidMount");
    var dimple = window.dimple;
    // this.svg = dimple.newSvg("#chart");
    // this.chart = new dimple.chart(this.svg, "100%","100%");
    // this.chart.addCategoryAxis("x", "employee1.city");
    // this.chart.addMeasureAxis("y", "count(employee1.ename)");
    // this.chart.addSeries(null, dimple.plot.bar);
   
    // this.fetchData();
    // if($(".react-grid-item").length > 0){
    //   this.height =  window.getComputedStyle($(".react-grid-item")[0]).height.replace("px","");
    //   this.width =  window.getComputedStyle($(".react-grid-item")[0]).width.replace("px","");
    // }
    
  //   var ctx = this.canv.getContext("2d");
  //   this.chart = new Chart(ctx, {
  //     type: 'bar',
  //     data: {
  //         labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  //         datasets: [{
  //             label: '# of Votes',
  //             data: [12, 19, 3, 5, 2, 3],
  //             backgroundColor: [
  //                 'rgba(255, 99, 132, 0.2)',
  //                 'rgba(54, 162, 235, 0.2)',
  //                 'rgba(255, 206, 86, 0.2)',
  //                 'rgba(75, 192, 192, 0.2)',
  //                 'rgba(153, 102, 255, 0.2)',
  //                 'rgba(255, 159, 64, 0.2)'
  //             ],
  //             borderColor: [
  //                 'rgba(255,99,132,1)',
  //                 'rgba(54, 162, 235, 1)',
  //                 'rgba(255, 206, 86, 1)',
  //                 'rgba(75, 192, 192, 1)',
  //                 'rgba(153, 102, 255, 1)',
  //                 'rgba(255, 159, 64, 1)'
  //             ],
  //             borderWidth: 1
  //         }]
  //     },
  //     options: {
  //         scales: {
  //             yAxes: [{
  //                 ticks: {
  //                     beginAtZero:true
  //                 }
  //             }]
  //         },
  //         responsive:true,
  //        maintainAspectRatio:true
  //     }
  // });

  }

  toggleConfirmForm = () => {
    this.setState(prevState => ({
      isFormVisible: !prevState.isFormVisible,
      showSettings: prevState.isFormVisible
    }));
  };

  // componentDidUpdate(prevProps, prevState) {

  //   // var svg = $("#chart svg");
  //   // svg.height("80px");
  //   // svg.width("180px");
  //   // // var node = ReactDOM.findDOMNode(this.svg);
  //   // // node.height = "80%";
  //   // // node.width ="80%";

  //   this.height =  $(".react-grid-item").height();
  //   this.width =  $(".react-grid-item").width();
  //  //  if($(".react-grid-item").length > 0){
  //  //   width =  $(".react-grid-item").getBoundingClientRect().width;
  //  //  }
    
  //   //alert(height);
  //   //alert(width);
  //   console.log("height",this.height);
  //   console.log("width",this.width);
  // }
  static getDerivedStateFromProps(props, state) {
    //debugger;   
    var isChanged = false;
    var newState = {...state};
    if(props.containerHeight != state.containerHeight){
      newState.containerHeight = props.containerHeight;
      isChanged = true;
    }
    if(props.containerWidth != state.containerWidth){
      newState.containerWidth = props.containerWidth;
      isChanged = true;
    }
    if(isChanged){
      return newState;
    }
    return null;
  }

  

  render() {
    console.log("KPI: Render");
    var showSettingLinkUI = (<span><a href="#" onClick={(e) => this.toggleConfirmForm(e)}>Settings</a></span>);

    var defaultView = (
      <div>
        <button onClick={this.toggleConfirmForm}>Add Measure</button>
      </div>
    );

    var data1 = [
      {x: 0, y: 8},
      {x: 1, y: 5},
      {x: 2, y: 4},
      {x: 3, y: 9},
      {x: 4, y: 1},
      {x: 5, y: 7},
      {x: 6, y: 6},
      {x: 7, y: 3},
      {x: 8, y: 2},
      {x: 9, y: 0}
    ];
    
    // // var data = [
    // //   { "Word":"Hello", "Awesomeness":2000 },
    // //   { "Word":"World", "Awesomeness":3000 }
    // // ];
    // var data = this.state.data;
    // var dimple = window.dimple;
    // //var chart = new dimple.chart(this.svg, data);
    // var chart = this.chart;
    // if(chart && this.state.data){
    //   //debugger;
    //   chart.data = data;
      
    //   var svg = $("#chart svg");      
    //   //debugger;
    //    svg.height(svg.parent().height()-10);
    //    svg.width(svg.parent().width()-10);
    //   //
    //   chart.draw();

    //   //chart.draw(0,true);
 //   }

  // this.height =  $(".react-grid-item").height();
  // this.width =  $(".react-grid-item").width()-10;
// //  if($(".react-grid-item").length > 0){
// //   width =  $(".react-grid-item").getBoundingClientRect().width;
// //  }
 
//  //alert(height);
//  //alert(width);
//  console.log("height",this.height);
//  console.log("width",this.width);
 var data = [ 
  {
    key: "Cumulative Return",
    values: [
      { 
        "label" : "A Label" ,
        "value" : -29.765957771107
      } , 
      { 
        "label" : "B Label" , 
        "value" : 0
      } , 
      { 
        "label" : "C Label" , 
        "value" : 32.807804682612
      } , 
      { 
        "label" : "D Label" , 
        "value" : 196.45946739256
      } , 
      { 
        "label" : "E Label" ,
        "value" : 0.19434030906893
      } , 
      { 
        "label" : "F Label" , 
        "value" : -98.079782601442
      } , 
      { 
        "label" : "G Label" , 
        "value" : -13.925743130903
      } , 
      { 
        "label" : "H Label" , 
        "value" : -5.1387322875705
      }
    ]
  }
];

var lineChartData = {
  labels: [1, 2, 3, 4, 5, 6, 7, 8],
  series: [
    [5, 9, 7, 8, 5, 3, 5, 4]
  ]
}
var lineChartOptions = {
  low: 0,
  showArea: true
}

  
//  if(!this.state.data){
  
//  }
//var graph = Dimensions()(view);

    var view = (
    //   <XYPlot width={this.props.containerWidth} height={this.props.containerHeight}>
    //   <LineSeries data={data1} />
    // </XYPlot>
      // <ChartistGraph data={lineChartData} options={lineChartOptions} type={'Line'} />
      // <span>asasas</span>
    //   <VictoryChart 
    //   domainPadding={{ x: 50, y: [0, 20] }}
    //   scale={{ x: "time" }}
    // >
    //   <VictoryBar
    //     dataComponent={
    //       <Bar />
    //     }
    //     style={{
    //       data: { fill: "blue" }
    //     }}
    //     data={[
    //       { x: new Date(1986, 1, 1), y: 2 },
    //       { x: new Date(1996, 1, 1), y: 3 },
    //       { x: new Date(2006, 1, 1), y: 5 },
    //       { x: new Date(2016, 1, 1), y: 4 }
    //     ]}
    //   />
    // </VictoryChart>
      <NVD3Chart id="barChart" width={this.state.containerWidth} height={this.state.containerHeight}  type="discreteBarChart" datum={this.state.data} x="employee1.city" y="count(employee1.ename)"/>

      // <BarChart width={783} height={210} data={this.state.data}
      //       margin={{top: 5, right: 30, left: 20, bottom: 5}}>
      //  <CartesianGrid strokeDasharray="3 3"/>
      //  <XAxis dataKey="employee1.city"/>
      //  <YAxis/>
      //  <Tooltip/>
      //  <Legend />
      //  <Bar dataKey="count(employee1.ename)" fill="#8884d8" />
      //  {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
      // </BarChart>
      
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
        {/* <div style={{position:"relative",height:"50vh"}} >
         <canvas ref={(canv)=>this.canv = canv}  width="100%" height="100%"></canvas>
        </div> */}
      </React.Fragment>
    );
  }
}

export default Dimensions({options:{elementResize :true}})(BarChart1) ;