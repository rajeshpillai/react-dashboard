import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
//import Page from "./page.js";
import { join } from "path";
import './dataEditor.css';
import DataModel from "./dataModel";
var _ = require("lodash");

export default class DataEditor extends Component {

    constructor(props){
        super(props);       
        this.fetchTables = this.fetchTables.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this)
        var app = props.data;
        app.tables=[];
        
        this.state = {
            app
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
  
  render() {
    var appId = this.state.app.id;

    var tableListView = this.state.app.tables.map(t=>{
        return (<li key={t.name}>{t.name}</li>)
    });

    var tablesView = (
        <div className="row">
            <div className="col-sm-4">
                <ul>
                    {tableListView}
                </ul>
            </div>  
            <div className="col-sm-8">
                <form name="frmTableUpload" id="frmTableUpload"  method="post">
                    {/* <input type="text" /> */}
                    <input type="file"  onChange={this.onChangeFile}/> 
                    <input type="button" value="Import" onClick={(e)=>this.importTable(e)} />   
                </form>   
                <div>
                    <Link to={`/app/${this.state.app.id}/editor/datamodel`}>
                        <div>Associate Tables</div>         
                    </Link>
                </div>                  
            </div>    
           
               
                 
        </div>
      );

    return (
        <div className="data-editor-container">
            {this.state.app.tables && tablesView}     
            <Route
                    path="/app/:id/editor/datamodel"
                    render={({ match }) => {
                    var app = _.find(this.state.apps, {id: Number(match.params.id)});
                        
                        // let app2 = this.state.apps.find((a) => {
                        //   return a.id == match.params.id;
                        // });
                        return (<DataModel data={app} />);
                    }}
                 />         
        </div>       
    );
  }
}

