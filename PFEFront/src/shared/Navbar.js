import React from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineMenu } from 'react-icons/ai';

const Navbar = () => {
	const handleLogout = () => {
        sessionStorage.removeItem("token");
        window.location.href = "/";
      };
	return (
	<nav className="NavvBar">
	<div className="Right">
	<NavLink to="/Dashboard" className="nav-link">
	<p>PFEProgress</p>
	</NavLink>
	</div>
	<div className="centre"></div>
	<div className="Left">
	<AiOutlineMenu className="iconMenu"/>
		<ul>
			<li>
			<NavLink className="nav-linke" to={'/EncadrantsListe'}>
				<p>Encadrants</p>
			</NavLink>
			</li>

			<li>
			<NavLink className="nav-linke" to={'/EtudiantsListe'}>
				<p>Etudiants</p>
			</NavLink>
			</li>

			<li>
			<NavLink className="nav-linke" to={'/SoutenancesListe'}>
				<p>Soutenances</p>
			</NavLink>
			</li>

			<li>
			<NavLink className="nav-linke" to={'/LoginToken'} onClick={handleLogout}>
				<p>Logout</p>
			</NavLink>
			</li>
		</ul>
	</div>
		</nav>
	);
};

export default Navbar;