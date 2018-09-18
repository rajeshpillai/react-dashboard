import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Link,
  NavLink,
  Route
} from "react-router-dom";
var _ = require("lodash");

export default class Header extends Component {
  constructor(props) {
    super(props);
    // if(!props.app){
    //     this.state = {
    //         app: {pages:[]}
    //     }
    // } else {
    //     this.state = {
    //         app: props.app
    //     }
    // }
  }

  render() {
    this.app = this.props.app;
    if (!this.app) {
      this.app = {
        pages: []
      };
    }

    var appId = this.app ? this.app.id : "";
    var title = this.app ? this.app.title : "";

    var titleView = <h4 style={{ color: "white" }}>{title}</h4>;

    // var addNewPageView = (
    //     <NavLink key="newpage" to={`/app/${appId}/newpage`} style={{color: "white"}}>Add New Page</NavLink>
    // )

    var pagesView = this.app.pages.map(p => {
      return (
        //    <span key={p.id}> {p.title}                   </span>
        <NavLink
          to={`/app/${appId}/pages/${p.id}`}
          key={p.id}
          activeClassName="page-link"
        >
          <div key={p.title}>{p.title}</div>
        </NavLink>
      );
    });

    //     <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
    //         <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Algorisys</a>
    //         {/* {appId && addNewPageView}                 */}
    //         {titleView}
    //         {pagesView}
    //         <ul className="navbar-nav px-3">
    //             <li className="nav-item text-nowrap">
    //                 <a className="nav-link" href="#">Sign out</a>
    //             </li>
    //         </ul>
    //   </nav>
    //  Sidebar Header

    return (
      <div>
        <nav className="side-navbar">
          <div className="side-navbar-wrapper">
            {/* <!-- Sidebar Header    --> */}
            <div className="sidenav-header d-flex align-items-center justify-content-center">
              {/* <!-- User Info--> */}
              <div className="sidenav-header-inner text-center">
                {/* <!-- <img src="img/" alt="logo" className="img-fluid rounded-circle"> --> */}
                <h2>DATAVIZ</h2>
              </div>
              {/* <!-- Small Brand information, appears on minimized sidebar--> */}
              <div className="sidenav-header-logo">
                <a href="dashboard.html" className="brand-small text-center">
                  {" "}
                  <strong>D</strong>
                  <strong className="text-primary">V</strong>
                </a>
              </div>
            </div>
            {/* <!-- Sidebar Navigation Menus--> */}
            <div className="main-menu">
              <h5 className="sidenav-heading">Main</h5>
              <ul id="side-main-menu" className="side-menu list-unstyled">
                {/* <li>
                  <a href="dashboard.html">
                    {" "}
                    <i className="fa fa-home" />
                    Dashboard{" "}
                  </a>
                </li> */}
                <li>
                  <Link to={{ pathname: `/app` }} activeclassname="page-link">
                    {" "}
                    <i className="fa fa-home" />
                    Apps{" "}
                  </Link>
                  {/* <a href="app-list.html" /> */}
                </li>
                <li>
                  <a href="page-details.html">
                    {" "}
                    <i className="fa fa-home" />
                    Page Details{" "}
                  </a>
                </li>
                <li>
                  <a href="import-data.html">
                    {" "}
                    <i className="fa fa-home" />
                    Import Data{" "}
                  </a>
                </li>
                {/* <li>
                  <a href="#.html">
                    {" "}
                    <i className="fa fa-home" />
                    Home{" "}
                  </a>
                </li>
                <li>
                  <a href="#.html">
                    {" "}
                    <i className="fa fa-home" />
                    Forms{" "}
                  </a>
                </li> */}
                <span id="pageControls">
                  <li>
                    <a href="#.html">
                      {" "}
                      <i className="fa fa-bar-chart" />
                      Charts{" "}
                    </a>
                  </li>
                </span>
              </ul>
            </div>
          </div>
        </nav>

        <header className="header">
          <nav className="navbar">
            <div className="container-fluid">
              <div className="navbar-holder d-flex align-items-center justify-content-between">
                <div className="navbar-header">
                  <a id="toggle-btn" href="#" className="menu-btn">
                    <i className="fa fa-bars" />
                  </a>
                  <a href="dashboard.html" className="navbar-brand">
                    <div className="brand-text d-none d-md-inline-block">
                      <span> </span>
                      <strong className="text-primary">Dashboard</strong>
                    </div>
                  </a>
                </div>
                <ul className="nav-menu list-unstyled d-flex flex-md-row align-items-md-center">
                  {/* <!-- Notifications dropdown--> */}
                  <li className="nav-item dropdown">
                    {" "}
                    <a
                      id="notifications"
                      rel="nofollow"
                      data-target="#"
                      href="#"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      className="nav-link"
                    >
                      <i className="fa fa-bell" />
                      <span className="badge badge-warning">12</span>
                    </a>
                    <ul
                      aria-labelledby="notifications"
                      className="dropdown-menu"
                    />
                  </li>
                  {/* <!-- Messages dropdown--> */}
                  <li className="nav-item dropdown">
                    {" "}
                    <a
                      id="messages"
                      rel="nofollow"
                      data-target="#"
                      href="#"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      className="nav-link"
                    >
                      <i className="fa fa-envelope" />
                      <span className="badge badge-info">10</span>
                    </a>
                    <ul
                      aria-labelledby="notifications"
                      className="dropdown-menu"
                    />
                  </li>
                  {/* <!-- Languages dropdown    --> */}
                  <li className="nav-item dropdown" id="pageList">
                    {/*<a
                      id="languages"
                      rel="nofollow"
                      data-target="#"
                      href="#"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      className="nav-link language dropdown-toggle"
                    >
                      <span className="d-none d-sm-inline-block">Page 1</span>
                    </a>
                    <ul aria-labelledby="languages" className="dropdown-menu">
                       <li>
                        <a rel="nofollow" href="#" className="dropdown-item">
                          {" "}
                          <span>Page 2</span>
                        </a>
                      </li>
                      <li>
                        <a rel="nofollow" href="#" className="dropdown-item">
                          {" "}
                          <span>Page 3 </span>
                        </a>
                      </li> 
                    </ul>*/}
                  </li>
                  {/* <!-- Log out--> */}
                  <li className="nav-item">
                    <a href="login.html" className="nav-link logout">
                      {" "}
                      <span className="d-none d-sm-inline-block">Logout</span>
                      <i className="fa fa-sign-out" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
      </div>
    );
  }
}
