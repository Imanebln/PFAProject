import { Table, Button, Row } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams  } from "react-router-dom";

function ModalEtudiant(props) {

    const [etudiant,setEtudiant]= useState({});
    
    useEffect(()=>{
        setEtudiant(props.etudiant)
    })
   
console.log(props.etudiant.id);
    return (
      
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Details
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
        
            {etudiant.id}
            <Button className="butt" color="primary" onClick="">Modifier</Button>

          <div>
            <form>
                <div  className="form-group">
                    <label>Nom</label>
                    <input name="nom"
						        type="text"
						        value={etudiant.etudiant.nom}
					        	className="form-control" disabled/>
                </div>

                <div  className="form-group">
                <label>Prenom</label>
                <input name="prenom"
                    type="text"
                    value={etudiant.etudiant.prenom}
                    className="form-control" disabled/>
                </div>

                <div  className="form-group">
                <label>Email</label>
                <input name="email"
                    type="text"
                    value={etudiant.etudiant.email}
                    className="form-control" disabled/>
                </div>

                <div  className="form-group">
                <label>Sujet</label>
                <input name="sujet"
                    type="text"
                    value={etudiant.sujet}
                    className="form-control" disabled/>
                </div>

                <div  className="form-group">
                <label>Les technologies utilisees</label>
                <input name="technologiesUtilisees"
                    type="text"
                    value={etudiant.technologiesUtilisees}
                    className="form-control" disabled/>
                </div>

                <div  className="form-group">
                <label>Societe</label>
                <input name="nomSociete"
                    type="text"
                    value={etudiant.nomSociete}
                    className="form-control" disabled/>
                </div>

                <div  className="form-group">
                <label>Ville</label>
                <input name="ville"
                    type="text"
                    value={etudiant.ville}
                    className="form-control" disabled/>
                </div>

                <div  className="form-group">
                <label>Email Encadrant</label>
                <input name="emailEncadrant"
                    type="text"
                    value={etudiant.emailEncadrant}
                    className="form-control" disabled/>
                </div>
                
                <div  className="form-group">
                <label>Annee</label>
                <input name="annee"
                    type="text"
                    value={etudiant.annee}
                    className="form-control" disabled/>
                </div>
            </form>
          
          </div>
          
        </Modal.Body>
        
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
export default ModalEtudiant;
