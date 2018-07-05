import React, { Component } from "react";
import axios from "axios";
var _ = require("lodash");

export default class CurrentSelection extends Component {
  constructor(props) {
    super(props);
   
    this.state={
        filters: this.props.filters
    }
  }

  render() {
    console.log("Filter: Current Selection");
   
    var li = this.state.filters.map(f => {
      return (
        <li key={f.colName} > 
            {f.colName} -  {f.values.join(',')}
        </li>
      );
    });

    var view = (
       <div>
           <label>Current Selection</label>
           <ul>
               {li}
            </ul>
       </div>
    );

    return (
      <React.Fragment>       
       {view}
      </React.Fragment>
    );
  }
}
