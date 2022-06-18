import React from 'react';
import './DashboardStyling.css'
import { NavLink } from "react-router-dom";

export default function Dashboard() {
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
          </div>  
            </div>
        );
}