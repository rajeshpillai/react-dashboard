import React, { Component } from "react";
import axios from "axios";
import "./odbc.css";
var config = require("../config");

export default class OledbConn extends Component {
  constructor(props) {
    super(props);
    this.onConnectGetTables = this.onConnectGetTables.bind(this);
    this.onTableClick = this.onTableClick.bind(this);
    this.onChangeCol = this.onChangeCol.bind(this);
    this.onTableNameChange = this.onTableNameChange.bind(this);
    this.onImport = this.onImport.bind(this);
    this.createOledbConnection = this.createOledbConnection.bind(this);
    this.loadTablesOnChangeDb = this.loadTablesOnChangeDb.bind(this);
    this.getVizDBTypeByDsn = this.getVizDBTypeByDsn.bind(this);
    this.setSelectedProvider = this.setSelectedProvider.bind(this);

    this.serviceBaseUrl = config.serviceBaseUrl;

    this.state = {
      allDbs: [],
      allTables: [],
      columns: [],
      newTableName: "",
      allOledbProviders: [],
      isProvidersLoaded: false
    };
    this.selectedTableName = "";
    this.connectionString = "";

    // this.defaultConnString = "";
    // switch (props.type) {
    //   case "mysql":
    //     this.defaultConnString =
    //       "DSN=vizmysql;Database=classicmodels;Uid=root;Pwd=root123;";
    //     break;
    //   case "postgres":
    //     this.defaultConnString =
    //       "DSN=vizpostgres32;Database=dvdrental;Uid=postgres;Pwd=root123;";
    //     break;
    // }

    // DSN=vizpostgres32;Database=dvdrental;Uid=postgres;Pwd=root123;

    //"Provider=MariaDB Provider;Data Source=localhost,3306; Initial Catalog=classicmodels;User ID=root; Password=root123;Activation=SJNF-W6LE-W22Z-DRPV"
  }

  componentDidMount() {
    axios
      .get(this.serviceBaseUrl + "data/listAllOldbProviders")
      .then(response => {
        console.log("response", response);
        //debugger;
        if (response && response.data) {
          //if(response.data.Status.toLowerCase() == "success"){
          let allOledbProviders = response.data;
          console.log("response.data************", allOledbProviders);

          this.setState({
            allOledbProviders,
            columns: [],
            allTables: [],
            isProvidersLoaded: true
          });
          // } else {
          //   alert(response.data.Error);
          // }
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  setSelectedProvider(e) {
    //alert(e.target.value);
    let providerName = e.target.value;
    this.connectionName.value = providerName;
    this.provider = providerName;
  }

  getVizDBTypeByDsn(providerName) {
    var provider = this.state.allOledbProviders.filter(pvd => {
      return pvd.Name == providerName;
    });

    return provider && provider.length > 0 ? provider[0].VizDBType : null;
  }

  createOledbConnection() {
    // var dsn = this.state.allOledbProviders.filter(dsn => {
    //   return dsn.Name == this.dsnName;
    // });

    let inputData = {
      Provider: this.provider,
      UserName: this.userName.value,
      Password: this.passowrd.value,
      Datasource: this.datasource.value,
      ConnectionName: this.connectionName.value,
      VizDBType: this.getVizDBTypeByDsn(this.provider),
      AdditionalProperties: this.additionalProperties.value
    };

    axios
      .post(this.serviceBaseUrl + "data/createOLEDBConnection", inputData)
      .then(response => {
        console.log("response", response);
        //debugger;
        if (response && response.data) {
          if (response.data.Status.toLowerCase() == "success") {
            let data = response.data.Data;
            console.log("response.data.Data************", data);
            // var allTables = data.map(table => {
            //   if (table == this.selectedTableName) {
            //     table.isImported = false;
            //   }
            //   return table;
            // });

            this.setState({
              allDbs: data,
              allTables: [],
              columns: []
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

  loadTablesOnChangeDb() {
    //alert(this.database.value);
    this.onConnectGetTables();
  }

  onConnectGetTables() {
    // let dsn = this.state.allOledbProviders.filter(dsn => {
    //   return dsn.Name == this.dsnName;
    // });

    this.connectionString =
      "Provider=" +
      this.provider +
      ";Data Source=" +
      this.datasource.value +
      ";Initial Catalog=" +
      this.database.value +
      ";User ID=" +
      this.userName.value +
      ";Password=" +
      this.passowrd.value +
      ";" +
      this.additionalProperties.value;
    ////"Provider=MariaDB Provider;Data Source=localhost,3306; Initial Catalog=classicmodels;User ID=root; Password=root123;Activation=SJNF-W6LE-W22Z-DRPV";

    let inputData = {
      VizDBProviderType: "oledb",
      VizDBType: this.getVizDBTypeByDsn(this.provider),
      DatabaseName: this.database.value,
      ConnectionString: this.connectionString
    };

    axios
      .post(this.serviceBaseUrl + "data/onConnectGetTables", inputData)
      .then(response => {
        console.log("response", response);
        //debugger;
        if (response && response.data) {
          if (response.data.Status.toLowerCase() == "success") {
            let data = response.data.Data;
            console.log("response.data.Data************", data);
            var allTables = data.map(table => {
              if (table == this.selectedTableName) {
                table.isImported = false;
              }
              return table;
            });

            this.setState({
              allTables,
              columns: []
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

  onTableClick(tableName) {
    this.selectedTableName = tableName;

    var inputData = {
      ConnectionString: this.connectionString,
      VizDBType: this.getVizDBTypeByDsn(this.provider),
      DatabaseName: this.database.value,
      VizDBProviderType: "oledb",
      TableName: tableName
    };
    axios
      .post(this.serviceBaseUrl + "data/getColumnsForTable", inputData)
      .then(response => {
        console.log("response", response);
        //debugger;
        if (response && response.data) {
          if (response.data.Status.toLowerCase() == "success") {
            let data = response.data.Data;
            console.log("response.data.Data************", data);
            var columns = data;
            columns = columns.map(col => {
              col.isSelected = true;
              return col;
            });
            this.setState({
              columns,
              newTableName: tableName
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

  onChangeCol(e) {
    let columns = this.state.columns.map(item => {
      if (item.column_name == e.target.value) {
        item.isSelected = !item.isSelected;
      }
      return item;
    });

    this.setState({
      columns
    });
  }

  onTableNameChange(e) {
    //alert(e.target.value);
    this.setState({
      newTableName: e.target.value
    });
    // this.newTableName =e.target.value;
  }

  onImport() {
    let cols = [];
    // this.state.columns.map(item=>{
    //    if(item.isSelected == true){
    //     cols.push(item.column_name);
    //    }
    // })

    let inputData = {
      ConnectionString: this.connectionString,
      VizDBType: this.getVizDBTypeByDsn(this.provider),
      DatabaseName: this.database.value,
      VizDBProviderType: "oledb",
      NewTableName: this.state.newTableName,
      TableName: this.selectedTableName,
      ColumnNames: this.state.columns
    };

    axios
      .post(this.serviceBaseUrl + "data/importData", inputData)
      .then(response => {
        console.log("response", response);
        //debugger;
        if (response && response.data) {
          if (response.data.Status.toLowerCase() == "success") {
            //this.props.onCloseModal();
            //Refresh the table list
            this.props.fetchTables();
            let data = response.data.Data;
            console.log("response.data.Data************", data);
            alert("Table imported successfully !");
          } else {
            alert(response.data.Error);
          }
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  render() {
    var allTableListView = this.state.allTables.map(t => {
      return (
        <a
          key={t.table_name}
          className="list-group-item list-group-item-action"
          //  id="list-table-list"
          data-toggle="list"
          //  href="#list-table"
          role="tables"
          //  aria-controls="table"
          onClick={() => this.onTableClick(t.table_name)}
        >
          {t.table_name}{" "}
          {/* {t.isImported && <i className="fa fa-check" /> } */}
        </a>
      );
    });

    var allColumnListView = this.state.columns.map(c => {
      //c.isSelected = false;
      return (
        <span
          key={c.column_name}
          className="list-group-item list-group-item-action"
          //  data-toggle="list"
          //  role="columns"
        >
          <input
            type="checkbox"
            name="col"
            checked={c.isSelected}
            onChange={this.onChangeCol}
            value={c.column_name}
          />{" "}
          {c.column_name}{" "}
        </span>
      );
    });

    let databaseOptionView = this.state.allDbs.map(db => {
      return (
        <option key={db.dbname} value={db.dbname}>
          {db.dbname}
        </option>
      );
    });

    let providerOptionView = this.state.allOledbProviders.map(pvd => {
      return (
        <option key={pvd.Name} value={pvd.Name}>
          {pvd.Description}
        </option>
      );
    });

    return (
      <React.Fragment>
        <div style={{ width: "600px" }}>
          <div className="form-row">
            <h3>Create new connection (OLEDB)</h3>
          </div>
          <div className="form-row">
            <div className="form-group col-md-12">
              <label>Provider</label>
              {!this.state.isProvidersLoaded && (
                <span class="pl-3">
                  <i class="fa fa-spinner" aria-hidden="true" />
                </span>
              )}
              <select
                className="form-control"
                onChange={this.setSelectedProvider}
              >
                <option>Select Provider</option>
                {providerOptionView}
              </select>
            </div>
          </div>
          <div className="form-group col-sm-12">
            <label>Data source (file path or server name)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              ref={datasource => (this.datasource = datasource)}
            />
          </div>
          <div className="form-row col-sm-12 pt-3">
            <div className="form-group col-md-6">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                ref={userName => (this.userName = userName)}
              />
            </div>
            <div className="form-group col-md-6">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                ref={passowrd => (this.passowrd = passowrd)}
              />
            </div>
          </div>
          <div className="form-group col-sm-12">
            <label>Additional connection properties</label>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              ref={additionalProperties =>
                (this.additionalProperties = additionalProperties)
              }
            />
          </div>
          <div className="form-group col-sm-12">
            <label>Connection Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              ref={connectionName => (this.connectionName = connectionName)}
            />
          </div>
          <div className="form-row col-sm-12">
            <div className="form-group col-md-2">
              <input
                type="button"
                className="btn btn-primary"
                value="Create"
                onClick={this.createOledbConnection}
              />
            </div>
            <div className="form-group col-md-2">
              <input
                type="button"
                className="btn btn-danger"
                value="Cancel"
                onClick={() => this.props.onCloseModal()}
              />
            </div>
          </div>
          {this.state.allDbs.length > 0 && (
            <div className="row">
              <div className="col-sm-12">
                <label>Select Database</label>
                <select
                  className="form-control"
                  ref={database => (this.database = database)}
                  onChange={this.loadTablesOnChangeDb}
                >
                  <option value="">Select Database</option>
                  {databaseOptionView}
                </select>
              </div>
            </div>
          )}

          <div className="row pt-3">
            <div className="col-sm-3">
              <div className="list-group" id="list-table" role="tablelist">
                {this.state.allTables.length > 0 && (
                  <h4 className="list-group-item list-group-item-action bg-primary">
                    All table list
                  </h4>
                )}
                <div className="all-table-column-wrapper">
                  <div className="list-group" id="list-tables" role="tablist">
                    {allTableListView}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-5">
              {this.state.columns.length > 0 && (
                <h4 className="list-group-item list-group-item-action bg-primary">
                  Columns of Table - <b>{this.state.newTableName}</b>
                </h4>
              )}
              <div className="all-table-column-wrapper">
                <div className="list-group" id="list-columns" role="tablist">
                  {allColumnListView}
                </div>
              </div>

              {this.state.columns.length > 0 && (
                <div className="row pt-4">
                  <div className="row input-group ml-3">
                    <span>Import Table As</span>
                  </div>
                  <div className="col-sm-12 card pt-3">
                    <div className="input-group mb-3">
                      <input
                        //ref={inpTableName => (this.inpTableName = inpTableName)}
                        type="text"
                        placeholder="Enter Table Name"
                        className="form-control"
                        value={this.state.newTableName}
                        onChange={this.onTableNameChange}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-primary"
                          type="button"
                          onClick={this.onImport}
                        >
                          Import
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* <h2>Enter Connection String</h2>
                    <div><input type="text" ref={inpConnectionString => (this.inpConnectionString = inpConnectionString)} value="DSN=vizmysql;Database=classicmodels;Uid=root;Pwd=root123;" /></div>
                    <div><input className="btn btn-primary" type="button" value="Connect" onClick={this.onConnect} /></div>
                    <div> */}
        </div>
      </React.Fragment>
    );
  }
}
