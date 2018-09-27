import React, { Component } from "react";
import axios from "axios";
import "./odbc.css";
var config = require('../config');

export default class OdbcConn extends Component {

    constructor(props){
        super(props); 
        this.onConnect = this.onConnect.bind(this);
        this.onTableClick = this.onTableClick.bind(this);
        this.onChangeCol = this.onChangeCol.bind(this);
        this.onTableNameChange = this.onTableNameChange.bind(this);
        this.onImport = this.onImport.bind(this);
                
        this.serviceBaseUrl = config.serviceBaseUrl;

        this.state={
            allTables:[],
            columns:[],
            newTableName:""
        }
        this.selectedTableName ="";
    }

    onConnect(){
        var inputData={
            ConnectionString: this.inpConnectionString.value
        }
        axios
        .post(this.serviceBaseUrl + "data/connectOdbc",inputData)
        .then(response => {
          console.log("response", response);
          //debugger;
          if (response && response.data) {
           if(response.data.Status.toLowerCase() == "success"){
              let data = response.data.Data;              
              console.log("response.data.Data************", data);             
              var allTables =  data.map((table)=>{
                if(table == this.selectedTableName){
                    table.isImported = false;
                }
                return table;
            });
             
              this.setState({
                allTables,
                columns:[]
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

    onTableClick(tableName){
        this.selectedTableName = tableName;
        var inputData={
            ConnectionString: this.inpConnectionString.value,
            TableName: tableName
        }
        axios
        .post(this.serviceBaseUrl + "data/getColumnsForTableOdbc",inputData)
        .then(response => {
          console.log("response", response);
          //debugger;
          if (response && response.data) {
           if(response.data.Status.toLowerCase() == "success"){
              let data = response.data.Data;              
              console.log("response.data.Data************", data);             
              var columns = data;
              columns = columns.map((col)=>{
                  col.isSelected = true;
                  return col;
              })
              this.setState({
                columns,
                newTableName:tableName
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

    onChangeCol(e){        
        let columns = this.state.columns.map((item)=>{
            if(item.column_name == e.target.value){
                item.isSelected = !item.isSelected;
            }
            return item;
        })

        this.setState({
            columns
        })
    }

    onTableNameChange(e){
        //alert(e.target.value);
        this.setState({
            newTableName:e.target.value
        })
       // this.newTableName =e.target.value;
    }

    onImport(){
        let cols =[];
        // this.state.columns.map(item=>{
        //    if(item.isSelected == true){
        //     cols.push(item.column_name);
        //    }
        // })

        let inputData={
            ConnectionString: this.inpConnectionString.value,
            NewTableName: this.state.newTableName,
            TableName: this.selectedTableName,
            ColumnNames: this.state.columns
        }

        axios
        .post(this.serviceBaseUrl + "data/importDataFromMySql",inputData)
        .then(response => {
          console.log("response", response);
          //debugger;
          if (response && response.data) {
           if(response.data.Status.toLowerCase() == "success"){
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

    render(){

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
                onClick={()=>this.onTableClick(t.table_name)}
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
                 data-toggle="list"                
                 role="columns"                
              >
               <input type="checkbox" name="col" checked={c.isSelected} onChange={this.onChangeCol} value={c.column_name} />{" "}
                  {c.column_name}{" "}                
              </span>             
            );
          });
       
        return(
            <React.Fragment>
                <div style={{width: "1000px", height: "550px"}}>                    
                    <div className="row">
                        <div className="col-sm-6 card pt-3">
                            <div className="input-group mb-3">
                                <input
                                    ref={inpConnectionString => (this.inpConnectionString = inpConnectionString)}
                                    type="text"
                                    placeholder="Enter ConnectionString"
                                    className="form-control"
                                    defaultValue="DSN=vizmysql;Database=classicmodels;Uid=root;Pwd=root123;"
                                />
                                <div className="input-group-append">
                                    <button
                                    className="btn btn-outline-primary"
                                    type="button"
                                    onClick={this.onConnect}
                                    >
                                    Connect
                                    </button>            
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="list-group" id="list-table" role="tablelist">
                                {this.state.allTables.length > 0 && 
                                    <h4 className="list-group-item list-group-item-action bg-primary">
                                        All table list
                                    </h4>
                                }
                                <div className="all-table-column-wrapper">
                                    <div className="list-group" id="list-tables" role="tablist">
                                        {allTableListView}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            {this.state.columns.length > 0 && 
                                <h4 className="list-group-item list-group-item-action bg-primary">
                                    Columns of Table - <b>{this.state.newTableName}</b>
                                </h4>
                            }
                            <div className="all-table-column-wrapper">
                                <div className="list-group" id="list-columns" role="tablist">
                                    {allColumnListView}
                                </div>
                            </div>

                            {this.state.columns.length > 0 && 
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
                                }
                        
                            


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