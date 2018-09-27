import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
var config = require('../config');

export default class CsvDs extends Component {
    constructor(props){
        super(props);  
        this.onChangeFile = this.onChangeFile.bind(this);        
        this.handleChange = this.handleChange.bind(this);
        
        this.dataTypes = [
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
          this.serviceBaseUrl = config.serviceBaseUrl;

          this.state = {          
            importedColumns: []           
          };
      
    }

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
                this.props.fetchTables();
                this.props.onCloseModal();
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
  
    render() {
        var columnDataTypeListView = this.dataTypes.map(d => {
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
                </div>
              </div>      
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
        return(
            <div>
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
        )
      
    }
}
