import React, { useState } from "react";
import { post } from "axios";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CrudStyling.css'
import swal from 'sweetalert'
toast.configure();

function AjouterEtudiant() {

	function getToken() {
		const tokenString = sessionStorage.getItem('token');
		const userToken = JSON.parse(tokenString);
		return userToken?.token
	  }
    
    const initialState = {
		nom: "",
		prenom: "",
		email: "",
		username:"",
        sujet:"",
		nomSociete:"",
		emailEncadrant:"",
	    technologiesUtilisees:"",
	    ville:"",
		annee: 0
	};
	const [etudiant, setEtudiant] = useState(initialState);

	const navigate = useNavigate();

    function handleSubmit(event) {
		event.preventDefault();

		async function postCrud() {
			try {
				await post("https://localhost:7004/api/Authenticate/add-etudiant", etudiant,{headers: {"Authorization" : `Bearer ${getToken()}`}});
				swal({
					text:'Etudiant ajouté',
					icon: "success",
					timer:2000,
					buttons:false
				  })
				  navigate("/EtudiantsListe");
				
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
		setEtudiant({ ...etudiant, [event.target.name]: event.target.value });
	}

	function handleCancel() {
        navigate("/EtudiantsListe");
        
    }
		

	return (
		<div className="ajoutEtudiant">
			<h2>Ajouter un Etudiant</h2>
			<hr />
            <form onSubmit={handleSubmit}>
				<div className="row">
				<div className="form-group">
					<label>Nom d'utilisateur</label>
					<input
						name="username"
						type="text"
						required
						value={etudiant.username}
						onChange={handleChange}/>
				</div>	
				</div>
				<div className="row">
					<div className="column">
						<div className="form-group">
						<label>Nom</label>
						<input
							name="nom"
							type="text"
							required
							value={etudiant.nom}
							onChange={handleChange}
							className="form-control"/>
						</div>
					</div>
					<div className="column">
						<div className="form-group">
					<label>Prénom</label>
					<input
						name="prenom"
						type="text"
						required
						value={etudiant.prenom}
						onChange={handleChange}
						className="form-control"/>
					</div>
					</div>
				</div>
				<div className="row">
					<div className="form-group">
					<label>Email</label>
					<input
						name="email"
						type="email"
						pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$"
						required
						value={etudiant.email}
						onChange={handleChange}
						className="form-control"/>
					</div>
				</div>
				<br></br>
				<div className="row">
					<div className="form-group">
					<label>Email Encadrant de la société</label>
					<input
						name="emailEncadrant"
						type="email"
						pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$"
						required
						value={etudiant.emailEncadrant}
						onChange={handleChange}
						className="form-control"/>
				</div>
				</div>
				
				<div className="form-group">
					<label>Sujet</label>
					<input
						name="sujet"
						type="text"
						required
						value={etudiant.sujet}
						onChange={handleChange}
						className="form-control"/>
				</div>
				<br/>
				<div className="row">
					<div className="column">
						<div className="form-group">
						<label>Société</label>
						<input
							name="nomSociete"
							type="text"
							required
							value={etudiant.nomSociete}
							onChange={handleChange}
							className="form-control"/>
						</div>
					</div>
					<div className="column">
						<div className="form-group">
						<label>Ville</label>
						<input
							name="ville"
							type="text"
							required
							value={etudiant.ville}
							onChange={handleChange}
							className="form-control"/>
						</div>
					</div>
				</div>
				
				<br>
				</br>
				
				<br/>
				<div className="row">
					<div className="column">
					<div className="form-group">
					<label>Technologies Utilisées</label>
					<input
						name="technologiesUtilisees"
						type="text"
						required
						value={etudiant.technologiesUtilisees}
						onChange={handleChange}
						className="form-control"/>
				</div>
					</div>
					<div className="column">
					<div className="form-group">
					<label>Année</label>
					<input
						name="annee"
						type="number"
						required
						value={etudiant.annee}
						onChange={handleChange}
						className="form-control"/>
				</div>
					</div>
				</div>
				
				<br/>
				
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

export default AjouterEtudiant;