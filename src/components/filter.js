import React, { Component } from 'react';
import Dimension from '../models/dimension';
import Measure from '../models/measure';
import axios from 'axios';

export default class Filter extends Component {
   

   state ={
       dimensions: [],      
       values :[]]
   }

   serviceBaseUrl ='http://localhost:57387/api/';
    
    // fetchData = () => {
    //      var m = new Measure();
    //      m.Expression= "sum(VacationHours)";
    //     this.state.measure.push(m);

    //     var widgetModel ={
    //         Dimension : this.state.dimensions,
    //         Measure : this.state.measure
    //     };
     
    //      axios.post(this.serviceBaseUrl + 'data/getData',widgetModel)
    //     .then((response) => {
    //         console.log('response',response);            
    //         if(response && response.data){
    //                 this.setState({
    //                     value: response.data[0][m.Expression]
    //                 });
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log('error',error);
    //     });
    // }

    // componentDidMount(){
    //     console.log('componentDidMount');
    //     this.fetchData();
    // }

    render(){
        console.log("Filter: Render");
        return (<h2>Filter - </h2>)
    }
}