import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react'; 
import loginImg from '../../loginImg.png'
import './loginStyling.css';

import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, 
  InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

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

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password
    });
    // if ('accessToken' in token) {
    //   swal("Success", token.message, "success", {
    //     buttons: false,
    //     timer: 2000,
    //   })
    //   .then((value) => {
    //     localStorage.setItem('accessToken', token['accessToken']);
    //     localStorage.setItem('user', JSON.stringify(token['user']));
    //     window.location.href = "/profile";
    //   });
    // } else {
    //   swal("Failed", token.message, "error");
    // }
    setToken(token);
    // if(setToken(token)){
    //   console.log("hello world!!!!!");
    //   this.props.history.push("/Dashboard");
    // }
    // else{
    //   console.log("error !!!!!");
    // }
    // setToken(token);

    
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
          <Input  className="myInput" placeholder="Entrez votre nom d'utilisateur" type="text" onChange={e => setUserName(e.target.value)} />
          </InputGroup>
       
        <InputGroup className="mb-3">
          <Input  className="myInput" placeholder="Entrez votre mot de passe" type="password" onChange={e => setPassword(e.target.value)} />
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