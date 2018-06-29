import React, { Component } from 'react';
import Dimension from '../models/dimension';
import Measure from '../models/measure';
import axios from 'axios';

export default class Kpi extends Component {
   state ={
       dimensions: [],
       measure:[],
       value :"",
       measureText: "hello",
   }

   serviceBaseUrl ='http://localhost:57387/api/';
    
    fetchData = () => {
        
       var name = this.state.measureText;

        var widgetModel ={
            Dimension : this.state.dimensions,
            Measure : this.state.measure
        };
     
         axios.post(this.serviceBaseUrl + 'data/getData',widgetModel)
            .then((response) => {
                console.log('response',response);            
                if(response && response.data){
                        this.setState({
                            value: response.data[0][this.state.measureText]
                        });
                }
            })
            .catch(function (error) {
                console.log('error',error);
            });
    }

    static getDerivedStateFromProps(props, state) {
        console.log("gdsfp");
        //debugger;
        if (props.measure == state.measure) {
            return {
             measure: props.measure
            }
        }
        return null;
    }

    componentDidMount(){
        console.log('componentDidMount');
        this.fetchData();
    }

    onInputChange = (e) => {
        e.preventDefault();
        console.log(e.target.value);
        let measureValue = e.target.value;
        this.setState({
            measureText: measureValue,
            measure: [{
                Expression: measureValue
            }]
        }, () => {
            this.fetchData();
        })
    }

    render(){
        console.log("KPI: Render");
        return (
            <React.Fragment>
              <h2>KPI - {this.props.title} - {this.state.value}</h2>
              <div>
                 <label>Expression: 
                    <input type="text" onChange={this.onInputChange}
                        value={this.state.measureText}
                        /> 
                 </label>
              </div>
            </React.Fragment>
        )
    }
}