import React, { useState, useEffect } from "react";
import './CrudStyling.css'

function EncadrantDetails(props) {
	
    
    
    //  const [encad,setEncadrant]= useState({});

     const encad = localStorage.getItem('enc');
     const encadjson = JSON.parse(encad);
     console.log(encadjson.nom);
    
    //  const { data } = this.props.data

    // useEffect(()=>{
    //     setEncadrant(props.encadrant) 
    // })
    

    
    // const { data } = this.props
    

    
    console.log({encad});
	return (
		<div className="encadrantDetails">
           
			<h2>Encadrant Details</h2>
            <hr></hr>
            <div className="container">
            <p>
            <form className="container-sm">
        
            {/* {encad.map(e => <li>e</li> )} */}
            {/* {Object.keys(encad).map(e => <li>{e}</li> )} */}
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