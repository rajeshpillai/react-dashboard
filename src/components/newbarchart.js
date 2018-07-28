import React, { Component } from "react";
import axios from "axios";
var Bar = require('react-d3-basic').BarChart;
var _ = require("lodash");

export default class NewBarChart extends Component {
  constructor(props) {
    super(props);
    this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
    this.fetchData = this.fetchData.bind(this);

    this.globalFilters = this.props.globalFilters
    this.filters =[];

    // var dim = {Name:'ProductInventory.Shelf'};

    // var measure = {Expression:'sum(ProductInventory.Quantity)'};

    var dim = {Name:'employee.city'};
    var measure = {Expression:'count(employee.ename)'};
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
            data: graphData
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
    this.fetchData();
  }

  toggleConfirmForm = () => {
    this.setState(prevState => ({
      isFormVisible: !prevState.isFormVisible,
      showSettings: prevState.isFormVisible
    }));
  };

  render() {
    console.log("Bar Chart: Render");
    var width = 700,
    height = 400,
    title = "Bar Chart",
    chartSeries = [
      {
        field: 'count(employee.ename)',
        name: 'Frequency'
      }
    ],
    x = function(d) {
        console.log('d',d)
      return "aaa";
    },
    xScale = 'ordinal',
    xLabel = "Letter",
    yLabel = "Frequency",
    yTicks = [10, "%"];

    var showSettingLinkUI = (<span><a href="#" onClick={(e) => this.toggleConfirmForm(e)}>Settings</a></span>);

    var defaultView = (
      <div>
        <button onClick={this.toggleConfirmForm}>Add Measure</button>
      </div>
    );

    var view = (
        <Bar
      title= {title}
      data= {this.state.data}
      width= {width}
      height= {height}
      chartSeries = {chartSeries}
      x= {x}
      xLabel= {xLabel}
      xScale= {xScale}
      yTicks= {yTicks}
      yLabel = {yLabel}
    />     
    );

    console.log("barchart render called");

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
