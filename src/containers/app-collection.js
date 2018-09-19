import React, { Component } from "react";
import axios from "axios";
import App from "./app";
import DataEditor from "./data-editor";
import "./app-collection.css";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import Header from "./header";
var _ = require("lodash");

const newApp = {
  paddingTop: "50px"
};

const dataEditorLink = {
  // "position": "absolute",
  // "padding-left": "120px"
};

class AppCollection extends Component {
  constructor(props) {
    super(props);
    //this.onSetTitle = this.onSetTitle.bind(this);
    this.addApp = this.addApp.bind(this);
    this.hideNewAppForm = this.hideNewAppForm.bind(this);
    this.serviceBaseUrl = "http://localhost:57387/api/";
    this.state = {
      apps: [],
      showAppForm: false
    };
  }
  // state = {
  //   apps: [
  //     // {
  //     //   id: 1,
  //     //   title: "App 1",
  //     //   pages: [
  //     //     { id: 1, title: "page 1", description: "D1" },
  //     //     { id: 2, title: "page 2", description: "D1" }
  //     //   ]
  //     // },
  //     // {
  //     //   id: 2,
  //     //   title: "App 2",
  //     //   pages: [
  //     //     { id: 3,title: "page 3", description: "D2" },
  //     //     { id: 4,title: "page 4", description: "D2" }
  //     //   ]
  //     // }
  //   ],
  //   title:"",
  //   showAppForm:false
  // };

  componentDidMount() {
    console.log("componentDidMount-AppCollection");
    axios
      .get(this.serviceBaseUrl + "data/loadApps")
      .then(response => {
        console.log("response", response);
        if (response && response.data) {
          //var test = JSON.parse(response.data);
          this.setState({
            apps: JSON.parse(response.data),
            showAppForm: false
          });
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

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

  newAppForm() {
    this.setState({
      showAppForm: true
    });
  }

  addApp() {
    var apps = this.state.apps;
    var app = {
      id: this.state.apps.length + 1,
      title: this.inpAppName.value,
      pages: [],
      tables: []
    };
    apps.push(app);

    //Create App
    axios
      //.post(this.serviceBaseUrl + "data/createNewApp?appName="+this.inpAppName.value)
      .post(this.serviceBaseUrl + "data/createNewApp", app)
      .then(response => {
        console.log("response", response);
        this.setState({
          apps
        });
        this.hideNewAppForm();
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  hideNewAppForm() {
    this.setState({
      showAppForm: false
    });
  }

  // onSetTitle(title){
  //   this.setState({
  //     title:title
  //   });
  // }

  render() {
    var apps = this.state.apps.map(d => {
      return (
        <React.Fragment key={d.id}>
          {/* <div className="app">
            <Link key={d.id} to={{ pathname: `/app/${d.id}/pages`, state: d }}>
              {d.title}
            </Link>
            <Link
              key={d.title}
              to={{ pathname: `/app/${d.id}/editor`, state: d }}
              style={dataEditorLink}
            >
              <div>Data Editor</div>
            </Link>
          </div> */}

          <div className="col-sm-3">
            <div className="card">
              <div className="card-header">
                <Link
                  key={d.id}
                  to={{ pathname: `/app/${d.id}/pages`, state: d }}
                >
                  <span>{d.title}</span>
                </Link>
                <a href="#" className="float-right ml-3">
                  <i className="fa fa-times text-danger" />
                </a>
                <Link
                  key={d.title}
                  to={{ pathname: `/app/${d.id}/editor`, state: d }}
                  style={dataEditorLink}
                  className="float-right"
                >
                  <i className="fa fa-edit" />
                </Link>
              </div>
              {/* <div className="card-body">
                           <h5 className="card-title">Special title treatment</h5>
                           <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
<a href="page-details.html" className="btn btn-primary float-right"><i className="fa fa-arrow-right"></i></a>
                           <a href="app3.html" className="btn btn-primary">Go somewhere</a>
                        </div> */}
            </div>
          </div>
        </React.Fragment>
      );
    });

    var newAppFormView = (
      <div className="col-sm-6 card pt-3">
        <div className="input-group mb-3">
          <input
            ref={inpAppName => (this.inpAppName = inpAppName)}
            type="text"
            placeholder="Enter App Name"
            className="form-control"
            defaultValue=""
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={this.addApp}
            >
              Save
            </button>
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={this.hideNewAppForm}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        <Router>
          <div className="page">
            <Header />
            <div id="prop-root" />
            <div className="container-fluid">
              <Switch>
                <Route
                  exact={true}
                  path="/app"
                  render={({ match }) => {
                    return (
                      <div>
                        <div style={newApp}>
                          {/* <a href="#" onClick={e => this.newAppForm()}>
                            Create New App
                          </a> */}
                          <div>
                            <div className="row">
                              <div className="col-sm-6">
                                <h3 className="mt-2 mb-2 ml-2">My Apps</h3>
                              </div>
                              <div className="col-sm-6">
                                <a
                                  onClick={e => this.newAppForm()}
                                  href="#"
                                  className="btn btn-info  mt-2 mb-2 ml-2 mr-2 float-right"
                                >
                                  <i className="fa fa-plus" /> Create New App{" "}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        {this.state.showAppForm && newAppFormView}
                        <div className="row">{apps}</div>
                      </div>
                    );
                  }}
                />
                <Route
                  path="/app/:id/pages"
                  render={obj => {
                    var app = obj.location.state;
                    //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&this.state.apps",this.state.apps);
                    if (!app) {
                      app = _.find(this.state.apps, {
                        id: Number(obj.match.params.id)
                      });
                      console.log("app********", app);
                    }
                    //var app = _.find(this.state.apps, {id: Number(obj.match.params.id)});
                    return (
                      <App
                        key={obj.match.params.id}
                        data={app}
                        match={obj.match}
                      />
                    );
                  }}
                />
                <Route
                  path="/app/:id/editor"
                  //render={({ match,state }) => {
                  render={obj => {
                    //console.log("obje******", obj)    ;
                    //var app = obj.location.state;
                    // _.find(this.state.apps, {id: Number(obj.match.params.id)});
                    //console.log("this.state.apps********",this.state.apps);
                    //console.log("app********",app);
                    //if(!app){
                    var app = _.find(this.state.apps, {
                      id: Number(obj.match.params.id)
                    });
                    //}
                    if (!app) {
                      app = obj.location.state;
                    }
                    return (
                      <DataEditor key={app} data={app} match={obj.match} />
                    );
                  }}
                />
              </Switch>
            </div>
            <footer className="main-footer">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-6">
                    <p>ALGORISYS &copy; 2018-2019</p>
                  </div>
                  <div className="col-sm-6 text-right">
                    <p>
                      Design by{" "}
                      <a href="http://www.algorisys.com/" className="external">
                        algorisys
                      </a>
                    </p>
                    {/* <!-- Please do not remove the backlink to us unless you support further theme's development at https://bootstrapious.com/donate. It is part of the license conditions and it helps me to run Bootstrapious. Thank you for understanding :)--> */}
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </div>
    );

    // return (
    //   <div>
    //     <Router>
    //       <div>
    //         <Header />
    //         <div>
    //           <Switch>
    //             <Route
    //               exact={true}
    //               path="/app"
    //               render={({ match }) => {
    //                 return (
    //                   <div>
    //                     <div style={newApp}>
    //                       <a href="#" onClick={e => this.newAppForm()}>
    //                         Create New App
    //                       </a>
    //                     </div>
    //                     {this.state.showAppForm && newAppFormView}
    //                     <div className="app-container">{apps}</div>
    //                   </div>
    //                 );
    //               }}
    //             />
    //             <Route
    //               path="/app/:id/pages"
    //               render={obj => {
    //                 var app = obj.location.state;
    //                 //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&this.state.apps",this.state.apps);
    //                 if (!app) {
    //                   app = _.find(this.state.apps, {
    //                     id: Number(obj.match.params.id)
    //                   });
    //                   console.log("app********", app);
    //                 }
    //                 //var app = _.find(this.state.apps, {id: Number(obj.match.params.id)});
    //                 return (
    //                   <App
    //                     key={obj.match.params.id}
    //                     data={app}
    //                     match={obj.match}
    //                   />
    //                 );
    //               }}
    //             />
    //             <Route
    //               path="/app/:id/editor"
    //               //render={({ match,state }) => {
    //               render={obj => {
    //                 //console.log("obje******", obj)    ;
    //                 //var app = obj.location.state;
    //                 // _.find(this.state.apps, {id: Number(obj.match.params.id)});
    //                 //console.log("this.state.apps********",this.state.apps);
    //                 //console.log("app********",app);
    //                 //if(!app){
    //                 var app = _.find(this.state.apps, {
    //                   id: Number(obj.match.params.id)
    //                 });
    //                 //}
    //                 if (!app) {
    //                   app = obj.location.state;
    //                 }
    //                 return (
    //                   <DataEditor key={app} data={app} match={obj.match} />
    //                 );
    //               }}
    //             />
    //           </Switch>
    //         </div>
    //       </div>
    //     </Router>
    //   </div>
    // );
  }
}

export default AppCollection;
