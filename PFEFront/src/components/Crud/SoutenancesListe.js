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
import EncadrantDetails from "./EncadrantDetails";
toast.configure();

function SoutenancesListe(props) {

    
    function getToken() {
      const tokenString = sessionStorage.getItem('token');
      const userToken = JSON.parse(tokenString);
      return userToken?.token
    }

  
	return ( 
		<div className="div-margin">
            <h4>Liste des soutenances</h4>
            <br></br>
			
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

       </tbody>
      </Table>
			
		</div>
	);
}

export default SoutenancesListe;
