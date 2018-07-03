import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

class Pages extends Component {
  constructor(props){
      super(props);
      this.appId = props.appId;
      
  }

  render() {
    var apps = this.state.apps.map(d => {
      return (
        <Link to={`/app/${d.id}`}>
          <div className="app" key={d.title}>
            {d.title}
          </div>
        </Link>
      );
    });

    return (
      <React.Fragment>
        <Router>
          <div>
            <Route
              exact="true"
              path="/app"
              render={({ match }) => {
                return <div className="app-container">{apps}</div>;
              }}
            />

            <div>
              <Route
                path="/app/:id"
                render={({ match }) => {
                  return <h2>{match.params.id}</h2>;
                }}
              />
            </div>
          </div>
        </Router>
      </React.Fragment>
    );
  }
}

export default Pages;
