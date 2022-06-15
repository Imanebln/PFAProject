import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams  } from "react-router-dom";
import { Link } from "react-router-dom";
import { Table, Button, Row } from 'reactstrap';
import { Container,Col } from 'reactstrap';
import { CSVLink } from "react-csv";

import { NavigateBefore } from "@material-ui/icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import DatePicker from "react-datepicker";

toast.configure();

function SoutenancesListe(props) {

    
    function getToken() {
      const tokenString = sessionStorage.getItem('token');
      const userToken = JSON.parse(tokenString);
      return userToken?.token
    }
    
    // GetSoutenanceByDate
    const [date,setDate] = useState((new Date()));
    const [soutenances,setSoutenances] = useState([]);
    useEffect(() => {
      axios.get(`https://localhost:7004/api/Authenticate/GetSoutenanceByDate?date=${format(date,'dd/MM/yyyy')}`,{headers: {"Authorization" : `Bearer ${getToken()}`}}).then(res => {
        setSoutenances(res.data);
    })
  }, [])
  async function getSoutenancesListe(){
    try {
      axios.get(`https://localhost:7004/api/Authenticate/GetSoutenanceByDate?date=${format(date,'dd/MM/yyyy')}`,{headers: {"Authorization" : `Bearer ${getToken()}`}}).then(res => {
      console.log(res);  
      setSoutenances(res.data);
    })} 
    catch (ex) {
      console.log(ex);
    }
  }
 
	return ( 
		<div className="div-margin">
      <br></br>
      <br></br>
            <h4>Liste des soutenances</h4>
            <br></br>
            <label>Date de Soutenance</label>
            <DatePicker  dateFormat="dd/MM/yyyy" selected={date} onChange = {(date1) => setDate(date1)} />
            <Button style={{display : 'none'}} className="butt" color="primary" onClick={getSoutenancesListe()}>Chercher</Button>
        <Table responsive hover>
        <thead>
          <tr>
            <th>Etudiant</th>
            <th>Sujet</th>
            <th>Date de soutenance</th>
            <th>Actions</th>
          </tr>
        </thead>
       <tbody>
        {soutenances.map(soutenance =>(
          <tr key={soutenance.id}>
            <td >
            {soutenance.pfe.etudiant.nom} {soutenance.pfe.etudiant.prenom}
            </td>
            <td>
            {soutenance.pfe.sujet}
            </td>
            <td>
            {soutenance.date}
            </td>
            <td>
              <Button color="primary"><FaEye/></Button>
            </td>
            <td>
              <Button className="btn btn-danger"><FaTrash/></Button>
            </td>
          </tr>
        ))}

       </tbody>
      </Table>
			
		</div>
	);
}

export default SoutenancesListe;