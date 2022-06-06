
import React, { useState, useEffect } from "react";
import axios from "axios";

import 'react-dropdown/style.css';
import { IndeterminateCheckBox } from "@material-ui/icons";


const Dropdown = () => {
    const [isOpen, setOpen] = useState(false);
    //const [items, setItem] = useState(data);
    const [selectedItem, setSelectedItem] = useState(null);
    const [dropdownVisibility,setDropdownVisibility] = useState(false);
    // const toggleDropdown = () => {setDropdownVisibility(true)};
    const toggleDropdown = () => setOpen(!isOpen);
    
    const handleItemClick = (id) => {
      selectedItem == id ? setSelectedItem(null) : setSelectedItem(id);
    }
    const [fullname,setFullname] = useState("");

    const [encadrants,setEncadrants]= useState([]);
  useEffect(() => {
    axios.get('https://localhost:7004/api/Encadrants').then(res => {
      console.log(res);
      setEncadrants(res.data);
    })
  }, [])

  
    return(
        <div className='dropdown'>

              <div className='dropdown-header' onClick={toggleDropdown}>
              {selectedItem ? encadrants.find(item => item.nom == selectedItem).nom : "Selectionner un encadrant"}
              <i className={`fa fa-chevron-right icon ${isOpen && "open"}`}></i>
            </div>
            
            <div className={`dropdown-body ${isOpen && 'open'}`}>
            {encadrants.map(item => (
              <div className="dropdown-item" onClick={e => {handleItemClick(e.target.id); setFullname(item.nom+" "+item.prenom);}} id={item.nom} >
                <span className={`dropdown-item-dot ${fullname == selectedItem && 'selected'}`}>• </span>
                {console.log(selectedItem)}
                <a>{item.nom + " " + item.prenom}</a>
              </div>
            ))}
             </div>
            
           
        </div>
    )
  }

  export default Dropdown;