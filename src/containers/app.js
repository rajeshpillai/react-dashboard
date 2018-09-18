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
import Header from "./header";
import NewPageLink from "./new-page-link.js";
import PageListHeader from "../components/page-list-header.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.serviceBaseUrl = "http://localhost:57387/api/";
    //this.onPageSelect = this.onPageSelect.bind(this);
    this.addPage = this.addPage.bind(this);
    this.state = {
      app: props.data ? props.data : { pages: [] },
      currPageName: ""
    };
    console.log("props.data", props.data);
  }
  // componentDidUpdate(prevProps, prevState) {
  //     if (prevProps.data != this.state.app) {
  //     }
  // }

  // componentDidMount() {
  //     console.log("componentDidMount-App");
  //     if(!this.props.data){
  //         axios
  //         .get(this.serviceBaseUrl + "data/getAppById?appId="+this.props.match.params.id)
  //         .then(response => {
  //           console.log("response", response);
  //           if (response && response.data) {
  //             //var test = JSON.parse(response.data);
  //             this.setState({
  //               app:JSON.parse(response.data),
  //               showAppForm:false
  //             });
  //           }
  //         })
  //         .catch(function(error) {
  //           console.log("error", error);
  //         });
  //     }

  //   }

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
    app.pages.push(page);

    //Create App
    axios
      .post(this.serviceBaseUrl + "data/createNewPage", page)
      .then(response => {
        console.log("response", response);
        if (response && response.data) {
          this.setState({
            app: response.data
          });
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  render() {
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
        <div>
          <div>
            <label>Page Name</label>
          </div>
          <div>
            <input
              ref={inpPageName => (this.inpPageName = inpPageName)}
              type="text"
              placeholder="Enter Page Name"
              defaultValue=""
            />
            <button onClick={this.addPage}>Save</button>
          </div>
        </div>
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
            >
              +
            </Link>
          </div>
        );
      }
    };

    var appId = this.state.app ? this.state.app.id : "";

    var pagesLi = this.state.app.pages.map(p => {
      return (
        <li>
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

    var pagesView = (
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
          <span className="d-none d-sm-inline-block">
            Pages - {this.state.app.pages.length}
          </span>
        </a>
        <ul aria-labelledby="languages" className="dropdown-menu">
          {pagesLi}
        </ul>
      </React.Fragment>
    );

    return (
      <div>
        {/* <Header app={this.props.data}  /> */}
        <PageListHeader>{pagesView}</PageListHeader>
        {addNewPageView()}
        <Switch>
          <Route
            path="/app/:appid/pages/newpage"
            render={obj => {
              var app = obj.location.state;
              //   console.log("match.params.pageid",match.params.pageid);
              return newPageFormView(app);
            }}
          />
          {/* {pagesRoutesView(this.props.data.pages)}                     */}
          <Route
            path="/app/:appid/pages/:pageid"
            render={({ match }) => {
              //   console.log("match.params.pageid",match.params.pageid);
              return (
                <Page
                  key={match.params.pageid}
                  app={this.state.app}
                  data={{
                    appId: match.params.appid,
                    pageId: match.params.pageid
                  }}
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
