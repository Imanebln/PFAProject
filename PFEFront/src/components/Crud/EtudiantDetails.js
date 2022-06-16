import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import {Row, Col, Container} from 'reactstrap';
import DropDownJury1 from "./DropDownJury1";
import DropDownJury2 from "./DropDownJury2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import { post } from "axios";
import { format } from 'date-fns';
import Moment from 'moment';
import {FaCheck} from "react-icons/fa";
import './CrudStyling.css'
import swal from 'sweetalert'
import e from "cors";
function EtudiantDetails(props) {
	
    
    // useEffect(() => {
    //     if(window.location.hash !== "#2") {
    //         window.location.href += "#2";
    //         window.location.reload(false);
    //     }
    // })

     const Etud = localStorage.getItem('etu');
     const Etudjson = JSON.parse(Etud);

     const pfe = localStorage.getItem('pfe');
     const pfejson = JSON.parse(pfe);
     console.log(Etudjson.nom);

     const jury1 = localStorage.getItem('jury1');
    const jury1JSON = JSON.parse(jury1);

    const jury2 = localStorage.getItem('jury2');
    const jury2JSON = JSON.parse(jury2);
    
    function modifierEtudiant(e){
        
    }

    
    console.log({Etud});

    const [dateStc, setDateStc] = useState(new Date());
    const [heureDebut, setHeureDebut] = useState("14:00");
    const [heureFin, setHeureFin] = useState("16:00");

    const EncadAca = localStorage.getItem('encAca');
    const EncadAcajson = JSON.parse(EncadAca);
    console.log({EncadAca});

    // const Encad = localStorage.getItem('encad');
    // const Encadjson = JSON.parse(Encad);
const [affecterSoute, setAffecterSoute] = useState("");
    function confirmerSoutenance(){
        async function postStc(){
            try {
                await post(`https://localhost:7004/api/Authenticate/GererSoutenance?idPfe=${pfejson.id}&idEncad1=${jury1JSON.id}&idEncad2=${jury2JSON.id}&dateStc=${format(dateStc,'dd/MM/yyyy')}&heureDebut=${heureDebut}&heureFin=${heureFin}`).then(res =>
                //etAffecterSoute(res.data) 
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
    
    console.log({Etud});
	return (
		<div className="etudiantDetails" >
            <h2>Etudiant Details</h2>
          
			<hr></hr>
            <div>
            <p>
            <form>
            <Container>
               <Row>
                   <Col>
                   {/* <Button className="butt" color="primary" >Modifier Etudiant</Button> */}

                   </Col>
               </Row>
           </Container>
            {/* {Etud.map(e => <li>e</li> )} */}
            {/* {Object.keys(Etud).map(e => <li>{e}</li> )} */}
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
                <label>Prenom</label>
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
                <label>Les technologies utilisees</label>
                <input name="technologiesUtilisees"
                    type="text"
                    value={pfejson.technologiesUtilisees}
                    className="form-control" />
                </div>
                </div>

                <div className="col">
                <div  className="form-group">
                <label>Societe</label>
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
                <label>Annee</label>
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
                    <label>Email Encadrant</label>
                    <input name="emailEncadrant"
                    type="text"
                    value={pfejson.emailEncadrant}
                    className="form-control" />
                </div>
                </div>
                <div className="col">
                <div  className="form-group">
                <label>Encadrant Academique </label>
                <input name="EncAca"
                    type="text"
                    value={pfejson.encadrant != null ? pfejson.encadrant.nom +" "+ pfejson.encadrant.prenom : "" }
                    className="form-control" disabled/>
                </div>
                </div>
                </div>

                <br></br>
                
                <div className="row">
                    <div className="col">
                    <div>
                    <DropDownJury1>
                    </DropDownJury1>
                    </div>

                    </div>
                    <div className="col">
                    <div>
                    <DropDownJury2>
                    </DropDownJury2>
                    </div> 
                    </div>
                </div>
                    <br></br>
                    <div className="row">
                        <div className="col">
                        <div className="form-group">
                        <label>Date de Soutenance</label>
                        <DatePicker  dateFormat="dd-MM-yyyy" selected={dateStc} onChange={(date) => {setDateStc(date)}}/>
                        </div>

                        </div>
                        <div className="col">
                        <div className="form-group">
                         <label>Heure du debut:</label>
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
                        <button className="btn btn-success"  onClick={(e)=>{e.preventDefault();confirmerSoutenance(); }}><FaCheck/></button>
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