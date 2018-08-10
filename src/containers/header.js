import React, { Component } from "react";
import { BrowserRouter as Router, Link,NavLink , Route } from "react-router-dom";
var _ = require('lodash');

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.app  = props.app;
        if(!this.app){
            this.app={
                pages:[]
            }
        }
     }

    render(){    
        var appId =(this.app)?this.app.id:"";
        var title =(this.app)?this.app.title:"";
        
        var titleView = (            
            <h4 style={{color: "white"}}>{title}</h4>
        )

        var pagesView = this.app.pages.map(p => {                    
            return (     
            //    <span key={p.id}> {p.title}                   </span>
              <NavLink  to={`/app/${appId}/pages/${p.id}`} key={p.id} activeClassName="page-link">
                <div key={p.title}>
                  {p.title}
                </div>          
              </NavLink >
            );
          });

        return(
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Algorisys</a>  
                {titleView}
                {pagesView}
                <ul className="navbar-nav px-3">                    
                    <li className="nav-item text-nowrap">
                        <a className="nav-link" href="#">Sign out</a>
                    </li>
                </ul>
          </nav>);
    }
}