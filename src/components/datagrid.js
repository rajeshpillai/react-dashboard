import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from "axios";
import PropertyWindow from "./propertywindow";
import Toolbox from "./toolbox.js"
var _ = require("lodash");

const table_Scroll={
  width: "500px",
  height: "400px",
  overflow: "scroll"
}

export default class DataGrid extends Toolbox {
  constructor(props) {
      //debugger;
    super(props);
    this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.nextPage = this.nextPage.bind(this);  
    this.previousPage = this.previousPage.bind(this);
    this.getData = this.getData.bind(this);
    //this.globalFilters = this.props.globalFilters
    //this.filterChanged = this.props.filterChanged;
    this.filters =[];

    // var dim = {Name:'ProductInventory.Shelf'};
    // //var dim = {Name:'Product.Name'};
    // var dim1 = {Name:'ProductVendor.VendorId'};
    // //var dim2 = {Name:'PurchaseOrderHeader.ShipMethodId'};

    // var measure = {Expression:'sum(ProductInventory.Quantity)'};
    // var measure2 = {Expression:'count(PurchaseOrderDetail.PurchaseOrderId)'};

    // var dim = {Name:'skills.skill'};
    // //var dim = {Name:'Product.Name'};
    // var dim1 = {Name:'employee.city'};
    // //var dim2 = {Name:'PurchaseOrderHeader.ShipMethodId'};

    // var measure = {Expression:'sum(employee.salary)'};
    // var measure2 = {Expression:'count(employee.ename)'};

    var dim = {Name:'employee1.ename'};
    //var dim = {Name:'Product.Name'};
    var dim1 = {Name:'skills1.skill'};
    //var dim2 = {Name:'PurchaseOrderHeader.ShipMethodId'};

    var measure = {Expression:'sum(employee1.salary)'};
    //var measure2 = {Expression:'count(employee.ename)'};

    var cols =[];
    cols.push(dim.Name);
    cols.push(dim1.Name);
    //cols.push(dim2.Name);
    cols.push(measure.Expression);
    //cols.push(measure2.Expression);

    this.pageSize =15;
    this.totalRecords = 0;
    this.enablePagination=true;
    this.isFirstTime = true;
    this.currentPage = 0;
    this.totalPageCount = 0;
    this.layoutId= this.props.layoutId,

    this.state = {
      dimensions:[dim,dim1], //dim2
      measure: [measure],//,measure2],    //measure2
      cols: cols,
      isFormVisible: props.isFormVisible,
      showSettings: false,
      data:[]
    };

    //this.fetchData();
  }


  serviceBaseUrl = "http://localhost:57387/api/";

  fetchData() {
    //this.filterChanged = this.props.filterChanged;
    var widgetModel = {
      Dimension: this.state.dimensions,     
      Measure: this.state.measure,
      Type: "chart"
    };

    //Derive filtesr from Global filters.
    var filterList = [];
    if(this.props.globalFilters){
      filterList = _.clone(this.props.globalFilters);
    //   if (this.state.dimensions && this.state.dimensions.length > 0){ 
    //     var dimName = this.state.dimensions[0].Name;     
    //     this.props.globalFilters.map(function(filter,i){
    //       if(filter.ColName == dimName){
    //         _.remove(filterList, { 'ColName': dimName });
    //       }
    //     })

    //  }
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
             //this.props.filterChanged = false;
             if (response && response.data) {
               //console.log("response.data************", JSON.parse(response.data));
               this.setState({
                 data: response.data,                
                 count: this.totalRecords,                 
                 showSettings:true  
               });
             }
           })
           .catch(function(error) {
             console.log("error", error);
           });
       }
     }

  handleMeasureChange = (i) =>(evt) =>{
      //debugger;
      const measures = this.state.measure.map((m, midx) => {
        if (i !== midx) return m;
        return { ...m, Expression: evt.target.value };
      });
      
      this.setState({ measure: measures });
  }

  handleDimChange = (i) =>(evt) =>{
    //debugger;
    const dims = this.state.dimensions.map((m, midx) => {
      if (i !== midx) return m;
      return { ...m, Name: evt.target.value };
    });
    
    this.setState({ dimensions: dims });
}

  ShowConfigForm = () => {
   
    let dims = this.state.dimensions.map((dim,i)=>{
      return( 
      <div  key={i}>
        <label>Dimension:</label>
         <input        
           type="text"
           placeholder="Enter Dimention"
           value= {dim.Name} 
           onChange ={this.handleDimChange(i)}
         />      
       </div>)
       })

    let measures = 
         this.state.measure.map((m,i)=>{
          return( <div key={i}>
            <label>Measure:</label>
             <input         
               type="text"
               placeholder="Enter Expression"
               value= {m.Expression} 
               onChange ={this.handleMeasureChange(i)}
             />             
           </div>)
      })

      let save = (<div key="button"><button onClick={this.saveForm}>Apply</button> 
                  <button onClick={(e) => this.toggleConfirmForm(e)}>Cancel</button>
                  </div>)
   
      let ui=(
          <PropertyWindow>
            <div style={this.property_window}>
              {dims}
              {measures}
              {save}
            </div>
          </PropertyWindow>
        );     

    return ui;
  };

  saveForm = () => {
    this.toggleConfirmForm();
    this.props.onConfigurationChange({
      measure: this.state.measure,
      dimensions: this.state.dimensions,
      title: this.state.title,
      layoutId: this.layoutId,
      filters: this.state.filters
    });
    this.fetchData();
    
  };

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.globalFilters != this.props.globalFilters) {
  //     this.isFirstTime = true;     
  //     this.fetchData();
  //   } 
  // }
  componentDidMount() {
    console.log("componentDidMount");
   
    this.fetchData();
    let timeout;
    this.iScroll.addEventListener("scroll", () => {      
        clearTimeout(timeout);
        timeout = setTimeout(()=>{
          if(this.iScroll.scrollTop == 0){
            //alert("reached top");
            const node = ReactDOM.findDOMNode(this.iScroll);
            node.scrollTop = this.iScroll.scrollTop+10;
            this.previousPage();
          } else if (this.iScroll.scrollTop + this.iScroll.clientHeight >= this.iScroll.scrollHeight) {            
            //alert("load items)");
            const node = ReactDOM.findDOMNode(this.iScroll);
            node.scrollTop = this.iScroll.scrollTop-15;
            this.nextPage();
          }
        }, 200);       
    });  
}

  // toggleConfirmForm = () => {
  //   this.setState(prevState => ({
  //     isFormVisible: !prevState.isFormVisible,
  //     showSettings: prevState.isFormVisible
  //   }));
  // };

  nextPage(e){
    if(e){ 
    e.stopPropagation();
    }
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
    if(e){
      e.stopPropagation();
    }
   
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

  // onDeleteBox = () => {
  //   this.props.onDeleteBox({
  //     layoutId: this.state.layoutId,
  //     id: this.id
  //   });
  // }

  render() {
    console.log("DataGrid: Render");
    var showSettingLinkUI = (<span><a href="#" onClick={(e) => this.toggleConfirmForm(e)}>Settings</a> <a href="#" onClick={this.onDeleteBox}>X</a></span> );

    var defaultView = (
      <div>
        <button onClick={this.toggleConfirmForm}>Add Dimensions/Measure</button>
        <a href="#" onClick={this.onDeleteBox}>X</a> 
      </div>
    );

    var thDim = this.state.dimensions.map((dim)=>{
            return (<th key={dim.Name}>{dim.Name}</th>)
        });
        
    var thMeasure = this.state.measure.map((measure)=>{
        return  (<th  key={measure.Expression}>{measure.Expression}</th>)
    });

    var td = (row)=>{        
      return  this.state.cols.map((col,i)=>{
            return  (<td key={i}> {this.state.data[row][col]}           
                    </td>)
        });

    };


    var tr = this.state.data.map((d,i)=>{
        return  (<tr  key={i}> 
                    {td(i)}           
                 </tr>)
    });

    var paginationButtonView =(
        <div>
          <input type="button" onClick={this.previousPage} value="Previous" />
          <label>Current Page: {this.currentPage}</label>
          <input type="button" onClick={this.nextPage} value="Next" />        
        </div>
      );
    var view = (     
        <table className="table table-sm table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                {thDim}
                {thMeasure}
              </tr>
            </thead>
            <tbody>
                {tr}
            </tbody>
        </table>            
    );

    return (
      <React.Fragment>
        {(!this.state.data || (this.state.data && this.state.data.length == 0)) && defaultView}
        {this.state.showSettings && showSettingLinkUI }
        <div ref={(iScroll)=>this.iScroll = iScroll} style={table_Scroll}>
          {this.state.data && this.state.data.length > 0 && view}
          {/* {this.state.loadingState ? <p className="loading"> loading More Items..</p> : ""} */}
        </div>   
        {/* {this.state.data && this.state.data.length > 0 && this.enablePagination && paginationButtonView} */}
        {this.state.isFormVisible && this.ShowConfigForm()}
      </React.Fragment>
    );
  }
}
