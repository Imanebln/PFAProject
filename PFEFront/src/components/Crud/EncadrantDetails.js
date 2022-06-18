import React from "react";
import './CrudStyling.css'

function EncadrantDetails() {
     const encad = localStorage.getItem('enc');
     const encadjson = JSON.parse(encad);
	return (
		<div className="encadrantDetails">
           
			<h2>Encadrant Details</h2>
            <hr></hr>
            <div className="container">
            <p>
            <form className="container-sm">
            <div className="row">
            
            <div className="col">
                <div  className="form-group">
                    <label>Nom</label>
                    <input name="nom"
						        type="text"
						        value={encadjson.nom}
					        	className="form-control" disabled/>
                </div>
                </div>

                <div className="col">
                <div  className="form-group">
                <label>Prenom</label>
                <input name="prenom"
                    type="text"
                    value={encadjson.prenom}
                    className="form-control" disabled/>
                </div>
                </div>
                </div>

                <div  className="form-group">
                <label>Email</label>
                <input name="email"
                    type="text"
                    value={encadjson.email}
                    className="form-control" disabled/>
                </div>
               
            </form>
          
          </p>
            </div>

			
		</div>
	);
}

export default EncadrantDetails;