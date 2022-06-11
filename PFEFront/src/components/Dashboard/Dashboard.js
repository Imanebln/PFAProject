import React, { Component } from 'react';
import '../../App.css';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, 
         Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { Link } from "react-router-dom";

export default function Dashboard() {

    const user = JSON.parse(sessionStorage.getItem('user'));

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        // sessionStorage.removeItem("user");
        window.location.href = "/";
        console.log("Hy" + user);
      };
    
    
      console.log("Hy " + user);


 
        return (
            <div class="row" className="mb-2 pageheading">
                
             <section class="services" id="services">
            <div class="max-width">

            <div class="serv-content">
                <div class="card">
                    <div class="box">
                        <i class=""></i>
                        <div><Link to={{pathname: "/EncadrantsListe"}} class="text">Gestion des encadrants</Link></div>
                    </div>
                </div>

                <div class="card">
                    <div class="box">
                        <i class=""></i>
                        <div ><Link to={{pathname: "/EtudiantsListe"}} class="text">Gestion des etudiants</Link></div>
                    </div>
                </div>
                
                <div class="card">
                <div class="box">
                        <i class=""></i>
                        <div ><Link  to={{pathname: "/SoutenancesListe"}} class="text">Les Soutenances</Link></div>
                </div>
                </div>
            
            </div>
  
             
             
            </div>
            </section>
            </div>
        );
}