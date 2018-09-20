import React, { Component } from "react";
import ReactGridLayout from "react-grid-layout";
import Kpi from "../components/kpi";
import Filter from "../components/filter";
import BarChart from "../components/bar-chart";
//import NewBarChart from './components/newbarchart';
import LineChart from "../components/line-chart";
import PieChart from "../components/pie-chart";
import DataGrid from "../components/datagrid";
import Pivot from "../components/pivot";
import axios from "axios";
//import PageControList from "./page-control-list";
import PortalCommon from "./portal-common.js";
var _ = require("lodash");
var config = require('../config');

const save_page_button = {
  // position: "fixed",
  // top: "9px",
  // zIndex: "9999"
  // // left: "250px"
  /* margin: 5px; */
  position: "absolute",
  top: "-43px",
  /* right: -653px; */

  right: "-300%"
};

const property_window = {
  position: "fixed",
  right: "0",
  zIndex: "9999",
  background: "cyan",
  height: "100vh",
  top: "50px",
  minWidth: "250px"
};

class Page extends Component {
  serviceBaseUrl = config.serviceBaseUrl;

  componentDidMount() {
    //if(!this.props.app){
    

    axios
      .post(this.serviceBaseUrl + "data/getPageData", {
        appTitle: "",
        appId: this.props.match.params.appid,
        pageId: this.props.match.params.pageid
      })
      .then(response => {
        console.log("response-getPageData", response);
        if (response) {
          this.setState({
            uiComponents: response.data.uiComponents,
            layout: response.data.layout ? response.data.layout : [],
            globalFilters: response.data.filters
          });
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });

      let pageName= this.props.data ? this.props.data.pageName : "";
      if(!pageName){
        axios
        .post(this.serviceBaseUrl + "data/getPageMetaData", {
          appTitle: "",
          appId: this.props.match.params.appid,
          pageId: this.props.match.params.pageid
        })
        .then(response => {
          console.log("response-getPageMetaData", response);
          if (response && response.data) {         
            if(response.data){
              this.props.setPageName(response.data.Title);
            }          
          }
        })
        .catch(function(error) {
          console.log("error", error);
        });
      }
      
    //}
  }

  state = {
    uiComponents: [
      { type: "Filter", displayName: "Filter" },
      { type: "KPI", displayName: "KPI" },
      { type: "DataGrid", displayName: "DataGrid" },
      { type: "BarChart", displayName: "BarChart" },
      { type: "LineChart", displayName: "LineChart" },
      { type: "PieChart", displayName: "PieChart" }
      // {type:"Pivot", displayName:"Pivot"}
    ],
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
    filters: [],
    isPropertyWindowVisible: false,
    appId: this.props.data ? this.props.data.appId : null,
    pageId: this.props.data ? this.props.data.pageId : null,
    appTitle: this.props.app ? this.props.app.title : null,
    pageName: this.props.data ? this.props.data.pageName : ""
  };

  comps = {
    BarChart: config => {
      return (
        <BarChart
          layoutId={config.layoutId}
          id={config.id}
          dimensions={config.dimensions}
          measure={config.measure}
          label="Bar Chart"
          globalFilters={this.state.globalFilters}
          onFilterChange={(filter, item) => this.onFilterChange(filter, item)}
          filterChanged={this.state.filterChanged}
          onConfigurationChange={c => this.onConfigurationChange(c)}
          onDeleteBox={d => this.onDeleteBox(d)}
          onSetPropertyWindowActive={d => this.onSetPropertyWindowActive(d)}
          isFormVisible={config.isFormVisible}
          appId={this.props.match.params.appid}
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
    //     onDeleteBox = {d=> this.onDeleteBox(d)}
    //     />
    //   );
    // },

    LineChart: config => {
      return (
        <LineChart
          layoutId={config.layoutId}
          id={config.id}
          dimensions={config.dimensions}
          measure={config.measure}
          label="Line Chart"
          globalFilters={this.state.globalFilters}
          onFilterChange={(filter, item) => this.onFilterChange(filter, item)}
          filterChanged={this.state.filterChanged}
          onConfigurationChange={c => this.onConfigurationChange(c)}
          onDeleteBox={d => this.onDeleteBox(d)}
          onSetPropertyWindowActive={d => this.onSetPropertyWindowActive(d)}
          isFormVisible={config.isFormVisible}
          appId={this.props.match.params.appid}
        />
      );
    },

    PieChart: config => {
      return (
        <PieChart
          layoutId={config.layoutId}
          id={config.id}
          dimensions={config.dimensions}
          measure={config.measure}
          label="Line Chart"
          globalFilters={this.state.globalFilters}
          onFilterChange={(filter, item) => this.onFilterChange(filter, item)}
          filterChanged={this.state.filterChanged}
          onConfigurationChange={c => this.onConfigurationChange(c)}
          onDeleteBox={d => this.onDeleteBox(d)}
          onSetPropertyWindowActive={d => this.onSetPropertyWindowActive(d)}
          isFormVisible={config.isFormVisible}
          appId={this.props.match.params.appid}
        />
      );
    },

    KPI: config => {
      return (
        <Kpi
          layoutId={config.layoutId}
          id={config.id}
          isFirstTime={config.isFirstTime}
          measure={config.measure}
          label="KPI Label"
          globalFilters={this.state.globalFilters}
          onFilterChange={(filter, item) => this.onFilterChange(filter, item)}
          filterChanged={this.state.filterChanged}
          onConfigurationChange={c => this.onConfigurationChange(c)}
          onDeleteBox={d => this.onDeleteBox(d)}
          onSetPropertyWindowActive={d => this.onSetPropertyWindowActive(d)}
          isFormVisible={config.isFormVisible}
          appId={this.props.match.params.appid}
        />
      );
    },
    Filter: config => {
      return (
        <Filter
          layoutId={config.layoutId}
          id={config.id}
          dimensions={config.dimensions}
          title="Filter"
          globalFilters={this.state.globalFilters}
          onFilterChange={(filter, item) => this.onFilterChange(filter, item)}
          filterChanged={this.state.filterChanged}
          onConfigurationChange={c => this.onConfigurationChange(c)}
          onDeleteBox={d => this.onDeleteBox(d)}
          onSetPropertyWindowActive={d => this.onSetPropertyWindowActive(d)}
          isFormVisible={config.isFormVisible}
          appId={this.props.match.params.appid}
        />
      );
    },
    DataGrid: config => {
      return (
        <DataGrid
          layoutId={config.layoutId}
          id={config.id}
          dimensions={config.dimensions}
          measure={config.measure}
          cols={config.cols}
          label="Table"
          globalFilters={this.state.globalFilters}
          onFilterChange={(filter, item) => this.onFilterChange(filter, item)}
          filterChanged={this.state.filterChanged}
          onConfigurationChange={c => this.onConfigurationChange(c)}
          onDeleteBox={d => this.onDeleteBox(d)}
          onSetPropertyWindowActive={d => this.onSetPropertyWindowActive(d)}
          isFormVisible={config.isFormVisible}
          appId={this.props.match.params.appid}
        />
      );
    },
    Pivot: config => {
      return (
        <Pivot
          layoutId={config.layoutId}
          id={config.id}
          isFirstTime={config.isFirstTime}
          measure={config.measure}
          label="KPI Label"
          globalFilters={this.state.globalFilters}
          onFilterChange={(filter, item) => this.onFilterChange(filter, item)}
          filterChanged={this.state.filterChanged}
          onConfigurationChange={c => this.onConfigurationChange(c)}
          onDeleteBox={d => this.onDeleteBox(d)}
          appId={this.props.match.params.appid}
        />
      );
    }
  };

  onDeleteBox = config => {
    console.log("onDeleteBox config", config);
    var layout = this.state.layout.filter(l => {
      return l.i != config.layoutId;
    });
    this.setState({
      layout
    });
  };

  onConfigurationChange = config => {
    console.log("onConfigurationChange config", config);
    var layout = this.state.layout.map(l => {
      if (l.i == config.layoutId) {
        //l.item = this.comps[l.itemType](config);
        l.item = config;
      }
      return l;
    });

    this.setState({
      layout
    });
  };

  onFilterChange = (filter, item) => {
    console.log("filter1111", filter);
    var filters = this.state.globalFilters
      ? _.clone(this.state.globalFilters)
      : [];
    //debugger;
    var existingFilter = _.find(filters, { ColName: filter.colName });
    if (existingFilter) {
      if (
        filter.type == "filter" &&
        filter.values &&
        filter.values.length == 0
      ) {
        //Remove that filter from list
        filters = _.filter(filters, function(v) {
          return v.ColName != filter.colName;
        });
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

    console.log("globalFilters", filters);

    this.setState({
      globalFilters: filters,
      filterChanged: true
      //      layout: layouts
    });
  };

  onDrop = ev => {
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
      if (element.type == c) {
        isCompExist = true;
        return;
      }
    });

    if (!isCompExist) {
      return;
    }
    var xpx = ev.pageX;
    var ypx = ev.pageY;

    var x = 0;
    var y = Infinity;
    var h = 100;
    var w = 4;

    // if(this.state.layout && this.state.layout.length /2 == 0){
    //   x=2;
    //   y =0;
    //   h=2;
    //   w=2;
    // }

    //containerWidth - margin[0] * (cols - 1) - containerPadding[0] * 2) / cols

    // var box = { i: count.toString(), x: ev.pageX/24, y: ev.pageY/24, w: 4, h: 4, item: {
    //       filters: this.state.filters,
    //       layoutId: count.toString(),
    //       isFirstTime: true
    //     },itemType:c};
    var box = {
      i: count.toString(),
      x: x,
      y: y,
      w: w,
      h: h,
      item: {
        //filters: this.state.filters,
        layoutId: count.toString(),
        isFirstTime: true,
        id: "c" + (Math.ceil(Math.random() * 4) + 1).toString(),
        isFormVisible: false
      },
      itemType: c
    };

    console.log("component dropped: ", c);
    var layout = this.state.layout;
    layout.push(box);
    this.setState({
      ...this.state,
      layout
    });
  };

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

  onSave = e => {
    //alert();
    console.log("SaveState", this.state);
    var stateData = this.state;
    if (stateData.newLayout) {
      stateData.newLayout.map(function(newL, i) {
        var item = stateData.layout[i].item;        
        var itemType = stateData.layout[i].itemType;
        stateData.layout[i] = newL;
        if (item) {
          item.isFormVisible = false;
          stateData.layout[i].item = item;
          stateData.layout[i].itemType = itemType;
        }
      });
    }

    delete stateData.newLayout;

    var pageLayout = {
      Layout: stateData,
      AppId: this.props.match.params.appid,
      AppTitle: "",
      pageId: this.props.match.params.pageid
    };
    //var pageLayout={"Layout" :{}, "AppId":this.props.match.params.appid,"AppTitle":this.props.app.title};

    axios
      .post(this.serviceBaseUrl + "data/savePageData", pageLayout) //this.state
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
      newLayout: layout
    });
  };

  onSetPropertyWindowActive = layoutId => {
    var layout = this.state.layout.map(l => {
      if (l.item.layoutId == layoutId) {
        l.item.isFormVisible = true;
      } else {
        l.item.isFormVisible = false;
      }
      return l;
    });
    this.setState({
      layout,
      newLayout:layout
    });
  };

  // onSetPropertyForm =(data) =>{
  // //   this.setState({
  // //     propForm:  form
  // //  });

  // var form = null;

  //  var layout = this.state.layout.map(l=>{
  //    if(l.item.layoutId == data.layoutId){
  //      if(data.form){
  //       l.item.propForm = data.form;
  //      }
  //       form = l.item.propForm;
  //    }
  //    return l;
  //  })

  //   this.setState(prevState => ({
  //     isPropertyWindowVisible: true,
  //     layout,
  //     propForm:  form
  //   }));
  // }

  // togglePropertyWindow = (e) => {
  //   if(e){
  //     e.preventDefault();
  //   }

  //   this.setState(prevState => ({
  //     isPropertyWindowVisible: !prevState.isPropertyWindowVisible
  //   }));
  // };

  onResizeStop = (ev, a, c, d, e, f, ref6, height, width) => {
    //debugger;
    //  console.log("onresize",ev);
    //  console.log("size",size);
    //  console.log("onresize",ev);
    //  console.log("node size height",height);
    //  console.log("node size width",width);
  };

  render() {
    var getComponentIcon = function(type) {
      switch (type.toLowerCase()) {
        case "kpi":
          return <i className="fa fa-file-text" />;
        case "barchart":
          return <i className="fa fa-bar-chart" />;
        case "linechart":
          return <i className="fa fa-line-chart" />;
        case "piechart":
          return <i className="fa fa-pie-chart" />;
        case "filter":
          return <i className="fa fa-filter" />;
        case "datagrid":
          return <i className="fa fa-table" />;
        default:
          return <i className="fa fa-home" />;
      }
    };

    var propWindowView = (
      <div style={property_window}>{this.state.propForm}</div>
    );

    if (!this.state) {
      return <h2>Loading ...</h2>;
    }

    // layout is an array of objects, see the demo for more complete usage11
    var layout = this.state.layout;
    var li = this.state.uiComponents.map(c => {
      return (
        // <li key={c} draggable onDragStart={e => this.onDragStart(e, c)}>
        //   {c}
        // </li>
        <li
          key={c.type}
          draggable
          onDragStart={e => this.onDragStart(e, c.type)}
          className="nav-item"
        >
          <a className="nav-link" href="#">
            {getComponentIcon(c.type)}
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-file"
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg> */}
            {c.displayName}
          </a>
        </li>
      );
    });

    var box = layout.map(l => {
      console.log("this.comps", this.comps);
      var clss = l.itemType == "DataGrid" ? "gridOverFlow" : "";
      return (
        <div
          key={l.item.layoutId}
          onDragOver={e => this.onDragOver(e)}
          onDrop={e => this.onDrop(e, l)}
          className={clss}
        >
          {l.itemType && _.clone(this.comps[l.itemType](l.item))}
        </div>
      );
    });

    return (
      <div className="row">
        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
          <div className="sidebar-sticky">
            <ul className="nav flex-column">
              {/* <PageControList>{li}</PageControList> */}
              <PortalCommon target="pageControls" type="id">
                {li}
              </PortalCommon>
              <input
                type="button"
                value="Save Page"
                onClick={e => {
                  this.onSave(e);
                }}
                className="btn btn-primary"
                style={save_page_button}
              />
            </ul>
          </div>
        </nav>
        <main role="main" className="col-md-12 col-lg-12 px-2">
          <div>
            {/* <PortalCommon target="currentPage" type="id" emptyTheTargetFirst={true}>{this.props.data ? this.props.data.pageName : ""}</PortalCommon> */}
            {/* <div>
                        <ul>{li}</ul>
                      </div> */}
            {/* <div> */}
            {/* <span>{this.props.data.pageName}</span> */}
            {/* <input
                type="button"
                value="Save"
                onClick={e => {
                  this.onSave(e);
                }}
                style={save_page_button}
              /> */}
            {/* </div> */}
            <div
              onDragOver={e => this.onDragOver(e)}
              onDrop={e => this.onDrop(e)}
            >
              <ReactGridLayout
                draggableCancel="input,textarea"
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={100}
                //cols={24}
                //rowHeight={1}
                width={1200}
                onLayoutChange={this.onLayoutChange}
                onResizeStop={this.onResizeStop}
              >
                {box}
              </ReactGridLayout>
            </div>
          </div>
        </main>
        {/* <div id="prop-root" /> */}
      </div>
    );
  }
}

export default Page;
