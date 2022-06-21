import React, { useState, useEffect} from "react"
import axios from "axios"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import TimePicker from 'react-time-picker'
import { post } from "axios"
import { format } from 'date-fns'
import './CrudStyling.css'
import swal from 'sweetalert'
function EtudiantDetails() {
	
    
    const [jury1,setJury1] = useState({});
    const [isOpen, setOpen] = useState(false);
    const [isOpen2, setOpen2] = useState(false);

    function toggleDropdown1(){
        setOpen(!isOpen)
      };
    function toggleDropdown2(){
        setOpen2(!isOpen2)
      };
    const [selectedItem, setSelectedItem] = useState(null);
    const [encadrants,setEncadrants]= useState([]);
  useEffect(() => {
    axios.get('https://localhost:7004/api/Encadrants').then(res => {
      setEncadrants(res.data);
    })
  }, []
  )
  const [fullname2,setFullname2] = useState("");
  const handleItemClick2 = (id,item) => {
    selectedItem2 == id ? setSelectedItem2(null) : setSelectedItem2(id);
  }

  const [jury2,setJury2] = useState({});
 
  const [selectedItem2, setSelectedItem2] = useState(null);
useEffect(() => {
  axios.get('https://localhost:7004/api/Encadrants').then(res => {
    setEncadrants(res.data);
  })
}, []
)
const [fullname,setFullname] = useState("");
const handleItemClick = (id,item) => {
  selectedItem == id ? setSelectedItem(null) : setSelectedItem(id);
}

     const Etud = localStorage.getItem('etu');
     const Etudjson = JSON.parse(Etud);

     const pfe = localStorage.getItem('pfe');
     const pfejson = JSON.parse(pfe);

    const [dateStc, setDateStc] = useState(new Date());
    const [heureDebut, setHeureDebut] = useState("14:00");
    const [heureFin, setHeureFin] = useState("16:00");

    function confirmerSoutenance(){
         function postStc(){
            try {
                 post(`https://localhost:7004/api/Authenticate/GererSoutenance?idPfe=${pfejson.id}&idEncad1=${jury1.id}&idEncad2=${jury2.id}&dateStc=${format(dateStc,'dd/MM/yyyy')}&heureDebut=${heureDebut}&heureFin=${heureFin}`).then(res => 
                {console.log(res.data);
                res.data.status == "error" ? 
                swal({
                    text: res.data.message,
                    icon: "error",
                    timer:2000,
                    buttons:false
                  }) 
              : swal({
                    text: res.data.message,
                    icon: "success",
                    timer:2000,
                    buttons:false
                  })}
                );
            } 
            catch (error) {
              swal({
                text:'Soutenance non ajoutée',
                icon: "error",
                timer:2000,
                buttons:false
              })
            }
      }
    postStc();
    
    }
  
    
    
      
  

	return (
		<div className="etudiantDetails" >
            <h2>Etudiant Details</h2>
          
			<hr></hr>
            <div>
            <p>
            <form>
            <div className="row">
                <div className="col">
                <div  className="">
                    <label>Nom</label>
                    
                    <input name="nom"
						        type="text"
						        value={Etudjson.nom}
					        	className="form-control" />
                </div>
                </div>

                <div className="col">
                <div  className="form-group">
                <label>Prénom</label>
                <input name="prenom"
                    type="text"
                    value={Etudjson.prenom}
                    className="form-control" />
                </div>
                </div>
                </div>

                <div className="row">
                <div className="col">
                <div  className="form-group">
                <label>Email</label>
                <input name="email"
                    type="text"
                    value={Etudjson.email}
                    className="form-control" />
                </div>
                </div>
                <div className="col">
                <div  className="form-group">
                <label>Sujet</label>
                <input name="sujet"
                    type="text"
                    value={pfejson.sujet}
                    className="form-control" />
                </div>
                </div>
                </div>
                
                <div className="row">
                <div className="col">
                <div  className="form-group">
                <label>Technologies Utilisées</label>
                <input name="technologiesUtilisees"
                    type="text"
                    value={pfejson.technologiesUtilisees}
                    className="form-control" />
                </div>
                </div>

                <div className="col">
                <div  className="form-group">
                <label>Société</label>
                <input name="nomSociete"
                    type="text"
                    value={pfejson.nomSociete}
                    className="form-control" />
                </div>
                </div>
                </div>


                <div className="row">
                <div className="col">
                <div  className="form-group">
                <label>Ville</label>
                <input name="ville"
                    type="text"
                    value={pfejson.ville}
                    className="form-control" />
                </div>
                </div>
                
                <div className="col">
                <div  className="form-group">
                <label>Année</label>
                <input name="annee"
                    type="text"
                    value={pfejson.annee}
                    className="form-control" />
                </div>
                </div>
                </div>
                <div className="row">
                <div className="col">
                <div  className="form-group">
                    <label>Email Encadrant de la société</label>
                    <input name="emailEncadrant"
                    type="text"
                    value={pfejson.emailEncadrant}
                    className="form-control" />
                </div>
                </div>
                <div className="col">
                <div  className="form-group">
                <label>Encadrant Académique</label>
                <input name="EncAca"
                    type="text"
                    value={pfejson.encadrant != null ? pfejson.encadrant.nom +" "+ pfejson.encadrant.prenom : "" }
                    className="form-control"/>
                </div>
                </div>
                </div>

                <br></br>
                
                <div className="row">
                    <div className="col">
                    <div className='dropdown'>

                    <div className='dropdown-header' onClick={()=>toggleDropdown1()}>
                    {selectedItem ? encadrants.find(item => item.nom == selectedItem).prenom +" " +  encadrants.find(item => item.nom == selectedItem).nom : "Séléctionner le 1er jury "}
                    <i className={`fa fa-chevron-right icon ${isOpen && "open"}`}></i>
                    </div>

                    <div className={`dropdown-body ${isOpen && 'open'}`}>
                    {encadrants.map(item => (
                    <div className="dropdown-item" onClick={e => {handleItemClick(e.target.id,item); setJury1(item); setFullname(item.nom+" "+item.prenom);toggleDropdown1();}} id={item.nom} item={item}>
                    <span className={`dropdown-item-dot ${fullname == selectedItem && 'selected'}`}>• </span>
                    <a>{item.nom + " " + item.prenom}</a>
                    </div>
                    ))}
                    </div> 
                    </div>

                    </div>
                    
                    <div className="col">
                  
                    <div className='dropdown'>
                        <div className='dropdown-header' onClick={()=>toggleDropdown2()}>
                        {selectedItem2 ?encadrants.find(item => item.nom == selectedItem2).prenom +" " +  encadrants.find(item => item.nom == selectedItem2).nom : "Séléctionner le 2ème jury "}
                        <i className={`fa fa-chevron-right icon ${isOpen2 && "open"}`}></i>
                        </div>
                        
                        <div className={`dropdown-body ${isOpen2 && 'open'}`}>
                        {encadrants.map(item => (
                        <div className="dropdown-item" onClick={e => {handleItemClick2(e.target.id,item); setJury2(item); setFullname2(item.nom+" "+item.prenom);toggleDropdown2();}} id={item.nom} item={item}>
                            <span className={`dropdown-item-dot ${fullname2 == selectedItem2 && 'selected'}`}>• </span>
                            <a>{item.nom + " " + item.prenom}</a>
                        </div>
                        ))}
                        </div>
                    </div>
                    </div>
                </div>
                    <br></br>
                    <div className="row">
                        <div className="col">
                        <div className="form-group">
                        <label>Date de Soutenance</label>
                        <DatePicker  dateFormat="dd/MM/yyyy" selected={dateStc} onChange={(date) => {setDateStc(date)}}/>
                        </div>

                        </div>
                        <div className="col">
                        <div className="form-group">
                         <label>Heure du début:</label>
                         <br></br>
                         <TimePicker  format={"HH:mm"}  onChange={(heuredebut) => setHeureDebut(heuredebut)} value={heureDebut}/>
                         </div> 
                            
                        </div>
                        <div className="col">
                        <div className="form-group">
                        <label>Heure de fin:</label>
                        <br></br>
                        <TimePicker format={"HH:mm"} onChange={(heurefin) => {setHeureFin(heurefin);console.log("heure fin : " + heurefin)}} value={heureFin} />
                        </div>
                       
                        </div>
                        
                        <div className="col">
                        <div>
                        <br></br>
                        <button className="btn btn-success" type="submit" onClick={(e)=> { e.preventDefault();confirmerSoutenance()}}>Confirmer</button>
                        </div>
                        </div>
                    </div>
            </form>
          </p>
      </div>
		</div>
	);
}

export default EtudiantDetails;