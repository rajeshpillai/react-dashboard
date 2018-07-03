import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import './app.css';
var _ = require('lodash');

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            app: {}
        }
        console.log('props.data',props.data);
        // state = {
        //     props.app
        // }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data !== state.app) {
            return {
                app: props.data
            }
        }
        return null;
    }

  
  render() {
    var pages = this.state.app.pages.map(p => {
      return (
        <Link to={`/app/${p.id}`} key={p.id}>
          <div className="page-link" key={p.title}>
            {p.title}
          </div>
        </Link>
      );
    });

    return (
      <div className="app-container">
          {pages}
      </div>
    );
  }
}

export default App;
