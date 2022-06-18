import React from "react"; 
import { NavLink } from "react-router-dom";
import './sharedStyling.css'

const Nav = () => {
	return (
		<nav className="Navv">
				<ul>
				<li className="Right"><NavLink className="nav-link" hrefLang="https://henok.us" to="/Dashboard">
					<p>	PFEProgress</p>
					</NavLink>
					</li>	
					
					<li className="Left">
						<NavLink
							className="nav-link"
							to={'/Etudiant'}
						>
							<p>Espace Etudiant</p>
						</NavLink>
						
					</li>
				</ul>
		</nav>
	);
};

export default Nav;
