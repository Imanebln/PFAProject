function SoutenanceDetails (){
    const stc = localStorage.getItem('stc');
    const stcjson = JSON.parse(stc);
    console.log(stcjson);

    return (
		<div className="encadrantDetails">
           
			<h2>Soutenance Details</h2>
            <hr></hr>
            <div className="container">
            <p>
            <form className="container-sm">
            <div className="row">
            
            <div className="col">
                <div  className="form-group">
                    <label>Nom & Prénom</label>
                    <input name="nom"
						        type="text"
						        value={stcjson.pfe.etudiant.nom + " " +stcjson.pfe.etudiant.prenom}
					        	className="form-control" disabled/>
                </div>
                </div>

                <div className="col">
                <div  className="form-group">
                <label>Sujet</label>
                <input name="sujet"
                    type="text"
                    value={stcjson.pfe.sujet}
                    className="form-control" disabled/>
                </div>
                </div>
                </div>
        
            <div  className="form-group">
                <label>Encadrant Académique</label>
                <input name="encad"
                    type="text"
                    value={stcjson.pfe.encadrant != null ? stcjson.pfe.encadrant.nom + " " + stcjson.pfe.encadrant.prenom : " "}
                    className="form-control" disabled/>
            </div>
    <div className="row"> 
        {stcjson.jury.map(jr => 
        {return  jr.id != stcjson.pfe.encadrant.id ?
            <div className="col">
                <div  className="form-group">
                <label>Jury </label>
                <input name="jury"
                    type="text"
                    value={jr.nom + " " + jr.prenom}
                    className="form-control" disabled/>
                </div>
            </div>
            :
           <></> 
        })}
    </div>
        <div className="row"> 
            <div className="col">
                <div >
                <label>Date </label>
                <input name="email"
                    type="text"
                    value={stcjson.date}
                    className="form-control" disabled/>
                </div>
            </div>
            <div className="col">
                <div className="form-group">
                <label>Durée </label>
                <input name="email"
                    type="text"
                    value={stcjson.heureDebut + " -> " + stcjson.heureFin}
                    className="form-control" disabled/>
                </div>
            </div>
        </div>
                
                
                

            </form>
          
          </p>
            </div>

			
		</div>
	);
}
export default SoutenanceDetails;