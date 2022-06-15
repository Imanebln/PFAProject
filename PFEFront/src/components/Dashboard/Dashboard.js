import React from 'react';
import './DashboardStyling.css'
import { NavLink } from "react-router-dom";

export default function Dashboard() {
  const handleLogout = () => {
        sessionStorage.removeItem("token");
        window.location.href = "/";
      };
        return (
            <div className='dashboardContainer'>
              <div className='title'>
                Bienvenue dans l'espace chef de filière
             </div>
            <div className='dashboardMenu'>
              <NavLink className='nav-link' to={'/EncadrantsListe'}>
                <p>Encadrants</p>
              </NavLink>
            
              <NavLink className='nav-link' to={'/EtudiantsListe'}>
                <p>Etudiants</p>
              </NavLink>
            
              <NavLink className='nav-link' to={'/SoutenancesListe'}>
                <p>Soutenances</p>
              </NavLink>

              <NavLink className='nav-link' to={'/LoginToken'} onClick={handleLogout}>
                <p>Logout</p>
              </NavLink>
          </div>  
            </div>
        );
}