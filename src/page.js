import React, { Component } from "react";
import ReactGridLayout from "react-grid-layout";
import Kpi from "./components/kpi";
import Filter from "./components/filter";
import BarChart from './components/barchart';
import axios from 'axios';

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
  //       filters:  response.data.filters
  //     });
  //     //alert("Page Data Saved Sucessfully !");
  //   })
  //   .catch(function(error) {
  //     console.log("error", error);
  //   });
  // }

  state = {   
    uiComponents: ["KPI", "Filter","BarChart"],
    layout: [
      { i: "a", x: 0, y: 0, w: 2, h: 2, item: "" },
      { i: "b", x: 2, y: 0, w: 2, h: 2, item: "" }, //minW: 2, maxW: 4, 
      { i: "c", x: 4, y: 0, w: 2, h: 2, item: "" },
      { i: "d", x: 6, y: 0, w: 2, h: 2, item: "" },
      { i: "e", x: 8, y: 0, w: 2, h: 2, item: "" },
      { i: "f", x: 0, y: 2, w: 2, h: 2, item: "" },
      { i: "g", x: 2, y: 2, w: 2, h: 2, item: "" },
      { i: "h", x: 4, y: 2, w: 2, h: 2, item: "" },
      { i: "i", x: 6, y: 2, w: 2, h: 2, item: "" },
      { i: "k", x: 8, y: 2, w: 2, h: 2, item: "" }
    ],
    filters: []
  };

  comps = {
    // KPI: (filters,id) => {
    //   return (
    //     <Kpi ref={(id)=>this.id = id} 
    //       label="KPI Label"
    //       filters={filters}
    //       onFilterChange={filter => this.onFilterChange(filter)} 
    //     />
    //   );
    // },
    // Filter: (filters,id) => {
    //   return (
    //     <Filter layoutId={id} 
    //       title="Filter"
    //       filters={filters}
    //       onFilterChange={filter => this.onFilterChange(filter)} 
    //       onConfigurationChange ={config => this.onConfigurationChange(config)}
    //     />      
    //   );
    // }
    KPI: (config) => {
      return (
        <Kpi layoutId={config.layoutId}
          measure = {config.measure}
          label="KPI Label"
          filters={config.filters}
          onFilterChange={(filter,item) => this.onFilterChange(filter,item)} 
          onConfigurationChange ={c => this.onConfigurationChange(c)}
        />
      );
    },

    BarChart: (config) => {
      return (
        <BarChart layoutId={config.layoutId}
          measure = {config.measure}
          label="Bar Chart"
          filters={config.filters}
          onFilterChange={(filter,item) => this.onFilterChange(filter,item)} 
          onConfigurationChange ={c => this.onConfigurationChange(c)}
        />
      );
    },
    Filter: (config) => {
      return (
        <Filter layoutId={config.layoutId}
          dimensions = {config.dimensions} 
          title="Filter"
          filters={config.filters}
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
    var filters = [];
    filters.push({ ColName: filter.colName, Values: filter.values });

    let layouts = this.state.layout;

    layouts.map(l => {
      if (l.itemType) {
        //l.item = this.comps[l.itemType](filters, l.i);
        //var config = this.comps[l.itemType];
        var config = l.item;
        config.filters = filters;
        //l.item = this.comps[l.itemType](config);
        l.item = config;
      }      
      return l;
    });

    this.setState({
      filters: filters,
      layout: layouts
    });
  };

  onDrop = (ev, box) => {
    let c = ev.dataTransfer.getData("text/plain");
    console.log("component dropped: ", c);
    let layout = this.state.layout.map(l => {
      if (l.i == box.i) {       
        // l.item = this.comps[c]({filters: this.state.filters,
        //                         layoutId: 'comp' + l.i.toString()
        //                       });
        l.item = {  
                    filters: this.state.filters,
                    layoutId: l.i.toString()
                  };
        l.itemType = c;
      }
      return l;
    });
    this.setState({
      ...this.state,
      layout
    });
  };

  onDragOver = ev => {
    ev.preventDefault();
  };

  onDragStart = (ev, c) => {
    ev.dataTransfer.setData("text/plain", c);
  };

  onSave = (e) => {
    //alert(); 
    console.log("SaveState", this.state);

    axios
    .post(this.serviceBaseUrl + "data/savePageData", this.state)
    .then(response => {
      console.log("response", response);
      alert("Page Data Saved Sucessfully !");
    })
    .catch(function(error) {
      console.log("error", error);
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
          {l.itemType && this.comps[l.itemType](l.item)}
        </div>
      );
    });

    return (
      <div>
        <div>
          <ul>{li}</ul>
        </div>
        <input type="button" value="Save" onClick={e=>{this.onSave(e)}} />
        <ReactGridLayout
          draggableCancel="input,textarea"
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1200}
        >
          {box}
        </ReactGridLayout>
      </div>
    );
  }
}

export default Page;
