import React, { Component } from 'react';
import './App.css';
import ReactGridLayout from 'react-grid-layout';
import Kpi from './components/kpi';
import Filter from './components/filter';

class App extends Component {
  state={
    uiComponents:['KPI', 'Filter'],
    layout : [
    {i: 'a', x: 0, y: 0, w: 1, h: 1,item:""},
    {i: 'b', x: 1, y: 0, w: 3, h: 3, minW: 2, maxW: 4,item:""},
    {i: 'c', x: 4, y: 0, w: 1, h: 2,item:""}
    ],   
    filters: []
  }

  comps= {
  'KPI': (filters)=> {return ( <Kpi label="KPI Label" filters={filters}  onFilterChange={(filter)=>this.onFilterChange(filter)}></Kpi>)} ,
  'Filter' : (filters)=> {return (<Filter title="Filter"  filters={filters}   onFilterChange={(filter)=>this.onFilterChange(filter)}></Filter> )} 
  }

  onFilterChange = (filter) =>{
    console.log('filter1111',filter)
    var filters=[];
    filters.push({ColName: filter.colName, Values: filter.values});
   

    let layouts = this.state.layout;

    layouts.map((l) =>{
      if(l.itemType){
        l.item  = this.comps[l.itemType](filters);
      }
      return l;
    })

    this.setState({     
      filters : filters ,
      layout : layouts     
    });
  }

  onDrop = (ev,box) => {       
    let c = ev.dataTransfer.getData("text/plain");
    console.log("component dropped: ", c);
    let layout = this.state.layout.map((l) => {
        if(l.i == box.i){
          l.item = this.comps[c](this.state.filters);
          l.itemType = c;
        }
        return l;
    });
    this.setState({           
        ...this.state,           
        layout       
    });    
  }

  onDragOver = (ev) => {
    ev.preventDefault();
  }

  onDragStart = (ev,c) => {
    ev.dataTransfer.setData('text/plain',c);
  }

  render() {
    // layout is an array of objects, see the demo for more complete usage
    var layout = this.state.layout;
    var li = this.state.uiComponents.map((c)=>{
      return <li key={c} draggable onDragStart={(e)=>this.onDragStart(e, c)}>{c}</li>
    })
    var box = layout.map((l)=>{
      return (
        <div key={l.i} 
          onDragOver={(e)=>this.onDragOver(e)}  
          onDrop={(e)=>this.onDrop(e, l)}>
            {/* <a href="#">Edit</a> */}
             {l.item}
            
       </div>
      );
    })

    return (
      <div>
        <div>
          <ul>
            {li}
          </ul>
        </div>
        <ReactGridLayout  draggableCancel="input,textarea" 
            className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
            {box}
        </ReactGridLayout>
      </div>
    )
  }
}

export default App;
