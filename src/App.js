import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Page from "./page.js";
import './app.css';

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
    var appId = this.state.app.id;
    var pages = this.state.app.pages.map(p => {
      return (
        <Link to={`/app/${appId}/page/${p.id}`} key={p.id}>
          <div className="page-link" key={p.title}>
            {p.title}
          </div>          
        </Link>
      );
    });

    return (
        <div>
            <div className="app-container">
                {pages}
            </div>            
            <Route              
              path="/app/:appid/page/:pageid"
              render={({ match }) => {                  
              return (<Page data={{'pageName':'Page' + match.params.pageid}}></Page>);
              }}
            />           
        </div>
    );
  }
}

export default App;
