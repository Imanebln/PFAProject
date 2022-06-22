import React, { useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Table, Button} from 'reactstrap';
import { FaTrash,  FaEye, FaCheck} from "react-icons/fa";
import { post} from "axios";
import swal from 'sweetalert';
import 'react-dropdown/style.css';
import Dropdown from "./Dropdown";

import { Container } from 'reactstrap';

function EtudiantsListe(props) {
 
  function getToken() {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  }

    const [etudiants,setEtudiants]= useState([]);
  useEffect(() => {
    axios.post(`https://localhost:7004/api/Etudiants/GetByYear?annee=${annee}`,{headers: {"Authorization" : `Bearer ${getToken()}`}}).then(res => {
      setEtudiants(res.data);
    })
  }, [])
  const[annee, setAnnee] = useState((new Date()).getFullYear());
  async function getEtudiantsList(){
    try {
      axios.post(`https://localhost:7004/api/Etudiants/GetByYear?annee=${annee}`,{headers: {"Authorization" : `Bearer ${getToken()}`}}).then(res => {
      setEtudiants(res.data);
    })} 
    catch (ex) {
      console.log(ex);
    }
  }

  async function handleChangeInput(e){
    setAnnee(parseInt(e.target.value));
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
         getEtudiantsList(annee);
      }
      
    } catch (ex) {
      console.log(ex);
    }
  };
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
      swal({
        text:'Etudiant supprimé',
        icon:"success",
        timer:2000,
        buttons:false
      })
		} catch (error) {
			console.error(error);
		}
	}

  function AjouterEtudiant(){
    navigate("/AjouterEtudiant");
  }


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
  const [encAc,setEncAc] = useLocalStorage("encAc",{})
  const Encad = localStorage.getItem('encad');
  const Encadjson = JSON.parse(Encad);

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

 
  

  function confirmerAffectation(e){
 
  async function postaffect(){
      try {
			 await post(`https://localhost:7004/api/Authenticate/AffecterEncadrant?id=${e.id}&idEncadrant=${Encadjson.id}`).then(
        res =>
        {
        swal({
          text: "Affectation réussite!",
          icon: "success",
          button:false,
          timer:2000
        });
        })
      }
      catch(error){
				swal({
          text: "Error durant l'affectation",
          icon: "error",
          button:false,
          timer:2000
        });
			}
}
postaffect();
}

	return (
    
		<div className="etudiantsListe">
			<h4>Etudiants</h4>
      <Container className="divHead">
               
                    <div className="searchYear">
                      <input name="annee" type="number" defaultValue={(new Date()).getFullYear()} placeholder="Chercher par annee ..." required 
                       onChange={handleChangeInput} className="form-control inputYear"/>
                       <Button style={{display : 'none'}} className="butt" color="primary" onClick={getEtudiantsList()}>Chercher</Button>
                    </div>
                   
                    <div className="importFile">
                    <input type="file" color="primary" onChange={saveFileSelected}/>
                    <input   type="button" color="primary" value="Importer Fichier EXCEL" onClick={importFile} className="importFileInput"/> 
                   
                    </div>
                 
                    <Button className="butt" color="primary" onClick={AjouterEtudiant}>Ajouter Etudiant</Button>
          
            </Container>
        <Table responsive hover>
        <thead>
          <tr>
            <th>Nom et Prénom</th>
            <th>Email</th>
            <th>Filière</th>
            <th>Encadrant</th>
            <th></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        
        {etudiants.map(etudiant => {
          return etudiant.encadrant == null ?
          <><tr>
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
              <Dropdown>
              </Dropdown>                       
            </td>

            <td>
            <button key={etudiant.id}  className="btn btn-success" onClick={() => {confirmerAffectation(etudiant)} }>
                  <FaCheck />
            </button>
            </td>

            <td>

              <Link to={{ pathname: "/EtudiantDetails" }}>
                <Button color="primary" variant="primary" onClick={() => { 
                  setEtud(etudiant.etudiant);
                  setPfe(etudiant);
                  setEncAc(etudiant.encadrant)
                  console.log("hello pfe "+ pfe); }}>
                <FaEye />
                </Button>
              </Link>
            </td>
            <td>
              <Button className="btn btn-danger" onClick={() => handleDelete(etudiant)}><FaTrash /></Button>
            </td>
          </tr></> 
          :
<><tr>
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
              {etudiant.encadrant.nom} {etudiant.encadrant.prenom}
            </td>

            <td>
            <button key={etudiant.id} disabled={true} className="btn btn-success" onClick={() => { confirmerAffectation(etudiant) }}>
              <FaCheck />
            </button>
            </td>

            <td>
              <Link to={{ pathname: "/EtudiantDetails" }}>
                <Button color="primary" variant="primary" onClick={() => { 
                  setEtud(etudiant.etudiant);
                  setPfe(etudiant);
                  setEncAc(etudiant.encadrant)
                  console.log("hello pfe "+ pfe); }}>
                <FaEye />
                </Button>
              </Link>
            </td>
            <td>
              <Button className="btn btn-danger" onClick={() => handleDelete(etudiant)}><FaTrash /></Button>
            </td>
          </tr></> 
          })}
        </tbody>
      </Table>
			
		</div>
	);
}

export default EtudiantsListe;
