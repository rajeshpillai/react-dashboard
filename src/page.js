import React, { Component } from "react";
import ReactGridLayout from "react-grid-layout";
import Kpi from "./components/kpi";
import Filter from "./components/filter";
import BarChart from './components/barchart';
import LineChart from './components/linechart';
import axios from 'axios';
var _ = require('lodash');

class Page extends Component {
  serviceBaseUrl = "http://localhost:57387/api/";

  // componentDidMount(){
  //    axios
  //   .post(this.serviceBaseUrl + "data/getPageData")
  //   .then(response => {
  //     console.log("response-getPageData", response);
  //     this.setState({
  //       uiComponents: response.data.uiComponents,
  //       layout:  response.data.layout,
  //       globalFilters:  response.data.filters
  //     });
  //     //alert("Page Data Saved Sucessfully !");
  //   })
  //   .catch(function(error) {
  //     console.log("error", error);
  //   });
  // }

  state = {   
    uiComponents: ["KPI", "Filter","BarChart", "LineChart"],
    layout: [
      // { i: "a", x: 0, y: 0, w: 2, h: 2, item: "" },
      // { i: "b", x: 2, y: 0, w: 2, h: 2, item: "" }, //minW: 2, maxW: 4, 
      // { i: "c", x: 4, y: 0, w: 2, h: 2, item: "" },
      // { i: "d", x: 6, y: 0, w: 2, h: 2, item: "" },
      // { i: "e", x: 8, y: 0, w: 2, h: 2, item: "" },
      // { i: "f", x: 0, y: 2, w: 2, h: 2, item: "" },
      // { i: "g", x: 2, y: 2, w: 2, h: 2, item: "" },
      // { i: "h", x: 4, y: 2, w: 2, h: 2, item: "" },
      // { i: "i", x: 6, y: 2, w: 2, h: 2, item: "" },
      // { i: "k", x: 8, y: 2, w: 2, h: 2, item: "" }
    ],
    filters: []
   };

  comps = {
    BarChart: (config) => {
      return (
        <BarChart layoutId={config.layoutId}
          measure = {config.measure}
          label="Bar Chart"
          globalFilters={this.state.globalFilters}
          onFilterChange={(filter,item) => this.onFilterChange(filter,item)} 
          onConfigurationChange ={c => this.onConfigurationChange(c)}
        />
      );
    },

    LineChart: (config) => {
      return (
        <LineChart layoutId={config.layoutId}
          measure = {config.measure}
          label="Bar Chart"
          filters={config.filters}
          onFilterChange={(filter,item) => this.onFilterChange(filter,item)} 
          onConfigurationChange ={c => this.onConfigurationChange(c)}
        />
      );
    },

    KPI: (config) => {
      return (
        <Kpi layoutId={config.layoutId}  id={config.id}
          isFirstTime={config.isFirstTime}
          measure = {config.measure}
          label="KPI Label"
          globalFilters={this.state.globalFilters}
          onFilterChange={(filter,item) => this.onFilterChange(filter,item)} 
          onConfigurationChange ={c => this.onConfigurationChange(c)}
        />
      );
    },
    Filter: (config) => {
      return (
        <Filter layoutId={config.layoutId} id={config.id}
          dimensions = {config.dimensions} 
          title="Filter"
          globalFilters={this.state.globalFilters}
          onFilterChange={(filter,item) => this.onFilterChange(filter,item)} 
          onConfigurationChange ={c => this.onConfigurationChange(c)}
        />      
      );
    }
  };

  onConfigurationChange = config =>{
   console.log('config', config);
    var layout = this.state.layout.map((l) => {
      if(l.i == config.layoutId){
         //l.item = this.comps[l.itemType](config);
         l.item = config;
      }
      return l;
    })

    this.setState({
      layout
    });
    
  }

  onFilterChange = (filter, item) => {
    console.log("filter1111", filter);
    var filters = this.state.globalFilters ? this.state.globalFilters :[];

    if(filter.values && filter.values.length == 1 && filter.values[0].trim().length == 0){
      filters =[];
    } else {
      filters =[];
      filters.push({ ColName: filter.colName, Values: filter.values });
    }
    

    //let layouts = this.state.layout;

    // layouts.map(l => {
    //   if (l.itemType) {
    //     //l.item = this.comps[l.itemType](filters, l.i);
    //     //var config = this.comps[l.itemType];
    //     //debugger;
    //     var config = l.item;
    //     //if(config.id != item.props.id){
    //      //config.filters = filters;
    //     //}
        
    //     //l.item = this.comps[l.itemType](config);
    //     l.item = config;
    //   }      
    //   return l;
    // });

    this.setState({
      globalFilters: filters//,
//      layout: layouts
    });
  };

  onDrop = (ev) => {
    //debugger;
    var layout = this.state.layout;
    var count = this.state.layout.length;
    let c = ev.dataTransfer.getData("text/plain");

    var xpx = ev.pageX;
    var ypx = ev.pageY;

    var x=0;
    var y =0;
    var h=2;
    var w= 2;


    //containerWidth - margin[0] * (cols - 1) - containerPadding[0] * 2) / cols

    // var box = { i: count.toString(), x: ev.pageX/24, y: ev.pageY/24, w: 4, h: 4, item: {  
    //       filters: this.state.filters,
    //       layoutId: count.toString(),
    //       isFirstTime: true
    //     },itemType:c};
    var box = { i: count.toString(), x: x, y:y, w: w, h: h, item: {  
      //filters: this.state.filters,
      layoutId: count.toString(),
      isFirstTime: true,
      id: 'c' +(Math.ceil(Math.random() * 4) + 1).toString(),
    },itemType:c};
    
    console.log("component dropped: ", c);
    var layout = this.state.layout;
    layout.push(box);
    this.setState({
      ...this.state,
      layout
    });
  }

  // onDrop = (ev, box) => {
    
  //   let c = ev.dataTransfer.getData("text/plain");
  //   console.log("component dropped: ", c);
  //   let layout = this.state.layout.map(l => {
  //     if (l.i == box.i) {       
  //       // l.item = this.comps[c]({filters: this.state.filters,
  //       //                         layoutId: 'comp' + l.i.toString()
  //       //                       });
  //       l.item = {  id: 'c' +(Math.ceil(Math.random() * 4) + 1).toString(),
  //                   filters: this.state.filters,
  //                   layoutId: l.i.toString(),
  //                   isFirstTime: true
  //                 };
  //       l.itemType = c;
  //     }
  //     return l;
  //   });
  //   this.setState({
  //     ...this.state,
  //     layout
  //   });
  // };

  onDragOver = ev => {
    ev.preventDefault();
  };

  onDragStart = (ev, c) => {
    ev.dataTransfer.setData("text/plain", c);
  };

  onSave = (e) => {
    //alert(); 
    console.log("SaveState", this.state);
    var stateData = this.state;
    if(stateData.newLayout){
      stateData.newLayout.map(function(newL,i){
        var item = stateData.layout[i].item;
        var itemType = stateData.layout[i].itemType;
        stateData.layout[i] = newL;
        if(item){          
          stateData.layout[i].item = item;
          stateData.layout[i].itemType = itemType;
        }
      })
    }

    axios
    .post(this.serviceBaseUrl + "data/savePageData", stateData) //this.state
    .then(response => {
      console.log("response", response);
      alert("Page Data Saved Sucessfully !");
    })
    .catch(function(error) {
      console.log("error", error);
    });
  };

  onLayoutChange = (layout, layouts) => {
    //this.props.onLayoutChange(layout, layouts);
    this.setState({     
       newLayout:  layout
    });
  };

  render() {
  if(!this.state){
    return (<h2>Loading ...</h2>);
  }

    // layout is an array of objects, see the demo for more complete usage11
    var layout = this.state.layout;
    var li = this.state.uiComponents.map(c => {
      return (
        <li key={c} draggable onDragStart={e => this.onDragStart(e, c)}>
          {c}
        </li>
      );
    });
    var box = layout.map(l => {
      return (
        <div
          key={l.i}
          onDragOver={e => this.onDragOver(e)}
          onDrop={e => this.onDrop(e, l)}
        >         
          {/* {l.item} */}
          {l.itemType && _.clone(this.comps[l.itemType](l.item))}
        </div>
      );
    });

    return (
      <div>
        <div>
          <ul>{li}</ul>
        </div>
        <input type="button" value="Save" onClick={e=>{this.onSave(e)}} />
          <div  onDragOver={e => this.onDragOver(e)} onDrop={e => this.onDrop(e) } >

            <ReactGridLayout                    
              draggableCancel="input,textarea"
              className="layout"
              layout={layout}
              cols={12}
              rowHeight={100}
              width={1200} 
              onLayoutChange={this.onLayoutChange}
            >
              {box}
            </ReactGridLayout>
        </div>
      </div>
    );
  }
}

export default Page;
