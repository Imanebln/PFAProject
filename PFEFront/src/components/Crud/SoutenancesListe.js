import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from 'reactstrap';
import { FaTrash, FaEye } from "react-icons/fa";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import swal from 'sweetalert';

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
      //console.log(res);  
      setSoutenances(res.data);
    })} 
    catch (ex) {
      console.log(ex);
    }
  }

  // async function ExportFileSoutenance(){
  //   try {
  //     axios.get(`https://localhost:7004/api/Authenticate/ExportFileSoutenance`,{headers: {"Authorization" : `Bearer ${getToken()}`}}).then(res => {
  //     console.log(res);  
  //     //setSoutenances(res.data);
  //   })} 
  //   catch (ex) {
  //     console.log(ex);
  //   }
  // }

  useEffect(
		function () {
			async function deleteCrudById() {
				try {
					const response = await axios.get(`https://localhost:7004/api/Authenticate/DeleteSoutenance?id=${soutenances.id}`,{headers: {"Authorization" : `Bearer ${getToken()}`}});
					setSoutenances(response.data);
				} catch (error) {
					console.log("error", error);
				}
			}
			deleteCrudById();
		},
		[props]
	);

	async function handleDelete(s) {
		try {

      console.log(s)
			await axios.delete(`https://localhost:7004/api/Authenticate/DeleteSoutenance?id=${s.id}`,{headers: {"Authorization" : `Bearer ${getToken()}`}});
      setSoutenances(soutenances.filter((ele)=> ele.id !== s.id))
      swal({
        icon:"success",
        text:'Soutenance supprimée',
        timer:2000,
        buttons:false
      })
		} catch (error) {
			console.error(error);
		}
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
  const [stc, setStc] = useLocalStorage("stc",{})
 
	return ( 
		<div className="soutenanceDiv">
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
              <Link to = {{pathname: "/SoutenanceDetails"}}>
              <Button color="primary" onClick={() => setStc(soutenance)}><FaEye/></Button>
              </Link>
            </td>
            <td>
              <Button className="btn btn-danger" onClick={() => handleDelete(soutenance)}><FaTrash/></Button>
            </td>
          </tr>
        ))}

       </tbody>
      </Table>
			{/* <Button className="btn btn-success" onClick={() => ExportFileSoutenance()}>Download</Button> */}
		</div>
	);
}

export default SoutenancesListe;