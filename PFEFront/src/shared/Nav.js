import React from "react";
import { NavLink } from "react-router-dom";
import './sharedStyling.css'

const Nav = () => {
    const handleLogout = () => {
        sessionStorage.removeItem("token");
        // sessionStorage.removeItem("user");
        window.location.href = "/";
      };
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
                    {/* <li className="nav-item">
                    <Button class="btn-nav"
                            onClick={handleLogout}>Logout</Button>

                    </li> */}	
				</ul>
		</nav>
	);
};

export default Nav;
