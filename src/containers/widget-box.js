import React, { Component } from "react";
var _ = require('lodash');

export default class WidgetBox extends Component {

    constructor(props){
        super(props);
        this.comps = props.comps;
    }

    render(){
        var l = this.props.l;
        console.log("l",l);
        //debugger;
        console.log("containerWidth", this.props.containerWidth);
        console.log("containerHeight", this.props.containerHeight);
        return(
        <div  className={this.props.className} style={this.props.style} 
          key={l.item.layoutId}
          onDragOver={e => this.props.onDragOver(e)}
          onDrop={e => this.props.onDrop(e, l)} 
          test="asasas">                
          {l.itemType && _.clone(this.comps[l.itemType](l.item))}
          {this.props.children}
        </div>);
    }
}