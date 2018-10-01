import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
//import Page from "./page.js";
import { join } from "path";
import "./data-editor.css";
import DataModel from "./data-model";
import Modal from 'react-responsive-modal';
// import OdbcConn from './odbc-conn';
import DataSources from './data-sources';
var _ = require("lodash");
var config = require('../config');

export default class DataEditor extends Component {
  constructor(props) {
    super(props);
    this.fetchTables = this.fetchTables.bind(this);    
    this.addTable = this.addTable.bind(this);   
    var app = props.data;
    this.state = {
      app,
      allTables: [],     
      open: false,
      dataSourceType: null
    };

    this.serviceBaseUrl = config.serviceBaseUrl;
  }

  fetchTables() {
    axios
      .post(this.serviceBaseUrl + "data/getTables")
      .then(response => {
        console.log("response", response);
        //debugger;
        if (response && response.data) {
          if(response.data.Status.toLowerCase() == "success"){
            let data = response.data.Data;
            console.log("response.data.Data************", data);
            //var app = this.state.app;
            //app.tables = response.data;
            var allTables = data;
            this.setState({
              allTables
            });
          } else {
            alert(response.data.Error);
          }
      }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  addTable(table) {
    console.log("tabletabletabletable", table);
    //alert(table.name);
    var app = this.state.app;
    var tableExist = _.find(app.tables, { name: table.name });
    if (!tableExist) {
      app.tables.push(table);
    }

    this.setState({
      app
    });
  }

  removeTable(table) {
    //alert(table.name);
    var app = this.state.app;
    var tableExist = _.filter(app.tables, { name: table.name });

    app.tables = app.tables.filter((tbl, i) => {
      return tbl.name != table.name;
    });

    this.setState({
      app
    });
  }

  componentDidMount() {
    this.fetchTables();
  }

  save(e) {
    axios
      .post(this.serviceBaseUrl + "data/saveApp", this.state.app)
      .then(response => {
        var app = this.state.app;
        //app.associations = this.associations;
        this.setState({
          app
        });
        console.log("app*******************", app);
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  onOpenModal = (type) => {
    this.setState({ 
      open: true,
      dataSourceType: type 
    });
  };
 
  onCloseModal = () => {
    this.setState({ 
      open: false, 
      dataSourceType:null 
    });
  };

  render() {
   
    var app = this.state.app;
    if (!app) {
      app = { tables: [], associations: [] };
    }

    var appId = app.id;

    var tableListView = app.tables.map(t => {
      return (
        <a
          key={t.name}
          className="list-group-item list-group-item-action"
          id="list-home-list"
          data-toggle="list"
          href="#list-home"
          role="tab"
          aria-controls="home"
        >
          {t.name}{" "}
          <i
            className="fa fa-minus-circle float-right"
            onClick={() => this.removeTable(t)}
          />
        </a>
      );
    });

    var allTableListView = this.state.allTables.map(t => {
      return (
        <a
          key={t.name}
          className="list-group-item list-group-item-action"
          id="list-home-list"
          data-toggle="list"
          href="#list-home"
          role="tab"
          aria-controls="home"
        >
          {t.name}{" "}
          <i
            className="fa fa-plus-circle float-right"
            onClick={() => this.addTable(t)}
          />
        </a>        
      );
    });

    var associateTableLinkView = () => {
      if (app.tables.length > 1) {
        return (
          <div>
            <Link to={`/app/${this.state.app.id}/editor/datamodel`}>
              <div>Associate Tables</div>
            </Link>
          </div>
        );
      }
    };

    // var associationsView = associations.map(a => {
    //   return (
    //     <tr key={a.TableName}>
    //       <td>{a.TableName}</td>
    //       <td>{a.Relations[0].TableName2}</td>
    //       <td>{a.Relations[0].Keys.join(",")}</td>
    //     </tr>
    //   );
    // });

    var tablesView = (
      <section className="content mt-3">
        <div className="row">
          <div className="col-sm-3">
            <div className="list-group" id="list-tab" role="tablist">
              <h4 className="list-group-item list-group-item-action bg-primary">
                {app.title} table list
              </h4>
              {tableListView}

              <h4 className="list-group-item list-group-item-action bg-primary">
                All table list
              </h4>
              <div className="all-table-wrapper">{allTableListView}</div>
            </div>
            <div>
              <input type="button" className="btn btn-primary" value="Save" onClick={e => this.save(e)} />
            </div>           
          </div>
          <div className="col-sm-9">
            <div className="card mb-1">
              <div className="card-body">
              <div className="row">
              <div className="col-4">
                <div className="list-group" >
                <h4 className="list-group-item list-group-item-action bg-primary">Data Sources</h4>
                  <a className="list-group-item list-group-item-action" href="#"  onClick={()=>this.onOpenModal("csv")}>CSV</a>
                  <a className="list-group-item list-group-item-action" href="#"   onClick={()=>this.onOpenModal("odbc")}>ODBC</a>                  
                  <a className="list-group-item list-group-item-action" href="#"   onClick={()=>this.onOpenModal("oledb")}>OLEDB</a>                  
                </div>
              </div>
              </div>
              <Modal open={this.state.open} onClose={this.onCloseModal} center>
                <DataSources type={this.state.dataSourceType} fetchTables={this.fetchTables} onCloseModal={this.onCloseModal} />
               {/* <OdbcConn type="mysql" /> */}
              </Modal>
              </div>
            </div>
            <DataModel key={appId} data={app} />
            {/* <Route
              path="/app/:id/editor/datamodel"
              render={({ match }) => {
                //var app = _.find(this.state.apps, {id: Number(match.params.id)});
                //console.log("app&&&&&&&&&&&&&&&&",this.state.app);
                // let app2 = this.state.apps.find((a) => {
                //   return a.id == match.params.id;
                // });
                return <DataModel key={appId} data={app} />;
              }} />*/}
          </div>
        </div>
      </section>
    );

    return <div>{app.tables && tablesView}</div>;
  }
}
