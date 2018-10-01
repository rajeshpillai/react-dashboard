import React, { Component } from "react";
import ReactDOM from "react-dom";
import OdbcConn from "./odbc-conn";
import OledbConn from "./oledb-conn";
import CsvDs from "./csv-ds";

export default class DataSources extends Component {
  constructor(props) {
    super(props);
  }

  fetchTables() {
    this.props.fetchTables();
  }

  onCloseModal() {
    this.props.onCloseModal();
  }

  render() {
    return (
      <div>
        {this.props.type == "csv" && (
          <div>
            <CsvDs {...this.props} />
          </div>
        )}
        {this.props.type == "odbc" && (
          <div>
            <OdbcConn {...this.props} />
          </div>
        )}
        {this.props.type == "oledb" && (
          <div>
            <OledbConn {...this.props} />
          </div>
        )}
        {/* {(this.props.type == "mysql" || this.props.type == "postgres") && <div><OdbcConn {...this.props} /></div>} */}
      </div>
    );
  }
}
