import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
//import Page from "./page.js";
import './dataEditor.css';

export default class DataEditor extends Component {

    constructor(props){
        super(props);
        this.state = {
            app: {},
            associations:[],
            columns1:[],
            columns2:[]
        }
        console.log('props.data',props.data);
        // state = {
        //     props.app
        // }

        this.association ={};
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data !== state.app) {
            return {
                //app: props.data
                app: {
                    tables:[
                        {name:"employee1", columns:[{name: "ename"},{name: "empid"},{name: "city"},{name: "salary"}]},
                        {name:"skills1", columns:[{name: "empid"},{name: "skill"},{name: "industryid"}]}
                    ]
                }
            }
        }
        return null;
    }

    showColumns1(e){
        //alert(e.target.value);
        var tableName = e.target.value;
        var table = this.state.app.tables.filter(f=>{
            return f.name == tableName;
        });
        this.association.table1 = tableName;

        var columns = table[0].columns;
        this.setState({
            columns1: columns
        })
    }

    showColumns2(e){
        //alert(e.target.value);
        var tableName = e.target.value;
        var table = this.state.app.tables.filter(f=>{
            return f.name == tableName;
        });
        this.association.table2 = tableName;

        var columns = table[0].columns;
        this.setState({
            columns2: columns
        })
    }

    addColumns1(e){
        
    }

  
  render() {
    var appId = this.state.app.id;

    var tableOptionsView =this.state.app.tables.map(t=>{       
            return (<option value={t.name}>{t.name}</option>)
        });
    

    var columns1OptionsView = this.state.columns1.map(c => {
            return (<option value={c.name}>{c.name}</option>)
    });  
    
    var columns2OptionsView = this.state.columns2.map(c => {
        return (<option value={c.name}>{c.name}</option>)
    });  

    var tablesView = (
        <div className="col-sm-12">
            <div className="row col-sm-12">
                <div className="table1 col-sm-6">
                    <label>Table1</label>
                    <select onChange={(e)=>this.showColumns1(e)}>
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
                        <select   onChange={(e)=>this.addColumns1(e)}>
                            <option value="">Select Columns</option>
                            {columns1OptionsView}
                        </select>   
                    </div>  
                    <div  className="table2  col-sm-6">
                        <label>Select Columns</label>
                        <select>
                            <option value="">Select Columns</option>
                            {columns2OptionsView}
                        </select>   
                    </div>  
                </div>
                <div>
                    <input type="button" value="Save" />
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

