import React, { Component } from "react";
import axios from "axios";
var _ = require("lodash");

export default class DataGrid extends Component {
  constructor(props) {
      //debugger;
    super(props);
    this.toggleConfirmForm = this.toggleConfirmForm.bind(this);
    this.fetchData = this.fetchData.bind(this);

    this.globalFilters = this.props.globalFilters
    this.filters =[];

    var dim = {Name:'ProductInventory.Shelf'};
    //var dim = {Name:'Product.Name'};
    var dim1 = {Name:'ProductVendor.VendorId'};
    var dim2 = {Name:'PurchaseOrderHeader.ShipMethodId'};

    var measure = {Expression:'sum(ProductInventory.Quantity)'};
    var measure2 = {Expression:'count(PurchaseOrderDetail.PurchaseOrderId)'};

    var cols =[];
    cols.push(dim.Name);
    cols.push(dim1.Name);
    cols.push(dim2.Name);
    cols.push(measure.Expression);
    cols.push(measure2.Expression);

    this.state = {
      dimensions:[dim,dim1,dim2], //dim2
      measure: [measure,measure2],    //measure2
      cols: cols,
      isFormVisible: false,
      showSettings: false,
      data:[]
    };

    //this.fetchData();
  }


  serviceBaseUrl = "http://localhost:57387/api/";

  fetchData() {
  
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

    var that = this;
    axios
      .post(this.serviceBaseUrl + "data/getData", widgetModel)
      .then(response => {
        console.log("response", response);
        if (response && response.data) {
            console.log("response", response.data);
            //debugger;
          this.setState({            
            data: response.data,
            showSettings:true             
          });
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
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
        {this.state.isFormVisible && this.ShowConfigForm()}
      </React.Fragment>
    );
  }
}
