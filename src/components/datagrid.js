import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from "axios";
import PropertyWindow from "./property-window";
import Toolbox from "./toolbox.js" 
import ContainerDimensions from 'react-container-dimensions';
import $ from "jquery";
var _ = require("lodash");

const table_Scroll={
  width: "500px",
  height: "400px",
  overflow: "scroll"
}

const defaultData = [
  {"Enter Dimension": 'x1', "Enter Expression": 100},
  {"Enter Dimension": 'x2', "Enter Expression": 200},
  {"Enter Dimension": 'x3', "Enter Expression": 50}
];


export default class DataGrid extends Toolbox {
  constructor(props) {
      //debugger;
    super(props);
    this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
    this.saveForm = this.saveForm.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.ShowConfigForm = this.ShowConfigForm.bind(this);
    this.nextPage = this.nextPage.bind(this);  
    this.previousPage = this.previousPage.bind(this);
    this.getData = this.getData.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.searchData = this.searchData.bind(this);
    this.onSearchBlur = this.onSearchBlur.bind(this);
    this.onScroll = this.onScroll.bind(this);
    
    //this.globalFilters = this.props.globalFilters
    //this.filterChanged = this.props.filterChanged;
    this.filters =[];
    this.searchList=[];
    
    this.pageSize =15;
    this.totalRecords = 0;
    this.enablePagination=true;
    this.isFirstTime = true;
    this.currentPage = 0;
    this.totalPageCount = 0;
    this.layoutId= props.layoutId;    
    this.id =  props.id;
    this.dimensions =props.dimensions;
    this.measure =props.measure;
    this.defaultValue = false;
    this.searchList =[];

    var cols = props.cols;
    if(!this.dimensions || !this.measure){
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


      // var dim = {Name:'employee1.ename'};
      // //var dim = {Name:'Product.Name'};
      // var dim1 = {Name:'skills1.skill'};
      // //var dim2 = {Name:'PurchaseOrderHeader.ShipMethodId'};
  
      // var measure = {Expression:'sum(employee1.salary)'};
      //var measure2 = {Expression:'count(employee.ename)'};
      
      var dim = {Name:'Enter Dimension'};      
      var measure = {Expression:'Enter Expression'};
      cols =[];
      cols.push({name: dim.Name, displayName: dim.Name, allowSearch:true});   
      cols.push({name: measure.Expression, displayName: measure.Expression, allowSearch:false});

      this.dimensions=[dim];
      this.measure=[measure];
      this.defaultValue = true;
    }

    this.state = {
      dimensions:this.dimensions,
      measure: this.measure,
      cols: cols,
      isFormVisible: props.isFormVisible,
      showSettings: true,
      data:defaultData
    };

    //this.fetchData();
  }
  
  searchData(event,col){
    var keyCode = event.which || event.keyCode;
    //console.log("keyCode",keyCode);
    //console.log("col",col);
    //alert("search");  
    // If enter key is pressed
    if (keyCode === 13){
      var colName = col.name;
      var searchData = event.currentTarget.value;
      var searchList = this.searchList;
      if(!searchList) {searchList = [];}
      var existingSearch = _.filter(searchList, { 'ColName': colName });     

      //debugger;
      if (existingSearch.length>0) { existingSearch[0]['Value'] = searchData; }
      else { searchList.push({ 'ColName': colName, 'Value': searchData }); }

      if (searchData.length == 0) {
          //If Empty remove search
          _.remove(searchList, { 'ColName': colName });
      }

      if (searchList.length > 0) {
          this.startRowNum = 0;
          this.currentPage = 1;
          this.isFirstTime = true;
          this.enablePagination=true;
      }
     
      this.fetchData();
      //refreshGridData(false,false)
    }
  }

  onSearchBlur(event,col){
    if (event.currentTarget.value.length == 0)
    {     
        var cols = this.state.cols; 
        cols.map((c,i)=>{
          if(c.name == col.name){
            c.showSearch = false;
          }
          return c;
        })              
        
        //event.currentTarget.value = "";
        var existingSearch = _.filter(this.searchList, { 'ColName': col.name });

        //debugger;
        if (existingSearch.length > 0) {
            //If Empty remove search
            _.remove(this.searchList, { 'ColName': col.name });
        }

        this.startRowNum = 0;
        this.currentPage = 1;
        this.isFirstTime = true;
        this.enablePagination=true;

        this.setState({cols:cols},()=>{
          this.fetchData();
        })

       
    }
  }

  fetchData() {
    if(this.defaultValue){
      return;
    }

    //this.filterChanged = this.props.filterChanged;
    var widgetModel = {    
      Type: "datagrid",
      ShowTotal: true,
      AppId: this.appId
    };

    if(this.state.dimensions && this.state.dimensions.length > 0){
      widgetModel.Dimension = this.state.dimensions;
    }
    if(this.state.measure && this.state.measure.length > 0){
      widgetModel.Measure = this.state.measure;
    }
    
    if(this.searchList  && this.searchList.length > 0){
      widgetModel.SearchList = this.searchList;
    }

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
           .post(this.serviceGetDataUrl, widgetModel)
           .then(response => {
             console.log("response", response);
             this.isFirstTime = false;
             //this.props.filterChanged = false;
             if (response && response.data) {
               //console.log("response.data************", JSON.parse(response.data));
              //  var data = this.state.data;
              //  if(this.currentPage > 1){
              //   data = data.concat(response.data);                
              //  } else {
              //   data = response.data 
              //  }
              var data = response.data ;
               this.setState({
                 data: data,                
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
      this.measure = this.measure.map((m, midx) => {
        if (i !== midx) return m;
        return { ...m, Expression: evt.target.value };
      });
      
      //this.setState({ measure: measures, cols: cols  });
  }

  handleDimChange = (i) =>(evt) =>{
    //debugger;
    this.dimensions= this.dimensions.map((m, midx) => {
      if (i !== midx) return m;
      return { ...m, Name: evt.target.value };
    });
   
    //this.setState({ dimensions: dims, cols: cols });
}

  ShowConfigForm = () => {
   
    let dims = this.state.dimensions.map((dim,i)=>{
      return( 
      <div  key={i}>
        <label>Dimension:</label>
         <input        
           type="text"
           placeholder="Enter Dimention"
           defaultValue= {this.state.dimensions[i].Name} 
           onChange ={this.handleDimChange(i)}
         />  
            <span><a href="#" onClick={() => this.addNewDimension()}>+</a></span>  
            <span><a href="#" onClick={() => this.deleteDimension(dim)}>X</a></span>     
       </div>        
      )
       })

    let measures = 
         this.state.measure.map((m,i)=>{
          return( <div key={i}>
             <label>Measure:</label>
             <input         
               type="text"
               placeholder="Enter Expression"
               defaultValue= {this.state.measure[i].Expression} 
               onChange ={this.handleMeasureChange(i)}
             />      
                <span><a href="#" onClick={() => this.addNewMeasure()}>+</a></span>  
                <span><a href="#" onClick={() => this.deleteMeasure(m)}>X</a></span>          
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

  addNewMeasure(){    
    var m = {};
    this.measure.push(m);
    this.setState(
      {        
        measure: this.measure
      });
  }

  deleteMeasure(m){    
    var measure = this.measure.filter((l)=>{
      return l.Expression != m.Expression;
    })
    this.setState({
      measure
    });
    this.measure = measure;    
  }

  addNewDimension(){    
    var d = {};
    this.dimensions.push(d);
    this.setState(
      {        
        dimensions: this.dimensions
      });
  }

  deleteDimension(dim){    
    var dimensions = this.dimensions.filter((d)=>{
      return d.Name != dim.Name;
    })
    this.setState({
      dimensions
    });
    this.dimensions = dimensions;    
  }

  saveForm = () => {
    this.defaultValue = false;
    this.isFirstTime =true;
    this.enablePagination = true;
    this.toggleConfirmForm();
    var cols=[];
      this.dimensions.map((dim, midx) => {
        cols.push({name: dim.Name, displayName: dim.Name, allowSearch:true});
      });
      this.measure.map((m, midx) => {
        cols.push({name: m.Expression, displayName: m.Expression, allowSearch:false});
      });

      this.setState(
        {
          dimensions: this.dimensions,
          measure: this.measure,
          cols: cols
        },
        () => {
          this.props.onConfigurationChange({
            measure: this.state.measure,
            dimensions: this.state.dimensions,
            cols: this.state.cols,
            title: this.state.title,
            layoutId: this.layoutId,
            filters: this.state.filters,
            id:this.id
          });
          this.fetchData();
        }
      );

    
    
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
    // let timeout;
    // this.iScroll.addEventListener("scroll", () => {      
    //     clearTimeout(timeout);
    //     timeout = setTimeout(()=>{
    //       if(this.iScroll.scrollTop == 0){
    //         //alert("reached top");
    //         const node = ReactDOM.findDOMNode(this.iScroll);
    //         node.scrollTop = this.iScroll.scrollTop+10;
    //         this.previousPage();
    //       } else if (this.iScroll.scrollTop + this.iScroll.clientHeight >= this.iScroll.scrollHeight) {            
    //         //alert("load items)");
    //         const node = ReactDOM.findDOMNode(this.iScroll);
    //         node.scrollTop = this.iScroll.scrollTop-15;
    //         this.nextPage();
    //       }
    //     }, 200);       
    // });  

    // Change the selector if needed
    //debugger;
    var that = this;
    setTimeout(()=>{
     // debugger;
    var $table = $('table.scroll'),
    $bodyCells = $table.find('tbody tr:first').children(),
    colWidth;

    // Adjust the width of thead cells when window resizes
    $(window).resize(function() {
    // Get the tbody columns width array
    colWidth = $bodyCells.map(function() {
        return $(this).width();
    }).get();

    // Set the width of thead columns
    $table.find('thead tr').children().each(function(i, v) {
        $(v).width(colWidth[i]);
    });    

    let timeout; //scrollContent
    this.iScroll = $(".scrollContent",$("#"+ "table_" + this.id))[0];
    //var nextPage = this.nextPage;
    if(!this.iScroll){ return;}
    // this.iScroll.addEventListener("scroll", () => {      
    // //this.iScroll.("scroll", () => {      
    //     clearTimeout(timeout);
    //     timeout = setTimeout(()=>{
    //       if(this.iScroll.scrollTop == 0){
    //         //alert("reached top");
    //         //debugger;
    //         const node = ReactDOM.findDOMNode(this.iScroll);
    //         if(that.currentPage > 1){
    //           node.scrollTop = this.iScroll.scrollTop+10;
    //         } else {
    //           node.scrollTop = this.iScroll.scrollTop;
    //         }
    //         //node.scrollTop = this.iScroll.scrollTop+10;
    //         that.previousPage();
    //       } else if (this.iScroll.scrollTop + this.iScroll.clientHeight >= this.iScroll.scrollHeight) {            
    //         //alert("load items)");
    //         const node =  ReactDOM.findDOMNode(this.iScroll);
    //         // if(that.currentPage < that.totalPageCount){
    //         //   node.scrollTop = this.iScroll.scrollTop-15;
    //         // } else {
    //         //   node.scrollTop = this.iScroll.scrollTop -1;
    //         // }
    //         node.scrollTop = this.iScroll.scrollTop-15;
    //         //debugger;
    //         that.nextPage();
    //       }
    //     }, 200);       
    // });  

    }).resize(); // Trigger resize handler
  }, 200); 

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
    if(this.currentPage <= 0){
      this.currentPage = 1;
    }
    if(this.currentPage > this.totalPageCount){
      this.currentPage  = this.totalPageCount;
    } else {
      if(this.isFirstTime){
        this.startRowNum = 0;        
      } else {
        this.startRowNum = parseInt(this.startRowNum) + parseInt(this.pageSize);
        if (this.currentPage != Math.floor(this.startRowNum/this.pageSize)){
          this.currentPage = Math.floor(this.startRowNum/this.pageSize);
        }
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
    if (this.curentPage != Math.floor(this.startRowNum/this.pageSize)){
      this.currentPage = Math.floor(this.startRowNum/this.pageSize);
    }
    if(this.currentPage <=0){
      this.currentPage  = 1;
    } else {
      if(this.isFirstTime){
        this.startRowNum = 0;        
      } else {
        this.startRowNum = parseInt(this.startRowNum) - parseInt(this.pageSize);
        if (this.currentPage != Math.floor(this.startRowNum/this.pageSize)){
          this.currentPage = Math.floor(this.startRowNum/this.pageSize);
        }
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

  toggleSearch(col){
     var cols = this.state.cols;
     cols = cols.map((c,i)=>{
        if(c.name == col.name){
          c.showSearch = !c.showSearch;
        }
        return c;
     })

     this.setState({cols:cols});
  }

  onScroll(e){
    //this.iScroll.addEventListener("scroll", () => {      
    //this.iScroll.("scroll", () => {      
       // clearTimeout(timeout);
        //timeout = setTimeout(()=>{
          this.iScroll = e.target;
          if(this.iScroll.scrollTop == 0){
            //alert("reached top");
            //debugger;
            const node = ReactDOM.findDOMNode(this.iScroll);
            if(this.currentPage > 1){
              node.scrollTop = this.iScroll.scrollTop+10;
            } else {
              node.scrollTop = this.iScroll.scrollTop;
            }
            //node.scrollTop = this.iScroll.scrollTop+10;
            this.previousPage();
          } else if (this.iScroll.scrollTop + this.iScroll.clientHeight >= this.iScroll.scrollHeight) {            
            //alert("load items)");
            const node =  ReactDOM.findDOMNode(this.iScroll);
            // if(that.currentPage < that.totalPageCount){
            //   node.scrollTop = this.iScroll.scrollTop-15;
            // } else {
            //   node.scrollTop = this.iScroll.scrollTop -1;
            // }
            node.scrollTop = this.iScroll.scrollTop-15;
            //debugger;
            this.nextPage();
          }
        //}, 200);       
    //});  
  }

  render() {
    console.log("DataGrid: Render");
    var showSettingLinkUI = (<span><a href="#" onClick={(e) => this.toggleConfirmForm(e)}>Settings</a> <a className="right" href="#" onClick={this.onDeleteBox}>X</a></span> );

    var defaultView = (
      <div>
        <button onClick={this.toggleConfirmForm}>Add Dimensions/Measure</button>
        <a href="#" onClick={this.onDeleteBox}>X</a> 
      </div>
    );

    var searchButtonView = (col) =>{
      return (
          <span className="right"><a href="#" onClick={()=>this.toggleSearch(col)}>Search</a></span>     
      )
    };

    var searchTextBoxView= (col) =>{
      return (<input type="text" onKeyUp={(e)=>this.searchData(e,col)} 
                onBlur={(e)=>this.onSearchBlur(e,col)}   />);
    }
    

    var thHeading = this.state.cols.map((col,i)=>{
      return (<th key={i}>{col.displayName}  
               {col.allowSearch && searchButtonView(col)}
               {col.showSearch && searchTextBoxView(col)}
              </th>)
    });

    // var thDim = this.state.dimensions.map((dim)=>{
    //         return (<th key={dim.Name}>{dim.Name}  <span>Search</span></th>)
    //     });
        
    // var thMeasure = this.state.measure.map((measure)=>{
    //     return  (<th  key={measure.Expression}>{measure.Expression}</th>)
    // });

    var td = (rowIndex)=>{        
      return  this.state.cols.map((col,i)=>{
            return  (<td key={i}> {getTDData(rowIndex,col.name)}
                    </td>)
        });

    };

    var getTDData =(rowIndex,colName) =>{
        return (this.state.data[rowIndex][colName] || this.state.data[rowIndex]['"' + colName + '"'] )
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
          // <ContainerDimensions>
          // { ({ width, height }) =>             
            <table id={"table_" + this.id} height="100%"  className="scrollTable table table-sm table-bordered table-striped">
                <thead className="thead-dark fixedHeader">
                  <tr>
                    {/* {thDim}
                    {thMeasure} */}
                    {thHeading}
                  </tr>
                </thead>
                <tbody className="scrollContent" onScroll={this.onScroll}>
                    {tr}
                </tbody>
            </table>  
      //     }
      // </ContainerDimensions>                  
    );

    return (
      <React.Fragment>
        {(!this.state.data || (this.state.data && this.state.data.length == 0)) && defaultView}
        {this.state.showSettings && showSettingLinkUI }
        {/* <div ref={(iScroll)=>this.iScroll = iScroll} style={table_Scroll}> */}
        <ContainerDimensions>
          { ({ width, height }) =>   
              <div id="tableContainer" className="tableContainer" width={width} height={height} >
                {this.state.data && this.state.data.length > 0 && view}
                {/* {this.state.loadingState ? <p className="loading"> loading More Items..</p> : ""} */}
              {/* </div>    */}
              </div>
         }
         </ContainerDimensions>     
        {/* {this.state.data && this.state.data.length > 0 && this.enablePagination && paginationButtonView} */}
        {this.state.isFormVisible && this.ShowConfigForm()}
      </React.Fragment>
    );
  }
}
