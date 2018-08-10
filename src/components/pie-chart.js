import React, { Component } from "react";
import axios from "axios";
import {Tooltip, Legend, PieChart as RePieChart, Pie,ResponsiveContainer,Label,LabelList,Cell,Sector} from  "recharts";
import Toolbox from "./toolbox.js";
import PropertyWindow from "./property-window";
import ContainerDimensions from 'react-container-dimensions';
import { scaleOrdinal, schemeCategory10 } from 'd3-scale';
var _ = require("lodash");
const colors = scaleOrdinal(schemeCategory10).range();

const data = [
  {"Enter Dimension": 'x1', "Enter Expression": 100},
  {"Enter Dimension": 'x2', "Enter Expression": 200},
  {"Enter Dimension": 'x3', "Enter Expression": 50}
];

export default class PieChart extends Toolbox {
  constructor(props) {
    super(props);
    this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
    this.saveForm = this.saveForm.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.ShowConfigForm = this.ShowConfigForm.bind(this);

    this.globalFilters = props.globalFilters
    this.filters =[];    
    this.layoutId= props.layoutId;
    this.id =  props.id;
    this.dimensions =props.dimensions;
    this.measure =props.measure;

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

    // this.dimensions = [{Name:""}];
    // this.measure = [{Expression:""}];

    this.state = {
      dimensions:this.dimensions,
      measure: this.measure,   
      isFormVisible: props.isFormVisible,
      showSettings: true,
      data:data
    };

  }

  serviceBaseUrl = "http://localhost:57387/api/";

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
      this.measure = this.measure.map((m, midx) => {
        if (i !== midx) return m;
        return { ...m, Expression: evt.target.value };
      });      
  }

  handleDimChange = (i) =>(evt) =>{
    //debugger;
   // console.log("this.dimensions**********",this.dimensions);
    this.dimensions = this.dimensions.map((m, midx) => {
      if (i !== midx) return m;
      return { ...m, Name: evt.target.value };
    });    
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
    console.log("Unmounting PieChart....Why ???");
  }

  render() {
    console.log("PieChart: Render ");
    var showSettingLinkUI = (<span><a href="#" onClick={(e) => this.toggleConfirmForm(e)}>Settings</a> <a className="right" href="#" onClick={this.onDeleteBox}>X</a></span>);

    var defaultView = (
      <div>
        <button onClick={this.toggleConfirmForm}>Add Measure</button>
      </div>
    );

    // var reChartLineView = this.measure.map((m,i)=>{
    //   return( 
    //     <Line key={i} type="monotone" dataKey={(m)?m.Expression:""} stroke="#8884d8" />
    //   )
    // });

    // var reChartBarView = this.measure.map((m,i)=>{
    //   return( 
    //     <Bar key={i} dataKey={(m)?m.Expression:""} fill="#8884d8" />
    //   )
    // });

    var cellView = this.state.data.map((entry, index) => {
      return(<Cell key={`slice-${index}`} fill={colors[index % 10]} />);
     });
      

    var view = (    
      // <ResponsiveContainer>
      <ContainerDimensions>
          { ({ width, height }) =>    
            <RePieChart width={width} height={height-15}>
              <Legend verticalAlign="top" />
                {/* <Pie dataKey="value"  isAnimationActive={false} data={data01} fill="#8884d8" /> */}
                  <Pie nameKey={(this.dimensions && this.dimensions.length>0)?this.dimensions[0].Name:""} 
                      dataKey={(this.measure && this.measure.length>0)?this.measure[0].Expression:""} 
                      isAnimationActive={true} 
                      data={this.state.data} 
                      fill="#8884d8" label>
                        {cellView}
                        <Label width={50} position="center"></Label>
                      </Pie>
                  {/* <Pie data={data02} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" label/> */}
                  <Tooltip/>
            </RePieChart>  
          }
      </ContainerDimensions>
      // </ResponsiveContainer>      
    );

    console.log("PieChart render called");

    return (      
      <React.Fragment>
        {(!this.state.data || (this.state.data && this.state.data.length == 0)) && defaultView}
        {this.state.showSettings && showSettingLinkUI }
        {this.state.data && this.state.data.length > 0 && view}
        {this.state.isFormVisible && this.ShowConfigForm()}        
      </React.Fragment>
    );
  }
}
