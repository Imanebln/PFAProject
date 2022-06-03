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

function EncadrantsListe(props) {

    const [encadrants,setEncadrants]= useState([]);
    // const [encad,setEncad]= useState();

    function getToken() {
      const tokenString = sessionStorage.getItem('token');
      const userToken = JSON.parse(tokenString);
      return userToken?.token
    }

  useEffect(() => {
    axios.get('https://localhost:7004/api/Encadrants',{headers: {"Authorization" : `Bearer ${getToken()}`}}).then(res => {
      console.log(res);
      setEncadrants(res.data);
    })
  }, [])

  const { _id } = useParams();
  const navigate = useNavigate();

  useEffect(
		function () {
			async function deleteCrudById() {
				try {
					const response = await axios.get(`https://localhost:7004/api/Authenticate/SuppProf?id=${encadrants.id}`,{headers: {"Authorization" : `Bearer ${getToken()}`}});
					setEncadrants(response.data);
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
			await axios.delete(`https://localhost:7004/api/Authenticate/SuppProf?id=${e.id}`,{headers: {"Authorization" : `Bearer ${getToken()}`}});
      setEncadrants(encadrants.filter((ele)=> ele.id !== e.id))
      toast.warning('Encadrant supprime!')
		} catch (error) {
			console.error(error);
		}
	}

  // async function handleView(e) {

  //      console.log(e)
  //      setEncad(e)
	// 		// await axios.get(`https://localhost:7004/api/Encadrants?id=${e.id}`,{headers: {"Authorization" : `Bearer ${getToken()}`}});
  //     // setEncadrants(encadrants.filter((ele)=> ele.id !== e.id))
  //     navigate("/EncadrantDetails");
	// }

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

  const [encad,setEncad] = useLocalStorage("enc",{})

  function AjouterProf(){
    navigate("/AjouterEncadrant");
  }

  //modal view
  const [modalShow, setModalShow] = React.useState(false);
  // function viewProf(e){
  //   setModalShow(true);
  //   setEncad(e);
  // }
  // function afterOpenModal(e) {
  //   props.onAfterOpen(e, 'After Modal Opened');
  
  // }
  
  
  

	return ( 
		<div className="div-margin">
            <h4>Encadrants</h4>
            <Container>
                <Row>
                    <Col>
                    <Button className="butt" color="primary" onClick={AjouterProf}>Ajouter Encadrant</Button>
                    {/* <a href="/AjouterEncadrant">Ajouter Encadrant</a> */}
                    
                    </Col>
                </Row>
            </Container>
			
        <Table responsive hover>
        <thead>
          <tr>
            <th>Nom et Prenom</th>
            <th>Email</th>
            <th>Filiere</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {encadrants.map(encadrant => (
          <tr key={encadrant.id}>
            <td >
            {encadrant.nom} {encadrant.prenom}
            </td>
            <td>
            {encadrant.email}
            </td>
            <td>
           {encadrant.filiere}
         
            </td>
            <td>
            <Link to={{pathname: "/EncadrantDetails"}}>
            <Button color="primary" variant="primary" onClick={() => setEncad(encadrant)} >
            {console.log({encad})}
            
            <FaEye/>
            </Button>

            </Link>
            
            {/* <Link to={{pathname: "/EncadrantDetails",
            data : {encadrant}}}>
            <Button color="primary" variant="primary" >
            <FaEye/>
            </Button>
            </Link> */}
            {/* <ModalView
            encadrant= {encadrant}
           show={modalShow}
           onHide={() => setModalShow(false)}
           />
            <a  href="/EncadrantDetails"><FaEye/></a> */}
            </td>
            <td>
            {/* <Button className="btn btn-primary" onClick={()=>handleView(encadrant)} ><FaEdit/></Button> */}
            </td>
            <td>
            <Button className="btn btn-danger" onClick={()=>handleDelete(encadrant)}><FaTrash/></Button>
            </td>

          </tr>
          ) )}
        </tbody>
      </Table>
			
		</div>
	);
}

export default EncadrantsListe;
