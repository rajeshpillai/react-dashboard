import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
//import Page from "./page.js";
import { join } from "path";
import "./data-editor.css";
var config = require('../config');

export default class DataModel extends Component {
  constructor(props) {
    super(props);
    this.fetchColumns = this.fetchColumns.bind(this);
    //this.fetchTables = this.fetchTables.bind(this);
    this.fetchAssociations = this.fetchAssociations.bind(this);
    this.state = {
      app: props.data, //{tables:[],associations:[]},
      columns1: [],
      columns2: []
    };
    console.log("props.data", props.data);
    // state = {
    //     props.app
    // }
    this.keys = [];
    this.associations = [];
    // this.association ={
    //     keys:[]
    // };

    // this.associations=[];

    this.table1 = "";
    this.table2 = "";
    this.serviceBaseUrl = config.serviceBaseUrl;
  }

  // componentWillReceiveProps(nextProps){
  //     this.setState({ app : nextProps.data })
  // }

  // static getDerivedStateFromProps(props, state) {
  //     if (props.data !== state.app) {
  //         return {
  //             //app: props.data
  //             app: {
  //                 tables:[
  //                     {name:"employee1", columns:[{name: "ename"},{name: "empid"},{name: "city"},{name: "salary"}]},
  //                     {name:"skills1", columns:[{name: "empid"},{name: "skill"},{name: "industryid"}]}
  //                 ]
  //             }
  //         }
  //     }
  //     return null;
  // }

  // fetchTables(){
  //     axios
  //     .post(this.serviceBaseUrl + "data/getTables")
  //     .then(response => {
  //       console.log("response", response);
  //       //debugger;
  //       if (response && response.data) {
  //         console.log("response.data************",response.data);
  //         var app = this.state.app;
  //         app.tables = response.data;
  //         this.setState({
  //             app
  //         })
  //       }
  //     })
  //     .catch(function(error) {
  //       console.log("error", error);
  //     });
  // }

  fetchColumns(tableName) {
    axios
      .get(this.serviceBaseUrl + "data/getColumns?tableName=" + tableName)
      .then(response => {
        console.log("response", response);
        //debugger;
        if (response && response.data && response.data.Data) {
          let data = response.data.Data;
          console.log("response.data.Data************", data);
          var app = this.state.app;
          app.tables = this.state.app.tables.map(f => {
            if (f.name == tableName) {
              f.columns = data;
            }
            return f;
          });
          if (tableName == this.table1) {
            this.setState({
              app,
              columns1: data
            });
          } else {
            this.setState({
              app,
              columns2: data
            });
          }
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  fetchAssociations(tableName1, tableName2) {
    //debugger;
    var querystring = "appTitle=" + this.state.app.title;
    if (tableName1) {
      querystring += "&tableName1=" + tableName1;
    }
    if (tableName2) {
      querystring += "&tableName2=" + tableName2;
    }
    axios
      .get(
        this.serviceBaseUrl + "data/getExistingTableAssociation?" + querystring
      )
      .then(response => {
        console.log("response", response);
        //debugger;
        if (response && response.data && response.data.Data) {
          let data = response.data.Data;
          console.log("response.data************", response.data);
          this.setState({
            associations: [data]
          });
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }
  // componentDidMount(){
  //    this.fetchTables();
  // }

  showColumns1(e) {
    //alert(e.target.value);
    var tableName = e.target.value;
    var table = this.state.app.tables.filter(f => {
      return f.name == tableName;
    });
    this.table1 = tableName;
    //debugger;
    var columns = table[0].columns;
    if (!columns) {
      columns = this.fetchColumns(tableName);
      //table[0].columns = columns;
    } else {
      this.setState({
        columns1: columns
      });
    }

    this.fetchAssociations(this.table1, this.table2);

    // this.setState({
    //     columns1: columns
    // })
  }

  showColumns2(e) {
    //alert(e.target.value);
    var tableName = e.target.value;
    var table = this.state.app.tables.filter(f => {
      return f.name == tableName;
    });
    this.table2 = tableName;

    var columns = table[0].columns;
    if (!columns) {
      columns = this.fetchColumns(tableName);
      //table[0].columns = columns;
    } else {
      this.setState({
        columns2: columns
      });
    }
    // var columns = table[0].columns;
    // this.setState({
    //     columns2: columns
    // })
  }

  addColumns(e, tableType) {
    if (e.target.value) {
      var tableName = tableType == "table1" ? this.table2 : this.table1;
      this.keys = this.keys.filter(k => {
        //return k.indexOf(tableName) == -1;
        return k.indexOf(tableName) >= 0;
      });

      tableName = tableType == "table1" ? this.table1 : this.table2;
      this.keys.push(tableName + "." + e.target.value);
    }
  }

  save(e) {
    var association = {
      TableName: this.table1,
      Relations: [
        {
          TableName2: this.table2,
          Keys: [this.keys],
          Cardinality: this.cardinality
        }
      ]
    };

    //this.associations = associations;
    this.associations.push(association);

    // this.association.table1 = this.table1;
    // this.association.table2 = this.table2;
    console.log("association", association);
    axios
      .post(this.serviceBaseUrl + "data/saveTableAssociation", {
        Association: association,
        AppId: this.state.app.id,
        AppTitle: this.state.app.title
      })
      .then(response => {
        //if(response.data.Status.toLowerCase() == "success"){
        var app = this.state.app;
        app.associations = this.associations;
        this.setState({
          app
        });
        console.log("app*******************", app);
      // } else {
      //   alert(response.data.Error);
      // }

        //console.log("response", response);
        //debugger;
        //   if (response && response.data) {
        //     console.log("response.data************",response.data);
        //      var app = this.state.app;
        //      app.associations = association;
        //      this.setState({
        //         app
        //      })
        //   }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  SetCardinality(e) {
    this.cardinality = e.target.value;
  }

  render() {
    ///var appId = (this.state.app)?this.state.app.id:"";
    var associations = this.state.app.associations
      ? this.state.app.associations
      : [];

    var tableOptionsView = this.state.app.tables.map(t => {
      return (
        <option key={t.name} value={t.name}>
          {t.name}
        </option>
      );
    });

    var columns1OptionsView = this.state.columns1.map(c => {
      return (
        <option key={c.name} value={c.name}>
          {c.name}
        </option>
      );
    });

    var columns2OptionsView = this.state.columns2.map(c => {
      return (
        <option key={c.name} value={c.name}>
          {c.name}
        </option>
      );
    });

    var associationsView = associations.map(a => {
      return (
        <tr key={a.TableName}>
          <td>{a.TableName}</td>
          <td>{a.Relations[0].TableName2}</td>
          <td>{a.Relations[0].Keys.join(",")}</td>
          <td>{a.Relations[0].Cardinality}</td>
        </tr>
      );
    });

    var tablesView = (
      <div>
        <div className="card mt-2">
          <div className="card-body">
            <div className="col-sm-12">
            <h4>Create Table Associations</h4>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group row">
                    <label
                      htmlFor="colFormLabelSm"
                      className="col-sm-4 col-form-label col-form-label-sm"
                    >
                      Table 1
                    </label>
                    <div className="col-sm-7">
                      <select
                        className="form-control"
                        onChange={e => this.showColumns1(e)}
                      >
                        <option value="">Select Table1</option>
                        {tableOptionsView}
                      </select>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="colFormLabel"
                      className="col-sm-4 col-form-label"
                    >
                      Column
                    </label>
                    <div className="col-sm-7">
                      <select
                        className="form-control"
                        onChange={e => this.addColumns(e, "table1")}
                      >
                        <option value="">Select Column</option>
                        {columns1OptionsView}
                      </select>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="colFormLabel"
                      className="col-sm-4 col-form-label"
                    >
                      Cardinality
                    </label>
                    <div className="col-sm-7">
                      <select
                        className="form-control"
                        onChange={e => this.SetCardinality(e)}
                      >
                        <option value="">Select Cardinality</option>
                        <option value="0">One to many (1:*)</option>
                        <option value="1">One to one (1:1)</option>
                        <option value="2">Many to one (*:1) </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group row">
                    <label
                      htmlFor="colFormLabelSm"
                      className="col-sm-4 col-form-label col-form-label-sm"
                    >
                      Table 2
                    </label>
                    <div className="col-sm-8">
                      <select
                        className="form-control"
                        onChange={e => this.showColumns2(e)}
                      >
                        <option value="">Select Table2</option>
                        {tableOptionsView}
                      </select>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="colFormLabel"
                      className="col-sm-4 col-form-label"
                    >
                      Column
                    </label>
                    <div className="col-sm-8">
                      <select
                        className="form-control"
                        onChange={e => this.addColumns(e, "table2")}
                      >
                        <option value="">Select Column</option>
                        {columns2OptionsView}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <a
                  href="#"
                  className="btn btn-primary btn-md float-right"
                  onClick={e => this.save(e)}
                >
                  Save Association
                </a>
              </div>
            </div>
          </div>
        </div>
        <table className="table   table-sm table-bordered">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Table 1</th>
              <th scope="col">Table 2</th>
              <th scope="col">Keys</th>
              <th scope="col">Cardinality</th>
            </tr>
          </thead>
          <tbody>{this.state.app.associations && associationsView}</tbody>
        </table>
      </div>
    );

    return <div>{tablesView}</div>;
  }
}
