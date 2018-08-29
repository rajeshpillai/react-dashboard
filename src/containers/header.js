import React, { Component } from "react";
import { BrowserRouter as Router, Link,NavLink , Route } from "react-router-dom";
var _ = require('lodash');

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

    render(){  
        this.app  = this.props.app;
        if(!this.app){
            this.app={
                pages:[]
            }
        }

        var appId =(this.app)?this.app.id:"";
        var title =(this.app)?this.app.title:"";
        
        var titleView = (            
            <h4 style={{color: "white"}}>{title}</h4>
        )

        // var addNewPageView = (
        //     <NavLink key="newpage" to={`/app/${appId}/newpage`} style={{color: "white"}}>Add New Page</NavLink>
        // )
        
        

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
                {/* {appId && addNewPageView}                 */}
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