import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams  } from "react-router-dom";
import { Link } from "react-router-dom";
import { Table, Button, Row } from 'reactstrap';
import AjouterEtudiant from "./AjouterEtudiant";
import { NavigateBefore } from "@material-ui/icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaTrash, FaEdit, FaEye, FaPlus } from "react-icons/fa";

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
      // console.log(res);
      setEtudiants(res.data);
    })
  }, [])
//***************************************************************************************************************** */
  const[annee, setAnnee] = useState((new Date()).getFullYear());
  async function getEtudiantsList(){
    try {
      axios.get(`https://localhost:7004/api/Etudiants/GetByYear?annee=${annee}`,{headers: {"Authorization" : `Bearer ${getToken()}`}}).then(res => {
      // console.log(res);
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
        // console.log(res);

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

  const [etud,setEtud] = useLocalStorage("etu",{})
  const [pfe,setPfe] = useLocalStorage("pfe",{})
  
  const [encadrants,setEncadrants]= useState([]);
  useEffect(() => {
    axios.get('https://localhost:7004/api/Encadrants',{headers: {"Authorization" : `Bearer ${getToken()}`}}).then(res => {
      console.log(res);
      setEncadrants(res.data);
    })
  }, [])

  function affecterEncadrant(etudiant){
    const newDiv = document.createElement('div');
    newDiv.setAttribute('id','newDiv');
    const newUl = document.createElement('ul');
    newUl.setAttribute('id','newUl');

  encadrants.map(encadrant => { 
    const para = document.createElement("li"); 
    para.innerText = encadrant.nom +" "+encadrant.prenom; console.log(encadrant.nom);
    const func = ()=>{
      console.log("sssss" + " " + encadrant.id);
      axios.post(`https://localhost:7004/api/Authenticate/AffecterEncadrant?id=${etudiant.id}&idEncadrant=${encadrant.id}`)
    }
    para.onclick = func();
    newUl.appendChild(para);}
    );
    newDiv.appendChild(newUl);
    
    document.body.appendChild(newDiv);
    let close = document.createElement("span");
            close.className = 'close';
            let closeText = document.createTextNode("X");
            close.appendChild(closeText);
            newDiv.appendChild(close);

    document.addEventListener("click",function(e){
      if(e.target.className == 'close'){
          e.target.parentNode.remove();
              }
          });
  }

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
            {etudiant.etudiant.nom} {etudiant.etudiant.prenom}
            </td>
            <td>
            {etudiant.etudiant.email}
            </td>
            <td>
            {etudiant.etudiant.filiere}
            </td>
            <td>
            <Link to={{pathname: "/EtudiantDetails"}}>
        <Button color="primary" variant="primary" onClick={() => {setEtud(etudiant.etudiant);setPfe(etudiant)}} >
            {/* {console.log({etud})} */}
            
            <FaEye/>
            </Button>

            </Link>
            </td>
            <td>
            <Button className="btn btn-primary" onClick={etudiant.id} ><FaEdit/></Button>
            </td>
            <td>
            <Button className="btn btn-danger" onClick={()=>handleDelete(etudiant)}><FaTrash/></Button>
            </td>
            <td>
            {/* <Button className="butt" color="primary" ><FaPlus/></Button> */}
            <Button color="primary" variant="primary" onClick={()=>affecterEncadrant(etudiant.etudiant)}>
            <FaPlus/>
            </Button>
          <div className="popup">
          <div className="popuptext" id="myPopup">Popup text...</div>
          </div>
            
          
            
            </td>
          </tr>
          ) )}
        </tbody>
      </Table>
			
		</div>
	);
}

export default EtudiantsListe;
