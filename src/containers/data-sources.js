import React, { Component } from "react";
import ReactDOM from "react-dom";
import OdbcConn from './odbc-conn';
import CsvDs from './csv-ds';

export default class DataSources extends Component {
    constructor(props){
        super(props);        
    }
  
    fetchTables(){
        this.props.fetchTables();
    }

    onCloseModal(){
        this.props.onCloseModal();
    }

    render() {
        return(
            <div>
                {this.props.type == "csv" && <div><CsvDs {...this.props} /></div>}
                {this.props.type == "mysql" && <div><OdbcConn {...this.props} /></div>}
            </div>
        )
      
    }
}
