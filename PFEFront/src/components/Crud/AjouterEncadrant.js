import React, { useState } from "react";
import { post } from "axios";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CrudStyling.css'
import swal from 'sweetalert'

toast.configure();

function AjouterEncadrant() {

    function getToken() {
		const tokenString = sessionStorage.getItem('token');
		const userToken = JSON.parse(tokenString);
		return userToken?.token
	  }
    const initialState = {
		nom: "",
		prenom: "",
		email: "",
		username:""
	};
	const [encadrant, setEncadrant] = useState(initialState);

	const navigate = useNavigate();

    function handleSubmit(event) {
		event.preventDefault();
		async function postCrud() {
			try {
				await post("https://localhost:7004/api/Authenticate/add-encadrant", encadrant,{headers: {"Authorization" : `Bearer ${getToken()}`}});
				swal({
					text:'Encadrant ajouté',
					icon: "success",
					timer:2000,
					buttons:false
				  })
				  navigate("/EncadrantsListe");
				
			} catch (error) {
				
				swal({
					text:"Nom d'utilisateur déjà existe",
					icon: "error",
					timer:2000,
					buttons:false
				})
			}
		}
		postCrud();
	}

    function handleChange(event) {
		setEncadrant({ ...encadrant, [event.target.name]: event.target.value });
	}

	function handleCancel() {
        navigate("/EncadrantsListe");
        
    }
	return (
		<div className="ajoutEncadrant">
			<h2>Ajouter un encadrant</h2>
			<hr />
            <form onSubmit={handleSubmit}>
			<div className="form-group">
					<label>Username</label>
					<input
						name="username"
						type="text"
						required
						value={encadrant.username}
						onChange={handleChange}
						className="form-control"
					/>
				</div>
				<div className="form-group">
					<label>Nom</label>
					<input
						name="nom"
						type="text"
						required
						value={encadrant.nom}
						onChange={handleChange}
						className="form-control"
					/>
				</div>
				<div className="form-group">
					<label>Prenom</label>
					<input
						name="prenom"
						type="text"
						required
						value={encadrant.prenom}
						onChange={handleChange}
						className="form-control"
					/>
				</div>
				<div className="form-group">
					<label>Email</label>
					<input
						name="email"
						type="email"
						pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$"
						required
						value={encadrant.email}
						onChange={handleChange}
						className="form-control"
					/>
				</div>
				<br/>
				<div className="buttons">
					<input type="submit" value="Submit" className="btn btn-primary" />
					<button
						type="button"
						onClick={handleCancel}						
                        className="btn btn-secondary">Annuler</button>
				</div>
			</form>
			
		</div>
	);
}

export default AjouterEncadrant;