import React, { Component } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  NavLink
} from "react-router-dom";
import Page from "./page.js";
import "./app.css";
// import PageListHeader from "../components/page-list-header.js";
import PortalCommon from "./portal-common.js";
var config = require('../config');

class App extends Component {
  constructor(props) {
    super(props);
    this.serviceBaseUrl = config.serviceBaseUrl;
    //this.onPageSelect = this.onPageSelect.bind(this);
    this.addPage = this.addPage.bind(this);
    this.setPageName = this.setPageName.bind(this);
    this.showNewPageForm = this.showNewPageForm.bind(this);
    this.hideNewPageForm = this.hideNewPageForm.bind(this);
    let app = props.data ? props.data : { pages: [] };
    this.state = {
      app: app,
      currPageName: "Pages (" + app.pages.length + ")",
      showPageForm: false
    };
    console.log("props-APP", props);


  }
  // componentDidUpdate(prevProps, prevState) {
  //     if (prevProps.data != this.state.app) {
  //     }
  // }

  componentDidMount() {
    console.log("componentDidMount-App");
    var that=this;
    if (!this.props.data) {
      axios
        .get(
          this.serviceBaseUrl +
            "data/getAppByIdAsString?appId=" +
            this.props.match.params.id
        )
        .then(response => {
          console.log("response", response);
          if (response && response.data) {
            //var test = JSON.parse(response.data);
            that.setState({
              app: JSON.parse(response.data),
              showAppForm: false,
              currPageName: "Pages (" + JSON.parse(response.data).pages.length + ")"
            });
          }
        })
        .catch(function(error) {
          console.log("error", error);
        });
    }
  }

  // onPageSelect(pageName){
  //     this.setState({
  //         currPageName: pageName
  //     })
  // }

  addPage() {
    var app = this.state.app;
    var page = {
      id: this.state.app.pages ? this.state.app.pages.length + 1 : 1,
      title: this.inpPageName.value,
      appId: app.id
    };
    
    console.log("page............", page);
    var that = this;
    //Create App
    axios
      .post(this.serviceBaseUrl + "data/createNewPage", page)
      .then(response => {
        console.log("response", response);
        if (response && response.data) {
          let data = JSON.parse(response.data);
          app.pages.push(page);
          that.setState({
            app: data,
            currPageName: "Pages (" + data.pages.length + ")",
            showPageForm:false
          });
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  setPageName(title) {    
    this.setState({
      currPageName: title
    });
  }

  showNewPageForm(){
    this.setState({
      showPageForm: true
    });
  }

  hideNewPageForm(){
    this.setState({
      showPageForm: false
    });
  }

  render() {
    //debugger;
    // var appId = this.state.app.id;
    // var pages = this.state.app.pages.map(p => {
    //   return (
    //     <Link to={`/app/${appId}/pages/${p.id}`} key={p.id}>
    //       <div className="page-link" key={p.title}>
    //         {p.title}
    //       </div>
    //     </Link>
    //   );
    // });

    var newPageFormView = app => {
      return (
<div className="col-sm-6 card pt-3">
        <div className="input-group mb-3">
          <input
            ref={inpPageName => (this.inpPageName = inpPageName)}
            type="text"
            placeholder="Enter Page Name"
            className="form-control"
            defaultValue=""
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={this.addPage}
            >
              Save
            </button>
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={this.hideNewPageForm}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      
        // <div>
        //   <div>
        //     <label>Page Name</label>
        //   </div>
        //   <div>
        //     <input
        //       ref={inpPageName => (this.inpPageName = inpPageName)}
        //       type="text"
        //       placeholder="Enter Page Name"
        //       defaultValue=""
        //     />
        //     <button onClick={this.addPage}>Save</button>
        //   </div>
        // </div>
      );
    };

    // var pagesRoutesView=(pages) => {
    //     pages.map(p => {
    //       return (
    //             <Route
    //                 path="/app/:appid/pages/${p.id}"
    //                 render={({ match }) => {
    //                     //   console.log("match.params.pageid",match.params.pageid);
    //                 return (<Page app={this.state.app} data={{'pageName':'Page1', 'appId': match.params.appid, 'pageId':1}}></Page>);
    //                 }}
    //             />
    //       );
    //     });
    // }

    var addNewPageView = () => {
      var app = this.state.app ? this.state.app : this.props.data;
      if (app) {
        return (
          <div className="new-page">
            <span id="pageName" />
            <Link
              to={{ pathname: `/app/${app.id}/pages/newpage` }}
              key={app.id}
              activeclassname="page-link"
              title="Add New Page"
              className="add-new-page-link"
            >
              +
            </Link>
          </div>
        );
      }
    };
    
    var appId = this.state.app ? this.state.app.id : "";
    var pages = this.state.app.pages ? this.state.app.pages : [];
    var pagesLi = pages.map(p => {
      return (
        <li key={"app" + p.id} onClick={() => this.setPageName(p.title)}>
          <NavLink
            to={`/app/${appId}/pages/${p.id}`}
            key={p.id}
            className="dropdown-item"
          >
            <div key={p.title}>{p.title}</div>
          </NavLink>
        </li>
      );
    });

    var pagesView=pages.map(d => {
      return (
        <React.Fragment key={d.id}>         
          <div className="col-sm-3">
            <div className="card">
              <div className="card-header">
                <Link
                  key={d.id}
                  to={{ pathname: `/app/${appId}/pages/${d.id}`, state: d }}
                >
                  <span>{d.title}</span>
                </Link>
                <a href="#" className="float-right ml-3">
                  <i className="fa fa-times text-danger" />
                </a>
                {/* <Link
                  key={d.title}
                  to={{ pathname: `/app/${d.id}/editor`, state: d }}
                  style={dataEditorLink}
                  className="float-right"
                >
                  <i className="fa fa-edit" />
                </Link> */}
              </div>             
            </div>
          </div>
        </React.Fragment>
      );
    });

    var pagesViewInHeader = (
      <React.Fragment>
        <a
          id="languages"
          rel="nofollow"
          data-target="#"
          href="#"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          className="nav-link language dropdown-toggle"
        >
          <span className="d-none d-sm-inline-block" id="currentPage">
            {/* Pages ({pages.length}) */}
            {this.state.currPageName}
          </span>
        </a>
        <ul aria-labelledby="languages" className="dropdown-menu z-9999">
          {pagesLi}
        </ul>
      </React.Fragment>
    );

    var dataManagerLink = (
      <li>
         <Link
            key={this.state.app.title}
            to={{ pathname: `/app/${this.state.app.id}/editor`, state: this.state.app }}                  
            className="float-right"
          >
            {" "}
              <i className="fa fa-home" />
              Data Manager
          </Link>                 
      </li>
    );

    return (
      <div>
        {/* <Header app={this.props.data}  /> */}
        {/* <PageListHeader>{pagesView}</PageListHeader> */}
        <PortalCommon target="pageList" type="id">
          {pagesViewInHeader}
        </PortalCommon>
        <PortalCommon target="dataManager" type="id">
        {dataManagerLink}
        </PortalCommon>
        {addNewPageView()}
        <Switch><Route
                  exact={true}
                  path="/app/:appid/pages"
                  render={({ match }) => {
                    return (
                      <div>
                        <div className="my-pages">                                                      
                          <div>
                            <div className="row">
                              <div className="col-sm-6">
                                <h3 className="mt-2 mb-2 ml-2">My Pages</h3>
                              </div>
                              <div className="col-sm-6">
                                <a
                                  onClick={e => this.showNewPageForm()}
                                  href="#"
                                  className="btn btn-info  mt-2 mb-2 ml-2 mr-2 float-right"
                                >
                                  <i className="fa fa-plus" /> Create New Page{" "}
                                </a>
                               
                              </div>
                            </div>
                          </div>
                          <div className="row"> {this.state.showPageForm && newPageFormView()}</div>
                        </div>
                        {/* {this.state.showAppForm && newAppFormView} */}
                        <div className="row">{pagesView}</div>
                      </div>
                    );
                  }}
                />

          <Route
            path="/app/:appid/pages/newpage"
            render={obj => {
              var app = obj.location.state;
              console.log("app.........", app);
              //   console.log("match.params.pageid",match.params.pageid);
              return newPageFormView(app);
            }}
          />
          {/* {pagesRoutesView(this.props.data.pages)}                     */}
          <Route
            path="/app/:appid/pages/:pageid"
            render={({ match }) => {
              //   console.log("match.params.pageid",match.params.pageid);
              //console.log("this.state___________",this.state);
             var page= this.state.app.pages.filter(item=>{
                return item.id == match.params.pageid
              });
              var pageName = "";
              if(page && page.length > 0){
                pageName = page[0].title;
              }
              //alert(pageName);
              return (
                <Page
                  key={match.params.pageid}
                  app={this.state.app}                  
                  data={{
                    appId: match.params.appid,
                    pageId: match.params.pageid,
                    pageName: pageName
                  }} 
                  setPageName={this.setPageName}                  
                  match={match}
                />
              );
            }}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
