import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
//import Page from "./page.js";
import { join } from "path";
import "./data-editor.css";
import DataModel from "./data-model";
var _ = require("lodash");

export default class DataEditor extends Component {
  constructor(props) {
    super(props);
    this.fetchTables = this.fetchTables.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.addTable = this.addTable.bind(this);
    this.handleChange = this.handleChange.bind(this);
    var app = props.data;
    this.state = {
      app,
      allTables: [],
      importedColumns: []
    };

    this.serviceBaseUrl = "http://localhost:57387/api/";
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

        // if (response && response.data) {
        //   console.log("response.data************", response.data);
        //   //var app = this.state.app;
        //   //app.tables = response.data;
        //   var allTables = response.data;
        //   this.setState({
        //     allTables
        //   });
        // }
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

  getColumnsDatatype(e) {
    const formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("delimiter", this.inpDelimiter.value);
    formData.append("tablename", this.inpTableName.value);

    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };

    axios
      .post(this.serviceBaseUrl + "data/getColumnsDatatype", formData, config)
      .then(response => {

        // if(response){
        //   if(response.Status.toLowerCase() == "success"){
        //     let data = response.data.Data;
        //     this.setState({
        //       importedColumns: data
        //     });            
        //   } else {
        //     alert(response.Error);
        //   }
        // }

        if (response && response.data) {
          this.setState({
            importedColumns: response.data
          });
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  importTable(e) {
    const formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("delimiter", this.inpDelimiter.value);
    formData.append("tablename", this.inpTableName.value);

    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };

    axios
      .post(this.serviceBaseUrl + "data/importTable", formData, config)
      .then(response => {
        if(response && response.data){
          if(response.data.Status.toLowerCase() == "success"){
            
          } else {

          }
        }
        
        // var app = this.state.app;
        // app.associations = this.associations;
        // this.setState({
        //    app
        // })
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  onChangeFile(e) {
    this.setState({ file: e.target.files[0] });
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

  // componentWillReceiveProps(nextProps){
  //     this.setState({ app : nextProps.data })
  // }

  handleChange(e, colName) {
    //alert(e.target.value);
    //alert(colName);
    var importedColumns = this.state.importedColumns;
    importedColumns = importedColumns.map(f => {
      if (f.Name == colName) {
        f.CType = e.target.value;
      }
      return f;
    });

    this.setState({
      importedColumns
    });
  }

  addData(e) {
    var data = {
      Columns: this.state.importedColumns,
      FileName: this.state.file.name,
      Delemiter: this.inpDelimiter.value,
      TableName: this.inpTableName.value
    };

    console.log("ImportedFileModel", data);

    axios
      .post(this.serviceBaseUrl + "data/addData", data)
      .then(response => {
        if(response && response.data){
          if(response.data.Status.toLowerCase() == "success"){
            //Refresh the table list
            this.fetchTables();
            alert("Data Imported successfully !!");
          } else {
            alert(response.data.Error);
          }
        }
        // var app = this.state.app;
        // app.associations = this.associations;
        // this.setState({
        //    app
        // })
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  render() {
    let dataTypes = [
      "BOOLEAN",
      "TINYINT",
      "INT",
      "SMALLINT",
      "BIGINT",
      "STRING",
      "DOUBLE",
      "FLOAT",
      "DATE",
      "TIME",
      "TIMESTAMP"
    ];

    var app = this.state.app;
    if (!app) {
      app = { tables: [], associations: [] };
    }

    var appId = app.id;

    // var columnDataTypeListView = (value) =>{
    //     dataTypes.map(d=>{
    //         return (<option value={d} >{d}</option>)
    //         })
    // }

    var columnDataTypeListView = dataTypes.map(d => {
      return (
        <option key={d} value={d}>
          {d}
        </option>
      );
    });

    var importedColumnsView = this.state.importedColumns.map(col => {
      return (
        <div className="form-group row" key={col.Name}>
          <label className="col-sm-4 col-form-label">{col.Name}</label>
          <div className="col-sm-8">
            <select
              defaultValue={col.CType}
              className="form-control"
              onChange={e => this.handleChange(e, col.Name)}
            >
              {columnDataTypeListView}
            </select>
            {/* <input type="password" className="form-control" id="inputPassword" placeholder="Password"> */}
          </div>
        </div>

        // <div key={col.Name}>
        //   <span>{col.Name}</span>
        //   <select
        //     defaultValue={col.CType}
        //     onChange={e => this.handleChange(e, col.Name)}
        //   >
        //     {columnDataTypeListView}
        //   </select>
        // </div>
      );
    });

    var addDataButtonView = () => {
      if (this.state.importedColumns.length > 0) {
        return (
          <input
            type="button"
            value="Add Data"
            className="btn btn-primary"
            onClick={e => this.addData(e)}
          />
        );
      }
    };

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
        // <li key={t.name}>
        //   {t.name}
        //   <input
        //     type="button"
        //     className="btn btn-primary btn-sm"
        //     value="+"
        //     onClick={() => this.addTable(t)}
        //   />
        // </li>
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
            {/* <div>
            <strong>{app.title} Table List:</strong>
          </div>
          <div>
            <ul>{tableListView}</ul>
          </div>
          <div>
            <strong>All Table List:</strong>
          </div>
          <div>
            <ul>{allTableListView}</ul>
          </div> */}
          </div>
          <div className="col-sm-9">
            <div className="card mb-1">
              <div className="card-body">
                <form
                  className="form-group"
                  name="frmTableUpload"
                  id="frmTableUpload"
                  method="post"
                >
                  {/* <input type="text" /> */}
                  <div className="row form-group">
                    <div className="col-sm-12">
                      <input
                        className="form-control"
                        type="file"
                        onChange={this.onChangeFile}
                      />{" "}
                    </div>
                  </div>
                  <div className="row form-group">
                    <div className="col-sm-6">
                      <label>Delimiter: </label>
                      <input
                        className="form-control"
                        type="text"
                        ref={inpDelimiter => (this.inpDelimiter = inpDelimiter)}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label>Table Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        ref={inpTableName => (this.inpTableName = inpTableName)}
                      />
                    </div>
                  </div>
                  {/* <div><input type="button" value="Import" onClick={(e)=>this.importTable(e)} />  </div>                     */}
                  <div>
                    <input
                      type="button"
                      className="btn btn-primary col-sm-2 offset-sm-10"
                      value="Import"
                      onClick={e => this.getColumnsDatatype(e)}
                    />{" "}
                  </div>
                </form>

                {importedColumnsView}
                {addDataButtonView()}
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
