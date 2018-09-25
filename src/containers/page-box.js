import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch,
    NavLink
  } from "react-router-dom";

export default class PageBox extends Component {
    constructor(props){
        super(props);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.page = props.page;
        this.appId = props.appId;

        this.state={
            isEditable:false
        }
    }

    toggleEdit(){
        this.setState({
            isEditable: !this.state.isEditable
        })
    }

    updatePageTitle(){
        
    }

    render(){
        var editView=(
            <React.Fragment>
                <input type="text" ref={txtPageTitle => (this.txtPageTitle = txtPageTitle)}  defaultValue={this.page.title} style={{textTransform: "uppercase"}} />
                <a href="#" className="pl-2"><i class="fa fa-floppy-o" aria-hidden="true" onClick={this.updatePageTitle}></i></a>
                <a href="#" title="Delete" className="float-right" onClick={this.toggleEdit}>
                      <i className="fa fa-ban" />
                </a>
            </React.Fragment>
        );

        var normalView=(
            <React.Fragment>
                <Link
                    key={this.page.id}
                    to={{ pathname: `/app/${this.appId}/pages/${this.page.id}`, state: this.page }}
                    >                  
                        <span>{this.page.title}</span>
                    </Link>   
                    <a href="#" title="Delete" className="float-right ml-3" onClick={this.props.deletePage}>
                        <i className="fa fa-times text-danger" />
                    </a>
                    <a href="#" onClick={this.toggleEdit} className="float-right ml-3" title="Edit">
                        <i className="fa fa-pencil" />
                    </a>
            </React.Fragment>
        )
        return(
            <div className="card">
              <div className="card-header">
                {this.state.isEditable && editView}
                {!this.state.isEditable && normalView}             
                              
              </div>             
            </div>
        )
    }
}