import React, { Component } from "react";
import ReactGridLayout from "react-grid-layout";
import Kpi from "./components/kpi";
import Filter from "./components/filter";
import BarChart from './components/barchart';
//import NewBarChart from './components/newbarchart';
import LineChart from './components/linechart';
import DataGrid from './components/datagrid';
import Pivot from './components/pivot';
import axios from 'axios';
var _ = require('lodash');

const save_page_button={
  position: "absolute",
  top: "-2px",
  zIndex: "9999",
  left: "0px"
}

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
    uiComponents: ["KPI", "Filter","BarChart", "LineChart","DataGrid","Pivot"],
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
          filterChanged = {this.state.filterChanged} 
          onConfigurationChange ={c => this.onConfigurationChange(c)}
        />
      );
    },

    // NewBarChart: (config) => {
    //   return (
    //     <NewBarChart layoutId={config.layoutId}
    //       measure = {config.measure}
    //       label="Bar Chart"
    //       globalFilters={this.state.globalFilters}
    //       onFilterChange={(filter,item) => this.onFilterChange(filter,item)}
    //       filterChanged = {this.state.filterChanged} 
    //       onConfigurationChange ={c => this.onConfigurationChange(c)}
    //     />
    //   );
    // },

    LineChart: (config) => {
      return (
        <LineChart layoutId={config.layoutId}
          measure = {config.measure}
          label="Bar Chart"
          filters={config.filters}
          onFilterChange={(filter,item) => this.onFilterChange(filter,item)} 
          filterChanged = {this.state.filterChanged} 
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
          filterChanged = {this.state.filterChanged} 
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
          filterChanged = {this.state.filterChanged} 
          onConfigurationChange ={c => this.onConfigurationChange(c)}
        />      
      );
    },
    DataGrid: (config) => {    
      return (
      <DataGrid layoutId={config.layoutId}
          measure = {config.measure}
          label="Table"
          globalFilters={this.state.globalFilters}
          onFilterChange={(filter,item) => this.onFilterChange(filter,item)} 
          filterChanged = {this.state.filterChanged} 
          onConfigurationChange ={c => this.onConfigurationChange(c)} 
        />
      );
    },
    Pivot: (config) => {
      return (
        <Pivot layoutId={config.layoutId}  id={config.id}
          isFirstTime={config.isFirstTime}
          measure = {config.measure}
          label="KPI Label"
          globalFilters={this.state.globalFilters}
          onFilterChange={(filter,item) => this.onFilterChange(filter,item)} 
          filterChanged = {this.state.filterChanged} 
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
    var filters = this.state.globalFilters ? _.clone(this.state.globalFilters) :[];
    //debugger;
     var existingFilter = _.find(filters,{'ColName':filter.colName});
     if(existingFilter){
      if(filter.type=="filter" && filter.values && filter.values.length == 1 
         && filter.values[0].trim().length == 0){
           //Remove that filter from list
           filters =  _.filter(filters,function(v){
             return v.ColName != filter.colName              
           })
      } else {
        existingFilter.Values = filter.values;
      }
      
     } else {
      filters.push({ ColName: filter.colName, Values: filter.values });
     }

    // if(filter.values && filter.values.length == 1 && filter.values[0].trim().length == 0){
    //   filters =[];
    // } else {
    //   filters =[];
    //   filters.push({ ColName: filter.colName, Values: filter.values });
    // }
    

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

    console.log('globalFilters',filters);

    this.setState({
      globalFilters: filters,
      filterChanged: true
//      layout: layouts
    });
  };

  onDrop = (ev) => {
   
    //debugger;
    var layout = this.state.layout;
    var count = this.state.layout.length;
    let c = ev.dataTransfer.getData("text/plain");
    // console.log("_.find(this.state.uiComponents, c)",_.find(this.state.uiComponents, c));
    // if(_.find(this.state.uiComponents, c).length == 0){
    //   return;
    // }
    var isCompExist = false;
    this.state.uiComponents.forEach(element => {
      if(element == c){
        isCompExist = true;
        return;
      }
    });
    
    if(!isCompExist){
      return;
    }
    var xpx = ev.pageX;
    var ypx = ev.pageY;

    var x=0;
    var y =0;
    var h=4;
    var w=4;


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
        // <li key={c} draggable onDragStart={e => this.onDragStart(e, c)}>
        //   {c}
        // </li>
         <li key={c} draggable onDragStart={e => this.onDragStart(e, c)} className="nav-item">
         <a className="nav-link" href="#">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap ="round" strokeLinejoin="round" className="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
          {c}
         </a>
     </li>    
      );
    });
    var box = layout.map(l => {
      console.log("this.comps",this.comps);
      return (
        <div
          key={l.i}
          onDragOver={e => this.onDragOver(e)}
          onDrop={e => this.onDrop(e, l)}
        >         
       
          {l.itemType && _.clone(this.comps[l.itemType](l.item))}
        </div>
      );
    });

    return (
      <div className='row'>            
               <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                    <div className="sidebar-sticky">
                        <ul className="nav flex-column">
                        {li}
                        {/* <li class="nav-item">
                            <a class="nav-link active" href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            Dashboard <span class="sr-only">(current)</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                            Orders
                            </a>
                        </li>               */}
                        </ul>

                    </div>
                </nav>
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4" style={{"marginTop": "-120px"}}>
                    <div>
                      {/* <div>
                        <ul>{li}</ul>
                      </div> */}
                      <div>
                        <span>{this.props.data.pageName}</span>
                        <input type="button"  value="Save" onClick={e=>{this.onSave(e)}} style={save_page_button} />
                      </div>
                      <div  onDragOver={e => this.onDragOver(e)} onDrop={e => this.onDrop(e) } >

                        <ReactGridLayout                    
                          draggableCancel="input,textarea"
                          className="layout"
                          layout={layout}
                          cols={12}
                          rowHeight={100}
                          width={1200} 
                          onLayoutChange={this.onLayoutChange}>
                          {box}
                        </ReactGridLayout>
                      </div>
                    </div>
                </main>
            </div>



     
    );
  }
}

export default Page;
