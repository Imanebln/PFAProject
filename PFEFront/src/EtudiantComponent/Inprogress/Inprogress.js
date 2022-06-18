
import React, { Component } from 'react'
import TasksInprogress from './TasksInprogress'
import AddInprogress from './AddInprogress'
export default class Inprogress extends Component {
  componentDidMount() {
    try {
      const json = localStorage.getItem('optionsinprogress');
      const optionsinprogress = JSON.parse(json);

      if (optionsinprogress) {
        this.setState(() => ({ optionsinprogress }));
      }
    } catch (e) {
      // Do nothing at all
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.optionsinprogress.length !== this.state.optionsinprogress.length) {
      const json = JSON.stringify(this.state.optionsinprogress);
      localStorage.setItem('optionsinprogress', json);
    }
  }
//DELETE OPTIONS:
deleteOptionsInprogress(){
    this.setState(()=>({ optionsinprogress: []}));
  
}
  //TAKE THE OPTION TEXT OF THE NEW OPTION ADD:
  AddInprogress(inprogress){
    if(!inprogress){
        return 'Entrer un texte valide';
    }
    else if(this.state.optionsinprogress.indexOf(inprogress) > -1){
        return 'tache existante';
    }
    this.setState((prevState) => {
        return{
            optionsinprogress : prevState.optionsinprogress.concat([inprogress])
        };
    });
}
//DELETE ONE OPTION:
deleteOptionInprogress(inprogressRemove){
    this.setState((prevState) => {
        return{
            optionsinprogress: prevState.optionsinprogress.filter(
                (inprogress)=> {return inprogressRemove !== inprogress}
            )
        };
    });
}

  constructor(props){
    super(props);
    this.state = {
            optionsinprogress : [],
    };
    this.deleteOptionsInprogress = this.deleteOptionsInprogress.bind(this);
    this.AddInprogress = this.AddInprogress.bind(this);
    this.deleteOptionInprogress = this.deleteOptionInprogress.bind(this);
}
  render() {
    return (
        <div>
          <TasksInprogress optionsinprogress = {this.state.optionsinprogress} deleteOptionsInprogress = {this.deleteOptionsInprogress} deleteOptionInprogress = {this.deleteOptionInprogress}/>
           <AddInprogress AddInprogress = {this.AddInprogress}/>
   
  
    </div>
    )
  }
}
