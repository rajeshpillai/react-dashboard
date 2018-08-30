import React, { Component } from "react";
import axios from "axios";
import App from "./app";
import DataEditor from "./data-editor";
import "./app-collection.css";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import Header from "./header";
var _ = require('lodash');

const newApp={
  "paddingTop": "50px"
};

const dataEditorLink={    
  // "position": "absolute",
  // "padding-left": "120px"
};

class AppCollection extends Component {
  constructor(props){
    super(props);
    //this.onSetTitle = this.onSetTitle.bind(this);
    this.addApp = this.addApp.bind(this);
    this.serviceBaseUrl = "http://localhost:57387/api/";
    this.state={
      apps:[],
      showAppForm:false
    }  
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
          apps:JSON.parse(response.data),
          showAppForm:false
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

  newAppForm(){
    this.setState({
      showAppForm:true
    });
  }

  addApp(){
      var apps = this.state.apps;
      var app ={
        id: this.state.apps.length+1,
        title: this.inpAppName.value,
        pages: [],
        tables:[]
      };
      apps.push(app);

      //Create App
      axios
      //.post(this.serviceBaseUrl + "data/createNewApp?appName="+this.inpAppName.value)
      .post(this.serviceBaseUrl + "data/createNewApp",app)
      .then(response => {
        console.log("response", response);
        this.setState({
          apps
        });
      })
      .catch(function(error) {
        console.log("error", error);
      });
     
  }

  hideNewAppForm(){
    this.setState({
      showAppForm:false
    })
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
        <div className="app" >
          <Link key={d.id} to={{pathname: `/app/${d.id}/pages`, state: d}}>            
              {d.title}                  
          </Link>
          <Link key={d.title} to={{pathname: `/app/${d.id}/editor`, state: d}} 
           style={dataEditorLink}>
            <div>Data Editor</div>
          </Link>
          </div>  
        </React.Fragment>
      );
    });

    var newAppFormView = (
     <div>
        <div><label>App Name</label></div>
        <div><input
              ref={(inpAppName)=>this.inpAppName = inpAppName}
              type="text"
              placeholder="Enter App Name"
              defaultValue=""
            />
           <button onClick={this.addApp}>Save</button>
        </div>
      </div>
    );

    return (
      <div>           
        <Router>   
          <div>
            <Header />               
            <div>    
              <Switch>    
                <Route
                  exact={true}
                  path="/app"
                  render={({ match }) => {
                  return (<div>
                    <div style={newApp}>
                      <a href="#" onClick={(e)=>this.newAppForm()}>Create New App</a>
                    </div>  
                    {this.state.showAppForm && newAppFormView}
                    <div className="app-container">{apps}</div>
                    </div>);
                  }}
                />                 
                <Route
                  path="/app/:id/pages"                  
                  render={(obj) => {                  
                    var app = obj.location.state;
                    //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&this.state.apps",this.state.apps);
                    if(!app){
                      app = _.find(this.state.apps, {id: Number(obj.match.params.id)});   
                      console.log("app********",app);
                    }
                    //var app = _.find(this.state.apps, {id: Number(obj.match.params.id)});                
                    return (<App key={obj.match.params.id}  data={app}  match={obj.match}  />);
                  }}
                />           
                <Route             
                  path="/app/:id/editor"                  
                  //render={({ match,state }) => {         
                  render={(obj) => {                       
                    //console.log("obje******", obj)    ;    
                    //var app = obj.location.state;
                    // _.find(this.state.apps, {id: Number(obj.match.params.id)});
                    //console.log("this.state.apps********",this.state.apps);
                    //console.log("app********",app);
                    //if(!app){
                      var app = _.find(this.state.apps, {id: Number(obj.match.params.id)});   
                    //}
                    if(!app){
                      app = obj.location.state;
                    }
                    return <DataEditor key={app} data={app} match={obj.match} />;
                  }}
                />
                </Switch>
            </div>  
          </div>  
        </Router>
      </div>
    );
  }
}

export default AppCollection;
