import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
//import Page from "./page.js";
import { join } from "path";
import './dataEditor.css';
var serialize = require('form-serialize');

export default class DataEditor extends Component {

    constructor(props){
        super(props);
        this.fetchColumns = this.fetchColumns.bind(this);
        this.fetchTables = this.fetchTables.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this)
        this.state = {
            app: {tables:[],associations:[]},           
            columns1:[],
            columns2:[]
        }
        console.log('props.data',props.data);
        // state = {
        //     props.app
        // }
        this.keys = [];
        this.associations =[];
        // this.association ={
        //     keys:[]
        // };

        // this.associations=[];

        this.table1="";
        this.table2="";
        this.serviceBaseUrl = "http://localhost:57387/api/";
    }

    

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

    fetchTables(){
        axios
        .post(this.serviceBaseUrl + "data/getTables")
        .then(response => {
          console.log("response", response);
          //debugger;
          if (response && response.data) {
            console.log("response.data************",response.data);
            var app = this.state.app;
            app.tables = response.data;
            this.setState({
                app
            })
          }
        })
        .catch(function(error) {
          console.log("error", error);
        });
    }

    fetchColumns(tableName){
        axios
        .get(this.serviceBaseUrl + "data/getColumns?tableName=" + tableName)
        .then(response => {
          console.log("response", response);
          //debugger;
          if (response && response.data) {
            console.log("response.data************",response.data);
             var app = this.state.app;
             app.tables = this.state.app.tables.map(f=>{
                if(f.name == tableName){
                    f.columns = response.data;
                }
                return f;
            });    
            if(tableName == this.table1)        {
                this.setState({
                    app,
                    columns1: response.data
                })
            } else {
                this.setState({
                    app,
                    columns2: response.data
                })
            }
        
          }
        })
        .catch(function(error) {
          console.log("error", error);
        });
    }

    componentDidMount(){
       this.fetchTables();
    }

    showColumns1(e){
        //alert(e.target.value);
        var tableName = e.target.value;
        var table = this.state.app.tables.filter(f=>{
            return f.name == tableName;
        });
        this.table1 = tableName;
//debugger;
        var columns = table[0].columns;
        if(!columns){
            columns =  this.fetchColumns(tableName);
            //table[0].columns = columns;
        } else {
            this.setState({                   
                columns1: columns
            })
        }

        // this.setState({
        //     columns1: columns
        // })
    }

    showColumns2(e){
        //alert(e.target.value);
        var tableName = e.target.value;
        var table = this.state.app.tables.filter(f=>{
            return f.name == tableName;
        });
        this.table2 = tableName;

        var columns = table[0].columns;
        if(!columns){
            columns =  this.fetchColumns(tableName);
            //table[0].columns = columns;
        } else {
            this.setState({
                columns2: columns
            })
        }
        // var columns = table[0].columns;
        // this.setState({
        //     columns2: columns
        // })
    }

    addColumns(e, tableType){
        if(e.target.value){
            var tableName = (tableType == "table1")? this.table2: this.table1;
            this.keys = this.keys.filter((k)=>{
                //return k.indexOf(tableName) == -1;
                return k.indexOf(tableName) >= 0;
            })

            tableName = (tableType == "table1")? this.table1: this.table2;
             this.keys.push(tableName + "." + e.target.value);
        }      
    }

    save(e){
        var association = {
            TableName : this.table1,
            Relations :[
                {
                    TableName2: this.table2,
                    Keys:[this.keys]
                }
            ]            
        }

        //this.associations = associations;
        this.associations.push(association);

        // this.association.table1 = this.table1;
        // this.association.table2 = this.table2;
        console.log("association",association);
        axios
        .post(this.serviceBaseUrl + "data/saveTableAssociation",association)
        .then(response => {
            var app = this.state.app;
            app.associations = this.associations;
            this.setState({
               app
            })
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

    importTable(e){
        const formData = new FormData();
        formData.append('file',this.state.file);

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        axios
        .post(this.serviceBaseUrl + "data/importTable",formData,config)
        .then(response => {
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
        this.setState({file:e.target.files[0]})
      }
  
  render() {
    var appId = this.state.app.id;

    var tableOptionsView =this.state.app.tables.map(t=>{       
            return (<option key={t.name} value={t.name}>{t.name}</option>)
        });
    

    var columns1OptionsView = this.state.columns1.map(c => {
            return (<option key={c.name}  value={c.name}>{c.name}</option>)
    });  
    
    var columns2OptionsView = this.state.columns2.map(c => {
        return (<option key={c.name}  value={c.name}>{c.name}</option>)
    });  

    var associationsView =this.state.app.associations.map(a=>{
        return (
            <tr>
                <td>{a.TableName}</td>
                <td>{a.Relations[0].TableName2}</td>
                <td>{a.Relations[0].Keys.join(','   )}</td>
            </tr>
        )
    });

    var tablesView = (
        <div className="col-sm-12">
            <div className="row col-sm-12">
                <form name="frmTableUpload" id="frmTableUpload"  method="post">
                    <input type="file"  onChange={this.onChangeFile}/> 
                    <input type="button" value="Import" onClick={(e)=>this.importTable(e)} />   
                </form>          
            </div>
            <div className="row col-sm-12">
                <div className="table1 col-sm-6">
                    <label>Table1</label>
                    <select  onChange={(e)=>this.showColumns1(e)}>
                        <option value="">Select Table1</option>
                        {tableOptionsView}
                    </select>   
                </div>  
                <div  className="table2  col-sm-6">
                    <label>Table2</label>
                    <select  onChange={(e)=>this.showColumns2(e)}>
                        <option value="">Select Table2</option>
                        {tableOptionsView}
                    </select>   
                </div>  
            </div>   
            <div className="row  col-sm-12"> 
                <div className="table1  col-sm-6">
                        <label>Select Columns</label>
                        <select  onChange={(e)=>this.addColumns(e, 'table1')}>
                            <option value="">Select Columns</option>
                            {columns1OptionsView}
                        </select>   
                    </div>  
                    <div  className="table2  col-sm-6">
                        <label>Select Columns</label>
                        <select onChange={(e)=>this.addColumns(e, 'table2')}>
                            <option value="">Select Columns</option>
                            {columns2OptionsView}
                        </select>   
                    </div>  
                </div>
                <div>
                    <input type="button" value="Save" onClick={(e)=>this.save(e)} />
                </div>
           
            <div className="row  col-sm-12">
               <table>
                   <thead>
                        <tr>
                            <th>Table 1</th>
                            <th>Table 2</th>
                            <th>Keys</th>
                        </tr>
                   </thead>
                   <tbody>
                       {this.state.app.associations && associationsView}
                   </tbody>
              </table>
            </div>
        </div>
      );

    return (
        <div className="data-editor-container">
            {tablesView}           
        </div>       
    );
  }
}

