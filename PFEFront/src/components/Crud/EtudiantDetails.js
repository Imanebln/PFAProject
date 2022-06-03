import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import {Row, Col, Container,Button} from 'reactstrap';
function EtudiantDetails(props) {
	
    
    
    //  const [Etud,setEtudiant]= useState({});

     const Etud = localStorage.getItem('etu');
     const Etudjson = JSON.parse(Etud);

     const pfe = localStorage.getItem('pfe');
     const pfejson = JSON.parse(pfe);
     console.log(Etudjson.nom);
    
    function modifierEtudiant(e){
        
    }

    
    console.log({Etud});
	return (
		<div className="container">
            <h2>Etudiant Details</h2>
          
			
            <div className="container">
            <p>
            <form>
            <Container>
               <Row>
                   <Col>
                   <Button className="butt" color="primary" >Modifier Etudiant</Button>

                   </Col>
               </Row>
           </Container>
            {/* {Etud.map(e => <li>e</li> )} */}
            {/* {Object.keys(Etud).map(e => <li>{e}</li> )} */}
                <div  className="form-group">
                    <label>Nom</label>
                    <input name="nom"
						        type="text"
						        value={Etudjson.nom}
					        	className="form-control" />
                </div>

                <div  className="form-group">
                <label>Prenom</label>
                <input name="prenom"
                    type="text"
                    value={Etudjson.prenom}
                    className="form-control" />
                </div>

                <div  className="form-group">
                <label>Email</label>
                <input name="email"
                    type="text"
                    value={Etudjson.email}
                    className="form-control" />
                </div>
                <div  className="form-group">
                <label>Sujet</label>
                <input name="sujet"
                    type="text"
                    value={pfejson.sujet}
                    className="form-control" />
                </div>

                <div  className="form-group">
                <label>Les technologies utilisees</label>
                <input name="technologiesUtilisees"
                    type="text"
                    value={pfejson.technologiesUtilisees}
                    className="form-control" />
                </div>

                <div  className="form-group">
                <label>Societe</label>
                <input name="nomSociete"
                    type="text"
                    value={pfejson.nomSociete}
                    className="form-control" />
                </div>

                <div  className="form-group">
                <label>Ville</label>
                <input name="ville"
                    type="text"
                    value={pfejson.ville}
                    className="form-control" />
                </div>

                <div  className="form-group">
                <label>Email Encadrant</label>
                <input name="emailEncadrant"
                    type="text"
                    value={pfejson.emailEncadrant}
                    className="form-control" />
                </div>
                
                <div  className="form-group">
                <label>Annee</label>
                <input name="annee"
                    type="text"
                    value={pfejson.annee}
                    className="form-control" />
                </div>
               
            </form>
          
          </p>
            </div>

			
		</div>
	);
}

export default EtudiantDetails;