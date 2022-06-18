import React from 'react';
import './App.css';  
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css'; 
import { BrowserRouter as Router,Routes, Route} from 'react-router-dom';   
import Dashboard from "./components/Dashboard/Dashboard";  
import EtudiantsListe from './components/Crud/EtudiantsListe';
import EncadrantsListe from './components/Crud/EncadrantsListe';
import AjouterEncadrant from './components/Crud/AjouterEncadrant';
import AjouterEtudiant from './components/Crud/AjouterEtudiant';
import Navbar from './shared/Navbar';
import Nav from './shared/Nav';
import Footer from './shared/Footer';
import LoginToken from './components/Login/LoginToken';
import Etudiant from './EtudiantComponent/Etudiant';
import EncadrantDetails from './components/Crud/EncadrantDetails';
import EtudiantDetails from './components/Crud/EtudiantDetails';
import Dropdown from './components/Crud/Dropdown';
import SoutenancesListe from './components/Crud/SoutenancesListe';
import SoutenanceDetails from './components/Crud/SoutenanceDetails';
import swal from 'sweetalert';

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
  window.location.href = "/Dashboard";
}

function getToken() {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  }


function App() { 
  const token = getToken();
  const msg = JSON.parse(localStorage.getItem('msg'));
if(!token && msg){
  swal("Nom d'utilisateur ou mot de passe incorrect");
}
  if(!token) {
    return (
      <>
      <Nav/>
      <LoginToken setToken={setToken} />
      <div className='footer'>
     <Footer/>
     </div>

    </>
    )
  }
  return (  
      <>
      <Navbar />
     
      <Routes>
          <Route path='/Navbar' element={<Navbar/>} />
          <Route path='/Nav' element={<Nav/>} />
          <Route path='/Footer' element={<Footer/>} />
          <Route path='/LoginToken' element={<LoginToken/>} />      
          <Route path='/Dashboard' component={Dashboard} element={<Dashboard/>}/>  
          <Route path="/EncadrantsListe" component={EncadrantsListe} element={<EncadrantsListe/>} />
          <Route path='/' component={LoginToken} element={<LoginToken/>} />
          <Route path="/EtudiantsListe" component={EtudiantsListe} element={<EtudiantsListe/>}/>
          <Route path="/AjouterEncadrant" component={AjouterEncadrant} element={<AjouterEncadrant/>}/>
          <Route path="/AjouterEtudiant" component={AjouterEtudiant} element={<AjouterEtudiant/>}/>
          <Route path="/EncadrantDetails" component={EncadrantDetails} element={<EncadrantDetails/>}/>
          <Route path="/EtudiantDetails" component={EtudiantDetails} element={<EtudiantDetails/>}/>
          <Route path="/Etudiant" component={Etudiant} element={<Etudiant/>}/>
          <Route path="/Dropdown" component={Dropdown} element={<Dropdown/>}/>
          <Route path="/SoutenancesListe" component={SoutenancesListe} element={<SoutenancesListe/>}/>
          <Route path="/SoutenanceDetails" component={SoutenanceDetails} element={<SoutenanceDetails/>}/>

      </Routes> 
     <div className='footer'>
     <Footer/>
     </div>
       </>
  );  
}  
  
export default App; 