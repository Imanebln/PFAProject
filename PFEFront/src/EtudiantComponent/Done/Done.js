
import React, { Component } from 'react'
import TasksDone from './TasksDone'
import AddDone from './AddDone'
export default class Done extends Component {
  componentDidMount() {
    try {
      const json = localStorage.getItem('optionsdone');
      const optionsdone = JSON.parse(json);

      if (optionsdone) {
        this.setState(() => ({ optionsdone }));
      }
    } catch (e) {
      // Do nothing at all
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.optionsdone.length !== this.state.optionsdone.length) {
      const json = JSON.stringify(this.state.optionsdone);
      localStorage.setItem('optionsdone', json);
    }
  }
//DELETE OPTIONS:
deleteOptionsDone(){
    this.setState(()=>({ optionsdone: []}));
  
}
  //TAKE THE OPTION TEXT OF THE NEW OPTION ADD:
  AddDone(done){
    if(!done){
        return 'Entrer un texte valide';
    }
    else if(this.state.optionsdone.indexOf(done) > -1){
        return 'tache existante';
    }
    this.setState((prevState) => {
        return{
            optionsdone : prevState.optionsdone.concat([done])
        };
    });
}
//DELETE ONE OPTION:
deleteOptionDone(doneRemove){
    this.setState((prevState) => {
        return{
            optionsdone : prevState.optionsdone.filter(
                (done)=> {return doneRemove !== done}
            )
        };
    });
}

  constructor(props){
    super(props);
    this.state = {
            optionsdone : [],
    };
    this.deleteOptionsDone = this.deleteOptionsDone.bind(this);
    this.AddDone = this.AddDone.bind(this);
    this.deleteOptionDone = this.deleteOptionDone.bind(this);
}
  render() {
    return (
        <div>
          <TasksDone optionsdone = {this.state.optionsdone} deleteOptionsDone = {this.deleteOptionsDone} deleteOptionDone = {this.deleteOptionDone}/>
           <AddDone AddDone = {this.AddDone}/>
   
    </div>
    )
  }
}
