import React, { Component } from "react";
import axios from "axios";
var _ = require("lodash");

export default class DataGrid extends Component {
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

    var dim = {Name:'employee.ename'};
    //var dim = {Name:'Product.Name'};
    var dim1 = {Name:'skills.skill'};
    //var dim2 = {Name:'PurchaseOrderHeader.ShipMethodId'};

    var measure = {Expression:'sum(employee.salary)'};
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

    this.state = {
      dimensions:[dim,dim1], //dim2
      measure: [measure],//,measure2],    //measure2
      cols: cols,
      isFormVisible: false,
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
      return( <div  key={i}>
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
   
      let ui=[dims,measures,save];     

    return ui;
  };

  saveForm = () => {
    this.toggleConfirmForm();
    this.props.onConfigurationChange({
      measure: this.state.measure,
      dimensions: this.state.dimensions,
      title: this.state.title,
      layoutId: this.state.layoutId,
      filters: this.state.filters
    });
    this.fetchData();
    
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.globalFilters != this.props.globalFilters) {
      this.isFirstTime = true;     
      this.fetchData();
    } 
  }
  componentDidMount() {
    console.log("componentDidMount");

    this.fetchData();
  }

  toggleConfirmForm = () => {
    this.setState(prevState => ({
      isFormVisible: !prevState.isFormVisible,
      showSettings: prevState.isFormVisible
    }));
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

  
  render() {
    console.log("DataGrid: Render");
    var showSettingLinkUI = (<span><a href="#" onClick={(e) => this.toggleConfirmForm(e)}>Settings</a></span>);

    var defaultView = (
      <div>
        <button onClick={this.toggleConfirmForm}>Add Measure</button>
      </div>
    );

    var thDim = this.state.dimensions.map((dim)=>{
            return (<th>{dim.Name}</th>)
        });
        
    var thMeasure = this.state.measure.map((measure)=>{
        return  (<th>{measure.Expression}</th>)
    });

    var td = (row)=>{        
      return  this.state.cols.map((col,i)=>{
            return  (<td> {this.state.data[row][col]}           
                    </td>)
        });

    };


    var tr = this.state.data.map((d,i)=>{
        return  (<tr> 
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
        <table>
            <thead>
                {thDim}
                {thMeasure}
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
        {!this.state.isFormVisible && this.state.data && this.state.data.length > 0 && view}
        {!this.state.isFormVisible && this.state.data && this.state.data.length > 0 && this.enablePagination && paginationButtonView}
        {this.state.isFormVisible && this.ShowConfigForm()}
      </React.Fragment>
    );
  }
}