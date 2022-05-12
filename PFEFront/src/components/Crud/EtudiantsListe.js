import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams  } from "react-router-dom";
import { Link } from "react-router-dom";
import { Table, Button, Row } from 'reactstrap';
import AjouterEtudiant from "./AjouterEtudiant";
import { NavigateBefore } from "@material-ui/icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaTrash, FaEdit, FaEye, FaPlus } from "react-icons/fa";
import ModalEtudiant from "../Modals/ModalEtudiant";

import {toast} from 'react-toastify';
import { Container,Col } from 'reactstrap';
import { CSVLink } from "react-csv";

function EtudiantsListe(props) {

  function getToken() {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  }

    const [etudiants,setEtudiants]= useState([]);
  useEffect(() => {
    axios.get(`https://localhost:7004/api/Etudiants/GetByYear?annee=${annee}`,{headers: {"Authorization" : `Bearer ${getToken()}`}}).then(res => {
      console.log(res);
      setEtudiants(res.data);
    })
  }, [])
//***************************************************************************************************************** */
  const[annee, setAnnee] = useState((new Date()).getFullYear());
  async function getEtudiantsList(){
    try {
      axios.get(`https://localhost:7004/api/Etudiants/GetByYear?annee=${annee}`,{headers: {"Authorization" : `Bearer ${getToken()}`}}).then(res => {
      console.log(res);
      setEtudiants(res.data);
    })} 
    catch (ex) {
      console.log(ex);
    }
  }

  async function handleChangeInput(e){
    setAnnee(parseInt(e.target.value));
    // getEtudiantsList(annee);
  } 

  const [fileSelected, setFileSelected] = useState();

  const saveFileSelected= (e) => {
    console.log(e.target.files[0]);
    setFileSelected(e.target.files[0]);
  };

  const importFile= async (e) => {
    const formData = new FormData();
    formData.append("file", fileSelected);
    try {

      if(annee == null || annee === undefined || annee === NaN) alert("Veuillez saisir l'annee");

      else{
        const res = await axios.post(`https://localhost:7004/api/Authenticate/UploadExcelFile?year=${annee}`, formData);
        setEtudiants(res.data);
        // getEtudiantsList(annee);
        console.log(res);
      }
      
    } catch (ex) {
      console.log(ex);
    }
  };

//************************************************************************************************************** */
  const { _id } = useParams();
  const navigate = useNavigate();

  useEffect(
		function () {
			async function deleteCrudById() {
				try {
					const response = await axios.get(`https://localhost:7004/api/Authenticate/SuppEtudiant?id=${etudiants.id}`,{headers: {"Authorization" : `Bearer ${getToken()}`}});
					setEtudiants(response.data);
				} catch (error) {
					console.log("error", error);
				}
			}
			deleteCrudById();
		},
		[props]
	);

	async function handleDelete(e) {
		try {

      console.log(e)
			await axios.delete(`https://localhost:7004/api/Authenticate/SuppEtudiant?id=${e.id}`,{headers: {"Authorization" : `Bearer ${getToken()}`}});
      setEtudiants(etudiants.filter((ele)=> ele.id !== e.id))
      toast.warning('Etudiant supprime!')
		} catch (error) {
			console.error(error);
		}
	}

  async function handleView(e) {
		try {

      console.log(e)
			await axios.delete(`https://localhost:7004/api/Etudiants?id=${e.id}`,{headers: {"Authorization" : `Bearer ${getToken()}`}});
      setEtudiants(etudiants.filter((ele)=> ele.id !== e.id))
		} catch (error) {
			console.error(error);
		}
	}

  function AjouterEtudiant(){
    navigate("/AjouterEtudiant");
  }

  //modal view
  const [modalShow, setModalShow] = React.useState(false);
  // const [modalShow2, setModalShow2] = React.useState(false);
  

	return (
    
		<div className="div-margin">
			<h4>Etudiants</h4>
      <Container>
                <Row>
                    <Col>
                    
                    <input style={{width : '20%' }} name="annee" type="number" defaultValue={(new Date()).getFullYear()} placeholder="Annee" required 
                    onChange={handleChangeInput} className="form-control"/>
                    <Button style={{display : 'none'}} className="butt" color="primary" onClick={getEtudiantsList()}>Chercher</Button>
                  <div className="btn-group">
                    <input type="file" color="primary" onChange={saveFileSelected}/>
                    <input type="button" color="primary" value="Importer" onClick={importFile} className="btn btn-primary"/>
                  </div>
                    <Button className="butt" color="primary" onClick={AjouterEtudiant}>Ajouter Etudiant</Button>
                    
                    {/* <a href="/AjouterEncadrant">Ajouter Encadrant</a> */}
                    
                    </Col>
                </Row>
            </Container>
        <Table responsive hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Filiere</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {etudiants.map(etudiant => (
          <tr>
            <td key={etudiant.id}>
            {etudiant.nom} {etudiant.prenom}
            </td>
            <td>
            {etudiant.email}
            </td>
            <td>
            {etudiant.filiere}
            </td>
            <td>
            <Button color="primary" variant="primary" onClick={() => setModalShow(true)}>
            <FaEye/>
            </Button>
            <ModalEtudiant
            etudiant= {etudiant}
           show={modalShow}
           onHide={() => setModalShow(false)}/>
            </td>
            <td>
            <Button className="btn btn-primary" onClick={etudiant.id} ><FaEdit/></Button>
            </td>
            <td>
            <Button className="btn btn-danger" onClick={()=>handleDelete(etudiant)}><FaTrash/></Button>
            </td>
            <td>
            {/* <Button className="butt" color="primary" ><FaPlus/></Button> */}
            <Button color="primary" variant="primary" >
            <FaPlus/>
            </Button>
            
            </td>
          </tr>
          ) )}
        </tbody>
      </Table>
			
		</div>
	);
}

export default EtudiantsListe;
