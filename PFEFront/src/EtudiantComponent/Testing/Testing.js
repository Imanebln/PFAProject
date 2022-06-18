/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import TasksTesting from './TasksTesting'
import AddTesting from './AddTesting'
export default class Testing extends Component {
  componentDidMount() {
    try {
      const json = localStorage.getItem('optionstesting');
      const optionstesting = JSON.parse(json);

      if (optionstesting) {
        this.setState(() => ({ optionstesting }));
      }
    } catch (e) {
      // Do nothing at all
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.optionstesting.length !== this.state.optionstesting.length) {
      const json = JSON.stringify(this.state.optionstesting);
      localStorage.setItem('optionstesting', json);
    }
  }
//DELETE OPTIONS:
deleteOptionsTesting(){
    this.setState(()=>({ optionstesting: []}));
  
}
  //TAKE THE OPTION TEXT OF THE NEW OPTION ADD:
  AddTesting(testing){
    if(!testing){
        return 'Entrer un texte valide';
    }
    else if(this.state.optionstesting.indexOf(testing) > -1){
        return 'tache existante';
    }
    this.setState((prevState) => {
        return{
            optionstesting : prevState.optionstesting.concat([testing])
        };
    });
}
//DELETE ONE OPTION:
deleteOptionTesting(testingRemove){
    this.setState((prevState) => {
        return{
            optionstesting: prevState.optionstesting.filter(
                (testing)=> {return testingRemove !== testing}
            )
        };
    });
}

  constructor(props){
    super(props);
    this.state = {
            optionstesting : [],
    };
    this.deleteOptionsTesting = this.deleteOptionsTesting.bind(this);
    this.AddTesting = this.AddTesting.bind(this);
    this.deleteOptionTesting = this.deleteOptionTesting.bind(this);
}
  render() {
    return (
        <div>
          <TasksTesting optionstesting = {this.state.optionstesting} deleteOptionsTesting = {this.deleteOptionsTesting} deleteOptionTesting = {this.deleteOptionTesting}/>
           <AddTesting AddTesting = {this.AddTesting}/>
    </div>
    )
  }
}
