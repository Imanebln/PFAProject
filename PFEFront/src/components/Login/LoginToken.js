import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react'; 
import loginImg from '../../loginImg.png';
import './loginStyling.css';
import { AiOutlineEye } from 'react-icons/ai';



import { Button, Card, CardBody, Input, 
  InputGroup } from 'reactstrap';

async function loginUser(credentials) {
    return fetch('https://localhost:7004/api/Authenticate/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }

export default function LoginToken({ setToken }) {

  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [msg,setMsg] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
    localStorage.setItem('msg', JSON.stringify(msg));
  const handleSubmit = async e => {
    e.preventDefault();
    setMsg(true);
    const token = await loginUser({
      username,
      password
    });
    setToken(token);
  }

  return(
    <div className="loginDiv">
      <div className="Right">
      <img src={loginImg}></img>
      </div>
      <div className="Left">
       
                                <Card className="p-2">
                                    <CardBody>
    
      <form onSubmit={handleSubmit} className="myForm">
      <div class="row" 
                                            className="mb-2 pageheading">
                                                <div className="msgCon">
                                                    Connectez Vous   
                             </div>
                             </div>

        <InputGroup className="mb-3">
          <Input name="usr" className="myInput" placeholder="Entrez votre nom d'utilisateur" type="text" onChange={e => setUserName(e.target.value)} />
          </InputGroup>
       
        <InputGroup className="mb-3">
          <Input id="pwd" name="pwd" className="myInput" placeholder="Entrez votre mot de passe" type={passwordShown ? "text" : "password"} onChange={e => setPassword(e.target.value)} ></Input>
        </InputGroup>  
        <InputGroup className="show">
        <AiOutlineEye  onClick={togglePassword} id="eye" />
        <a onClick={togglePassword}>afficher mot de passe</a>
        </InputGroup>    
    
 
          <div className="buttonDiv">
             <Button className="myButton">Se connecter</Button>
          </div>
         
      </form>
      </CardBody>
      </Card>
   
    </div>
    
      </div>

    
  )
}
LoginToken.propTypes = {
    setToken: PropTypes.func.isRequired
  }