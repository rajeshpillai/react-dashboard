import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Page from "./page.js";
import './app.css';
import Header from "./header";

class App extends Component {

    constructor(props){
        super(props);
        //this.onPageSelect = this.onPageSelect.bind(this);
        this.state = {
            app: props.data,
            currPageName: ""
        }
        console.log('props.data',props.data);
        
        
    }

    // onPageSelect(pageName){
    //     this.setState({
    //         currPageName: pageName
    //     })
    // }

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

    return (
        <div>
             <Header app={this.props.data}  />
            {/* <div className="app-container">{this.state.app.title}</div> */}
            {/* <div className="app-container">
                {pages}
            </div>             */}
            <Route              
              path="/app/:appid/pages/:pageid"
              render={({ match }) => {      
                  console.log("match.params.pageid",match.params.pageid);            
              return (<Page data={{'pageName':'Page' + match.params.pageid, 'appId': match.params.appid, 'pageId':match.params.pageid}}></Page>);
              }}
            />           
        </div>
    );
  }
}

export default App;
