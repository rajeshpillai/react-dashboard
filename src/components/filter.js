import React, { Component } from "react";
import ReactDOM from 'react-dom';
import Toolbox from "./toolbox.js";
import axios from "axios";
import PropertyWindow from "./propertywindow";
import Dimensions from 'react-dimensions';
var _ = require("lodash");

export default class Filter extends Toolbox {
  constructor(props) {
    super(props);
    this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.nextPage = this.nextPage.bind(this);  
    this.previousPage = this.previousPage.bind(this);
    this.getData = this.getData.bind(this);
    this.test = "testData";

    this.id =  this.props.id;
    this.layoutId= this.props.layoutId,
    this.globalFilters = this.props.globalFilters
    this.filters =[];
    this.type="list";
    this.pageSize =25;
    this.totalRecords = 0;
    this.enablePagination=true;
    this.isFirstTime = true;
    this.currentPage = 0;
    this.totalPageCount = 0;
    //this.displayName = "";
   //this.filterChanged = this.props.filterChanged;

    this.state = {
      dimensions: props.dimensions,
      data: [],
      title: props.title,
      dimensionName: "",
      isFormVisible: props.isFormVisible,
      selectedValue: "",
      //filters: [],      
      showSettings: false,
      displayName : ((props.dimensions && props.dimensions.length > 0) ? props.dimensions[0].Name:"")
    };
  }

  serviceBaseUrl = "http://localhost:57387/api/";

 
  componentWillUnmount() {
    console.log("Unmounting Filter....Why ???");
  }


  fetchData() {
    
    //this.filterChanged = this.props.filterChanged;

      var name ="";
      if (this.state.dimensions && this.state.dimensions.length > 0) {
        name = this.state.dimensions[0].Name;        
      }
   

    var widgetModel = {
      Dimension: this.state.dimensions,
      Type: "filter"
    };
    //debugger;
    //Derive filtesr from Global filters.
    var filterList = [];
    if(this.props.globalFilters){
      filterList = _.clone(this.props.globalFilters);
      if (this.state.dimensions && this.state.dimensions.length > 0){ 
        var dimName = this.state.dimensions[0].Name;     
        this.props.globalFilters.map(function(filter,i){
          if(filter.ColName == dimName){
            _.remove(filterList, { 'ColName': dimName });
          }
        })

     }
    }
    //if (this.state.filters) {
      widgetModel.FilterList = filterList;
    //}
    widgetModel.PageSize = this.pageSize;
    widgetModel.EnablePagination = this.enablePagination;
    // if(this.filterChanged){
    //   this.isFirstTime = true;
    // }
    if(this.enablePagination == true && this.isFirstTime){
      //widgetModel.PageSize = this.pageSize;
      widgetModel.IsRecordCountReq = true;
      //Get Total Records count
      axios
      .post(this.serviceBaseUrl + "data/getTotalRecordsCount", widgetModel)
      .then(response => {
        console.log("response", response);
        //debugger;
        if (response && response.data) {
          //console.log("response.data************", JSON.parse(response.data));
          this.totalRecords = parseInt(response.data[0]["totalrowscount"]) ;
          if(this.totalRecords  <= this.pageSize){
            this.enablePagination = false;
          }
          this.currentPage = 1; 
          this.getData(widgetModel);
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
    } else {
      this.getData(widgetModel);
    }

    
  }
  
  getData(widgetModel) {
 //debugger;
    var name ="";
      if (this.state.dimensions && this.state.dimensions.length > 0) {
        name = this.state.dimensions[0].Name;        
      }
      widgetModel.PageSize = this.pageSize;     
      if(this.isFirstTime){
        this.startRowNum = 0;        
      } 
    this.totalPageCount = Math.floor(this.totalRecords/this.pageSize);
   
    //widgetModel.curentPage = this.state.currentPage;

    // if(this.isFirstTime){
    //   this.startRowNum = 0;        
    // } else {
    //   this.startRowNum = parseInt(this.startRowNum) + parseInt(this.pageSize);
    //   if (this.startRowNum < 0) { this.startRowNum = 0; }             
    // }
      widgetModel.IsRecordCountReq = false;
    widgetModel.startRowNum = this.startRowNum;   

    if(this.startRowNum <= this.totalRecords){    
        axios
        .post(this.serviceBaseUrl + "data/getData", widgetModel)
        .then(response => {
          console.log("response", response);
          this.isFirstTime = false;
          //this.filterChanged = false;
          if (response && response.data) {
            //console.log("response.data************", JSON.parse(response.data));
            this.totalRecords = response.data.length;
            this.setState({
              data: response.data,
              //count: response.data.length,
              count: this.totalRecords,
              dimensionName : name
            });
          }
        })
        .catch(function(error) {
          console.log("error", error);
        });
    }
  }


  // componentDidMount() {
  //   console.log("componentDidMount");
  //   this.fetchData();
  // }

  ShowConfigForm = () => {
    let form = (
      <PropertyWindow>
        <div style={this.property_window}>
        <div>
        <label>Dimension: </label> 
          <input
              ref={(inpDim)=>this.inpDim = inpDim}
              type="text"
              placeholder="Enter Dimension"
              defaultValue={this.state.dimensionName}
            />
        </div>
        <div>
        <label>Display Name: </label> 
          <input
              ref={(inpDisplayName)=>this.inpDisplayName = inpDisplayName}
              type="text"
              placeholder="Enter Display Name"
              defaultValue={this.state.displayName}
            />
        </div>
          <button onClick={this.saveForm}>Apply</button>
          &nbsp;&nbsp; <button onClick={(e) => this.toggleConfirmForm(e)}>Cancel</button>
        </div>
      </PropertyWindow>
    );

    // ReactDOM.createPortal(
    //   document.createElement('div'),
    //   document.getElementById('prop-root')
    // );

    //document.getElementById('prop-root').appendChild(form);
    return form;
  };

  // static getDerivedStateFromProps(props, state) {
  //   debugger;
  //   console.log("filter:gds");
  //   var obj={};
  //   var isChanged=false;
  //   if(props.filters != state.filters){
  //     obj.filters = props.filters;
  //     isChanged = true;
  //   }
  //   if(props.layoutId != state.layoutId){
  //     obj.layoutId = props.layoutId;
  //     isChanged = true;
  //   }
  //   if(props.dimensions != state.dimensions){     
  //     obj.dimensions = props.dimensions;
  //     if(!props.dimensions && state.dimensions){
  //       obj.dimensions = state.dimensions;
  //     }
  //     isChanged = true;
  //   }
  //   if(isChanged){
  //     return obj;
  //   }
   
  //   // return {
  //   //   filters: props.filters,
  //   //   layoutId: props.layoutId,
  //   //   dimensions: props.dimensions
  //   //     ? props.dimensions
  //   //     : state.dimensions
  //   //       ? state.dimensions
  //   //       : []
  //   //   //dimensionName: (props.dimensions && props.dimensions.length) > 0? props.dimensions[0].Name : props.dimensionName
  //   // };
    
  //   return null;
   //}

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.globalFilters != this.props.globalFilters) {
  //     this.isFirstTime = true;
  //     this.fetchData();
  //   }
  //   //
  //  // let test = 0;
  //   console.log("componentDidUpdate state", this.state);
  // }

  handleSelectChange = (e,value) => {
    e.stopPropagation();
    var selectedValue =(this.state.selectedValue)?this.state.selectedValue :[];
    if(this.type=="dropdown"){
      selectedValue=[];
    }
    // var isChecked = document.getElementById(e.target.id).checked;
    if(value){  
        var existingValues = selectedValue.filter((f=>{
          return f == value;
        }))
        if(existingValues.length == 0){
          selectedValue.push(value);
        } else {
          selectedValue = selectedValue.filter((f=>{
            return f!= value;
          }))
        }                      
    } else {
      selectedValue.push(e.target.value);
      if(e.target.value == ""){
        selectedValue=[];
      }
    }
    this.setState({
      selectedValue: selectedValue
    });

    var filter = {
      colName: this.state.dimensionName,
      values: selectedValue,
      type: 'filter'//,
      //operationType: 
    };

    this.props.onFilterChange(filter, this);
  };

  nextPage(e){
    e.stopPropagation();
    this.currentPage = this.currentPage +1;
    if(this.currentPage > this.totalPageCount){
      this.curentPage  = this.totalPageCount;
    } else {
      if(this.isFirstTime){
        this.startRowNum = 0;        
      } else {
        this.startRowNum = parseInt(this.startRowNum) + parseInt(this.pageSize);
        if (this.startRowNum > this.totalRecords) { this.startRowNum = this.totalRecords - parseInt(this.pageSize); }      
      }
      this.fetchData();  
    }
     
  };

  previousPage(e){
    e.stopPropagation();
    this.currentPage = this.currentPage -1;
    if(this.currentPage < 1){
      this.curentPage  = 1;
    } else {
      if(this.isFirstTime){
        this.startRowNum = 0;        
      } else {
        this.startRowNum = parseInt(this.startRowNum) - parseInt(this.pageSize);
        if (this.startRowNum < 0) { this.startRowNum = 0; }             
      }
      this.fetchData();  
    }
       
  };

  saveForm = () => {
    this.toggleConfirmForm();

    let dimension = {
      Name: this.inpDim.value // this.state.dimensionName
    };

    this.setState(
      {
        dimensionName: this.inpDim.value,
        dimensions: [dimension],
        displayName: this.inpDisplayName.value
      },
      () => {
        this.props.onConfigurationChange({
          dimensions: [dimension],
          title: this.state.title,
          layoutId: this.layoutId,
          displayName: this.state.displayName,
          //filters: this.state.filters,
          id: this.id
        });
        this.fetchData();
      }
    );
  };

  // toggleConfirmForm = (e) => {
  //   if(e){
  //     e.preventDefault();
  //   }
   
  //   this.setState(prevState => ({
  //     //isFormVisible: !prevState.isFormVisible,
  //     showSettings: !prevState.isFormVisible
  //   }));

  //   this.onSetPropertyForm();
  // };

  // getDataToSave = () => {
  //   return this.state;
  // };

  // onDeleteBox = () => {
  //   this.props.onDeleteBox({
  //     layoutId: this.state.layoutId,
  //     id: this.id
  //   });
  // }

  // onSetPropertyForm  = () => {
  //   let form = (
  //     <div>
  //       <label>Dimension: </label>
  //       <input
  //         ref={(inpDim)=>this.inpDim = inpDim}
  //         type="text"
  //         placeholder="Enter Dimension"
  //         defaultValue={this.state.dimensionName}
  //       />
  //       <br/>
  //       <button onClick={this.saveForm}>Apply</button>
  //       &nbsp;&nbsp; <button onClick={(e) => this.toggleConfirmForm(e)}>Cancel</button>
  //     </div>
  //   );    
  //   this.props.onSetPropertyForm(form);
  //   // var data = {
  //   //   form:form,
  //   //   layoutId: this.layoutId
  //   // }
  //   // this.props.onSetPropertyForm(data);
  // }


  render() {
    console.log("Filter: Render");
    var showSettingLinkUI = (<span><a href="#" onClick={(e) => this.toggleConfirmForm(e)}>Settings</a> <a className="right" href="#" onClick={this.onDeleteBox}>X</a></span>);

    var defaultView = (
      <div>
        <button onClick={(e) => this.toggleConfirmForm(e)}>Add Dimension</button>    
        <a href="#" onClick={this.onDeleteBox}>X</a>             
      </div>
    );

    var options = this.state.data.map((v,i) => {
      //var dimName = //this.state.dimensionName.substring(this.state.dimensionName.indexOf(".")+1);
      return (
        <option
          key={i}
          //value={v["'" + this.state.dimensionName + "'"]}
          value={v[this.state.dimensionName]}
        >
          {v[this.state.dimensionName]}
        </option>
      );
    });

    var lis = this.state.data.map((v,i) => {    
      var isChecked = false;
      if(this.state.selectedValue) {
        var existData = this.state.selectedValue.filter(f=>{
          return f == v[this.state.dimensionName];
        })
        if(existData.length > 0){
          isChecked = true;
        }
      }
      return (
        <li key={i} >               
            <input type="checkbox" checked={isChecked}
                key={i} id={this.state.dimensionName+"_"+i}            
                value={v[this.state.dimensionName]}
                onChange={(e) => {this.handleSelectChange(e,v[this.state.dimensionName])}}
              />
          <label htmlFor={this.state.dimensionName+"_"+i}>{v[this.state.dimensionName]}
         </label>        
        </li>
      );
    });

    var listView =(
      <ul style={{listStyle:"none"}}>
         {lis}
      </ul>      
    ); 

    var dropdownView =(
        <select 
              value={this.state.selectedValue}
              onChange={this.handleSelectChange}
            >
            <option value="">Select</option>
            {options}
        </select>
      ); 

      var paginationButtonView =(
        <div>
          <input type="button" onClick={this.previousPage} value="Previous" />
          <label>Current Page: {this.currentPage}</label>
          <input type="button" onClick={this.nextPage} value="Next" />
        </div>
      );

    var checkboxView = this.state.data.map((v,i) => {
      //var dimName = this.state.dimensionName.substring(this.state.dimensionName.indexOf(".")+1);
      return (
        <div>
          <input type="checkbox"
            key={i} name={this.state.dimensionName} 
            //value={v["'" + this.state.dimensionName + "'"]}           
            value={v[this.state.dimensionName]}
          ></input> {v[this.state.dimensionName]}
         </div>
      );
    });

    var labelView = () =>{
      //alert(this.displayName);
      //debugger;
      var displayName = this.state.displayName? this.state.displayName : this.state.dimensionName;
      return (<label>{displayName} - ({this.state.count})</label>);
    };

    var view = (
      <div>
        {labelView()}
        <div>
          {this.type == 'checkbox' && checkboxView }
          {this.type == 'dropdown' && dropdownView }
          {this.type == 'list' && listView }
        </div>
      </div>
    );

    return (
      <React.Fragment>       
        {(!this.state.dimensions || (this.state.dimensions && this.state.dimensions.length == 0)) && defaultView}
        {this.state.showSettings && showSettingLinkUI }
        {this.state.dimensions && this.state.dimensions.length > 0 && view}
        {this.state.dimensions && this.state.dimensions.length > 0 && this.enablePagination && paginationButtonView}
        {this.state.isFormVisible && this.ShowConfigForm()}
      </React.Fragment>
    );
  }
}
