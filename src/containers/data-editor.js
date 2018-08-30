import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
//import Page from "./page.js";
import { join } from "path";
import './data-editor.css';
import DataModel from "./data-model";
var _ = require("lodash");

export default class DataEditor extends Component {

    constructor(props){
        super(props);       
        this.fetchTables = this.fetchTables.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this)
        this.addTable = this.addTable.bind(this);
        var app = props.data;       
        this.state = {
            app,
            allTables:[]
        }
       
        this.serviceBaseUrl = "http://localhost:57387/api/";
    }

    fetchTables(){
        axios
        .post(this.serviceBaseUrl + "data/getTables")
        .then(response => {
          console.log("response", response);
          //debugger;
          if (response && response.data) {
            console.log("response.data************",response.data);
            //var app = this.state.app;
            //app.tables = response.data;
            var allTables = response.data;
            this.setState({
                allTables
            })
          }
        })
        .catch(function(error) {
          console.log("error", error);
        });
    }

    addTable(table){
        console.log("tabletabletabletable",table);
        //alert(table.name);
        var app = this.state.app;
        var tableExist = _.find(app.tables,{'name':table.name});
        if(!tableExist){
            app.tables.push(table);
        }
       
        this.setState({
            app
        })
    }

    removeTable(table){
        //alert(table.name);
        var app = this.state.app;
        var tableExist = _.filter(app.tables,{'name':table.name});

        app.tables = app.tables.filter((tbl,i)=>{
            return (tbl.name != table.name);
        })
        
        this.setState({
            app
        })
    }



    componentDidMount(){
       this.fetchTables();
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
      
    save(e){
    
        axios
        .post(this.serviceBaseUrl + "data/saveApp",this.state.app)
        .then(response => {
            var app = this.state.app;
            //app.associations = this.associations;
            this.setState({
               app
            })
            console.log("app*******************", app);
        })
        .catch(function(error) {
          console.log("error", error);
        });
    }

    // componentWillReceiveProps(nextProps){
    //     this.setState({ app : nextProps.data })
    // }
    
  
  render() {
    

    var app = this.state.app;
    if(!app){app={tables:[],associations:[]};} 

    var appId = app.id;

    var tableListView = app.tables.map(t=>{
        return (<li key={t.name}>
            {t.name}
            <input type="button" className="btn btn-primary btn-sm" value="-" onClick={()=>this.removeTable(t)} ></input>
        </li>)
    });

    var allTableListView = this.state.allTables.map(t=>{
        return (<li key={t.name}>
                    {t.name}
                    <input type="button" className="btn btn-primary btn-sm" value="+" onClick={()=>this.addTable(t)} ></input>
                </li>)
    });

    var associateTableLinkView =() =>{
        if(app.tables.length > 1){
            return( <div>
                <Link to={`/app/${this.state.app.id}/editor/datamodel`}>
                    <div>Associate Tables</div>         
                </Link>
            </div>)
        }      
    }

    var tablesView = (
        <div className="row">
            <div className="col-sm-4">
                <div>
                    <input type="button" value="Save" onClick={(e)=>this.save(e)} />
                </div>
                <div><strong>{app.title} Table List:</strong></div>
                <div>
                    <ul>
                        {tableListView}
                    </ul>
                </div>
                <div><strong>All Table List:</strong></div>
                <div>
                    <ul>
                        {allTableListView}
                    </ul>
                </div>
            </div>  
            <div className="col-sm-8">
                <form name="frmTableUpload" id="frmTableUpload"  method="post">
                    {/* <input type="text" /> */}
                    <input type="file"  onChange={this.onChangeFile}/> 
                    <input type="button" value="Import" onClick={(e)=>this.importTable(e)} />   
                </form>   
                {associateTableLinkView()}                  
            </div>    
           
               
                 
        </div>
      );

    return (
        <div className="data-editor-container">
            {app.tables && tablesView}     
            <Route
                    path="/app/:id/editor/datamodel"
                    render={({ match }) => {
                    //var app = _.find(this.state.apps, {id: Number(match.params.id)});
                        //console.log("app&&&&&&&&&&&&&&&&",this.state.app);
                        // let app2 = this.state.apps.find((a) => {
                        //   return a.id == match.params.id;
                        // });                                               
                        return (<DataModel  key={appId} data={app} />);
                    }}
                 />         
        </div>       
    );
  }
}

