import React, { Component } from "react";
//import ReactDOM from 'react-dom';
import axios from "axios";
//import { Chart, Axis, Series, Tooltip, Cursor, Line, Bar } from "react-charts";
import {BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from  "recharts";
//import NVD3Chart from "react-nvd3";
//import { VictoryChart,VictoryBar } from "victory";
//import Chart from "chart.js";
import $ from "jquery";
// import ChartistGraph from 'react-chartist';
// import {XYPlot, LineSeries} from 'react-vis';
import Toolbox from "./toolbox.js";
import PropertyWindow from "./property-window";
import ContainerDimensions from 'react-container-dimensions';
import { scaleOrdinal, schemeCategory10 } from 'd3-scale';
var _ = require("lodash");
// import recharts from 'recharts';

const data = [
  {"Enter Dimension": 'x1', "Enter Expression": 100},
  {"Enter Dimension": 'x2', "Enter Expression": 200},
  {"Enter Dimension": 'x3', "Enter Expression": 50}
];

const colors = scaleOrdinal(schemeCategory10).range();


export default class BarChart extends Toolbox {
  constructor(props) {
    super(props);
    this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
    this.saveForm = this.saveForm.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.ShowConfigForm = this.ShowConfigForm.bind(this);

    this.globalFilters = this.props.globalFilters
    this.filters =[];

    // var dim = {Name:'ProductInventory.Shelf'};

    // var measure = {Expression:'sum(ProductInventory.Quantity)'};

   
    this.layoutId= props.layoutId;
    this.id =  props.id;   
    this.dimensions =props.dimensions;
    this.measure =props.measure;
    this.defaultValue = false;

    // this.dimensions = [{Name:""}];
    // this.measure = [{Expression:""}];
    if(!this.dimensions || !this.measure){
      // var dim = {Name:'employee1.city'};
      // //var dim2 = {Name:'skills1.skill'};
      // var measure = {Expression:'count(employee1.city)'};
      // var measure2 = {Expression:'count(employee1.ename)'};

      var dim = {Name:'Enter Dimension'};
      //var dim2 = {Name:'skills1.skill'};
      var measure = {Expression:'Enter Expression'};
      this.dimensions=[dim];
      this.measure=[measure];
      this.defaultValue = true;
    }

    this.state = {
      dimensions:this.dimensions,
      measure: this.measure,//,measure2],   
      isFormVisible: props.isFormVisible,
      showSettings: true,
      data:data
    };

  }

  // componentDidCatch(error, info){
  //    // Display fallback UI
  //    this.setState({ hasError: true });
  //    // You can also log the error to an error reporting service
  //   console.log("Error in bar chart", error);
  // }
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

fetchData() {
    if(this.defaultValue){
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
      .post(this.serviceGetDataUrl, widgetModel)
      .then(response => {
        console.log("response", response);
        if (response && response.data) {
          // // var graphData = [];
          // // _.each(response.data, function (item) {
          // //       var yValue = item[that.state.measure[0].Expression];
          // //       var xValue = item[that.state.dimensions[0].Name];
          // //       graphData.push({x:xValue, y:yValue});
          // //     })

          // //debugger;
          // var graphData = [];
          // if(that.state.measure.length == 1){
          //   var obj = { 'label': that.state.dimensions[0].Name, 'data': [] };
          //   _.each(response.data, function (item) {
          //     var yValue = item[that.state.measure[0].Expression];
          //     var xValue = item[that.state.dimensions[0].Name];
          //     obj.data.push({x:xValue, y:yValue});
          //   })
          //   graphData.push(obj);
          // } else if(that.state.measure.length > 1){
          //   _.each(that.state.measure, function (ms) {   
          //     var obj = { 'label': ms.Expression, 'data': [] };
          //     var dimName = that.state.dimensions[0].Name;

          //     _.each(response.data, function (item) {
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
            //data: [{values: response.data}]  //for nvd3
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
      //console.log("this.measure**********",this.measure);
      this.measure = this.measure.map((m, midx) => {
        if (i !== midx) return m;
        return { ...m, Expression: evt.target.value };
      });
      //console.log("this.measure**********",this.measure);
      
      //this.setState({ measure: this.measure });
  }

  handleDimChange = (i) =>(evt) =>{
    //debugger;
   // console.log("this.dimensions**********",this.dimensions);
    this.dimensions = this.dimensions.map((m, midx) => {
      if (i !== midx) return m;
      return { ...m, Name: evt.target.value };
    });
    //console.log("this.dimensions**********",this.dimensions);

    //this.setState({hello:"Urvashi"});

   //this.setState({ dimensions: this.dimensions });
}

  ShowConfigForm() {

    
   
    let dims = this.state.dimensions.map((dim,i)=>{
      return( <div  key={i}>
        <label>Dimension:</label>
         <input        
           type="text"
           placeholder="Enter Dimension"           
           defaultValue={this.state.dimensions[i].Name}
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
               defaultValue= {this.state.measure[i].Expression} 
               onChange ={this.handleMeasureChange(i)}
             />  
             <span><a href="#" onClick={() => this.addNewMeasure()}>+</a></span>  
             <span><a href="#" onClick={() => this.deleteMeasure(m)}>X</a></span>         
           </div>)
      })

      let save = (<div key="button"><button onClick={() =>this.saveForm()}>Apply</button> 
                  <button onClick={(e) => this.toggleConfirmForm(e)}>Cancel</button>
                  </div>)
   
      let ui= (
        <PropertyWindow>
          <div style={this.property_window}>
            {dims}
            {measures}
            {save}
          </div>
        </PropertyWindow>
      );   
    return ui;
  };

  addNewMeasure(){    
    var m = {};
    this.measure.push(m);
    this.setState(
      {        
        measure: this.measure
      });
  }

  deleteMeasure(m){    
    var measure = this.measure.filter((l)=>{
      return l.Expression != m.Expression;
    })
    this.setState({
      measure
    });
    this.measure = measure;    
  }

  saveForm(){
    this.defaultValue = false;
    this.toggleConfirmForm();
    console.log("this.state",this.state);
    console.log("this.dimensions",this.dimensions);
    console.log("this.measure",this.measure);
    // this.props.onConfigurationChange({
    //   measure: this.state.measure,
    //   dimensions: this.state.dimensions,
    //   title: this.state.title,
    //   layoutId: this.state.layoutId,
    //   filters: this.state.filters
    // });
    //debugger;
    // this.setState((prevState) => {
    //   // Important: read `prevState` instead of `this.state` when updating.
    //   return {
    //     dimensions: this.dimensions,
    //     measure: this.measure
    //   }
    // },() => {
    //   //debugger;
    //   console.log("this.dimensionsthis.dimensions",this.dimensions);
    //   this.props.onConfigurationChange({
    //     dimensions: this.dimensions,
    //     measure: this.measure,
    //     title: this.state.title,
    //     layoutId: this.state.layoutId,
    //     //filters: this.state.filters,
    //     id: this.id
    //   });
    //   this.fetchData();
    // });

    
    // this.setState({hello:"Urvashi"},
    //   () => {
    //   console.log("FAILURE>>>>>>>");
    // });

    this.setState(
      {
        dimensions: this.dimensions,
        measure: this.measure
      },
      () => {
        //debugger;
       // console.log("this.dimensionsthis.dimensions",this.dimensions);
       // console.log("this.measurethis.measure",this.measure);
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
  

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.globalFilters != this.props.globalFilters) {
  //     this.fetchData();
  //   }
  //   // if($(".react-grid-item").length > 0){
  //   //   this.height =  window.getComputedStyle($(".react-grid-item")[0]).height.replace("px","");
  //   //   this.width =  window.getComputedStyle($(".react-grid-item")[0]).width.replace("px","");
  //   // }
    
  // }
  // componentDidMount() {
  //   console.log("componentDidMount");
  //   var dimple = window.dimple;
  //   // this.svg = dimple.newSvg("#chart");
  //   // this.chart = new dimple.chart(this.svg, "100%","100%");
  //   // this.chart.addCategoryAxis("x", "employee1.city");
  //   // this.chart.addMeasureAxis("y", "count(employee1.ename)");
  //   // this.chart.addSeries(null, dimple.plot.bar);
   
  //   // this.fetchData();
  //   // if($(".react-grid-item").length > 0){
  //   //   this.height =  window.getComputedStyle($(".react-grid-item")[0]).height.replace("px","");
  //   //   this.width =  window.getComputedStyle($(".react-grid-item")[0]).width.replace("px","");
  //   // }
    
  // //   var ctx = this.canv.getContext("2d");
  // //   this.chart = new Chart(ctx, {
  // //     type: 'bar',
  // //     data: {
  // //         labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  // //         datasets: [{
  // //             label: '# of Votes',
  // //             data: [12, 19, 3, 5, 2, 3],
  // //             backgroundColor: [
  // //                 'rgba(255, 99, 132, 0.2)',
  // //                 'rgba(54, 162, 235, 0.2)',
  // //                 'rgba(255, 206, 86, 0.2)',
  // //                 'rgba(75, 192, 192, 0.2)',
  // //                 'rgba(153, 102, 255, 0.2)',
  // //                 'rgba(255, 159, 64, 0.2)'
  // //             ],
  // //             borderColor: [
  // //                 'rgba(255,99,132,1)',
  // //                 'rgba(54, 162, 235, 1)',
  // //                 'rgba(255, 206, 86, 1)',
  // //                 'rgba(75, 192, 192, 1)',
  // //                 'rgba(153, 102, 255, 1)',
  // //                 'rgba(255, 159, 64, 1)'
  // //             ],
  // //             borderWidth: 1
  // //         }]
  // //     },
  // //     options: {
  // //         scales: {
  // //             yAxes: [{
  // //                 ticks: {
  // //                     beginAtZero:true
  // //                 }
  // //             }]
  // //         },
  // //         responsive:true,
  // //        maintainAspectRatio:true
  // //     }
  // // });

  // }

  // toggleConfirmForm = () => {
  //   this.setState(prevState => ({
  //     isFormVisible: !prevState.isFormVisible,
  //     showSettings: prevState.isFormVisible
  //   }));
  // };

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
  // static getDerivedStateFromProps(props, state) {
  //   //debugger;   
  //   var isChanged = false;
  //   var newState = {...state};
  //   if(props.containerHeight != state.containerHeight){
  //     newState.containerHeight = props.containerHeight;
  //     isChanged = true;
  //   }
  //   if(props.containerWidth != state.containerWidth){
  //     newState.containerWidth = props.containerWidth;
  //     isChanged = true;
  //   }
  //   // if(props.dimensions != state.dimensions){
  //   //   newState.dimensions = props.dimensions;
  //   //   isChanged = true;
  //   // }
  //   if(isChanged){
  //     return newState;
  //   }
  //   return null;
  // }

  componentWillUnmount() {
    console.log("Unmounting Barchart....Why ???");
  }

  render() {
    console.log("BARCHART: Render ", this.state.hello);
    var showSettingLinkUI = (<span><a href="#" onClick={(e) => this.toggleConfirmForm(e)}>Settings</a> <a className="right" href="#" onClick={this.onDeleteBox}>X</a></span>);

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

    var reChartBarView = this.measure.map((m,i)=>{
      return( 
        <Bar key={i} dataKey={(m)?m.Expression:""}  fill={colors[i % 10]} />
      )
    });

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
  <ContainerDimensions>
      { ({ width, height }) => 
        // <NVD3Chart id="barChart" 
        //   width={width} height={height}  type="discreteBarChart" datum={this.state.data} x={(this.state.dimensions)?this.state.dimensions[0].Name:""} y={(this.state.measure)?this.state.measure[0].Expression:""} />

        <ReBarChart width={width} height={height-15} data={this.state.data}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey={(this.dimensions)?this.dimensions[0].Name:""}/>       
            <YAxis/>
            <Tooltip/>
            <Legend />
            {reChartBarView}
            {/* <Bar dataKey={(this.measure)?this.measure[0].Expression:""} fill="#8884d8" />        */}
            {/* <Bar dataKey={(this.measure)?this.measure[1].Expression:""} fill="#82ca9d" /> */}
            {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
        </ReBarChart>
      }
  </ContainerDimensions>
      
      
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
        {this.state.data && this.state.data.length > 0 && view}
        {this.state.isFormVisible && this.ShowConfigForm()}
        {/* <div style={{position:"relative",height:"50vh"}} >
         <canvas ref={(canv)=>this.canv = canv}  width="100%" height="100%"></canvas>
        </div> */}
      </React.Fragment>
    );
  }
}
