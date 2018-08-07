import React, { Component } from "react";
import App from "./app";
import DataEditor from "./dataEditor";
import "./AppCollection.css";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
var _ = require('lodash');

class AppCollection extends Component {
  state = {
    apps: [
      {
        id: 1,
        title: "App 1",
        pages: [
          { id: 1, title: "page 1", description: "D1" },
          { id: 2, title: "page 2", description: "D1" }
        ]
      },
      {
        id: 2,
        title: "App 2",
        pages: [
          { id: 3,title: "page 3", description: "D2" },
          { id: 4,title: "page 4", description: "D2" }
        ]
      }
    ]
  };

  showDashboard = id => {
    //alert(id);
    var apps = this.state.apps.map(item => {
      if (item.id == id) {
        item.selected = true;
      }
      return item;
    });

    this.setState({
      apps
    });
  };

  render() {
    var apps = this.state.apps.map(d => {
      return (
        <React.Fragment>
          <Link key={d.id} to={`/app/${d.id}/pages`}>
            <div className="app" >
              {d.title}
            </div>         
          </Link>
          <Link key={d.title} to={`/app/${d.id}/editor`}>
            <div>Data Editor</div>
          </Link>
        </React.Fragment>
      );
    });

    return (
      <React.Fragment>
        <Router>
        <div>
          <div>
            <Route
              exact={true}
              path="/app"
              render={({ match }) => {
                return <div className="app-container">{apps}</div>;
              }}
            />
          </div>
           <div>
              <Route
                path="/app/:id/pages"
                render={({ match }) => {
                  var app = _.find(this.state.apps, {id: Number(match.params.id)});
                  
                  // let app2 = this.state.apps.find((a) => {
                  //   return a.id == match.params.id;
                  // });
                   return (<App data={app} />);
                }}
              />
           </div>
           <div>
            <Route             
              path="/app/:id/editor"
              render={({ match }) => {
                var app = _.find(this.state.apps, {id: Number(match.params.id)});
                return <DataEditor data={app} />;
              }}
            />
          </div>
        </div>  
        </Router>
      </React.Fragment>
    );
  }
}

export default AppCollection;
