import React, { useState, useEffect } from "react";
import axios from "axios";

import 'react-dropdown/style.css';


const Dropdown = () => {
  
    const [isOpen, setOpen] = useState(false);
   
    const [selectedItem, setSelectedItem] = useState(null);
    function toggleDropdown() {
      setOpen(!isOpen)
    };

   useLocalStorage("isop",isOpen);
    const handleItemClick = (id,item) => {
      selectedItem == id ? setSelectedItem(null) : setSelectedItem(id);
      setSendEncad(item);
    }
    const [fullname,setFullname] = useState("");
    const [sendEncad,setSendEncad] = useState([]);

    const [encadrants,setEncadrants]= useState([]);
  useEffect(() => {
    axios.get('https://localhost:7004/api/Encadrants').then(res => {
      setEncadrants(res.data);
    })
  }, [])

  function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
      if (typeof window === "undefined") {
        return initialValue;
      }
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.log(error);
        return initialValue;
      }
    });

    const setValue = (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.log(error);
      }
    };
    return [storedValue, setValue];
  }

  const [encad,setEncad] = useLocalStorage("encad",{})

  
    return(
        <div className='dropdown'>
              <div className='dropdown-header' onClick={() => toggleDropdown()}>
              {selectedItem ? encadrants.find(item => item.nom == selectedItem).prenom +" " +  encadrants.find(item => item.nom == selectedItem).nom : "Selectionner un encadrant"}
              <i className={`fa fa-chevron-right icon ${isOpen && "open"}`}></i>
            </div>
            
            <div className={`dropdown-body ${isOpen && 'open'}`}>
            {encadrants.map(item => (
              <div className="dropdown-item" onClick={e => {handleItemClick(e.target.id,item); setEncad(item); setFullname(item.nom+" "+item.prenom);toggleDropdown()}} id={item.nom} item={item}>
                <span className={`dropdown-item-dot ${fullname == selectedItem && 'selected'} `}>•</span>
                <a>{item.nom + " " + item.prenom}</a>
              </div>
            ))}
             </div>
        </div>
    )
  }

  export default Dropdown;