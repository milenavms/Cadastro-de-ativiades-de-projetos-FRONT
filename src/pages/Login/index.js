import React, {Component} from 'react';
import {Form, FormGroup, Label, Input, Button , Alert} from 'reactstrap';

import Header from  '../../components/Header';

export default class Login extends Component{
    constructor(props) {
         super(props)
         this.state = {
             message: this.props.location.state?this.props.location.state.message: '',
         }
    }

    signIn = () => {
            const requestInfo = {
            method: 'POST',
            body: JSON.stringify({email: this.email, senha: this.password}),
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        };

        fetch('http://localhost:4000/authenticate', requestInfo )
        .then(response => {
            console.log(response);
            if(response.ok) {
                return response.json()
            }
            throw new Error('Senha ou email inválidos!');
        })
        .then(data => {
           
           localStorage.setItem('token', data.token);
           this.props.history.push("/atividade");
           return;
        })

        .catch(e => {
            //throw new Error("Login invalido...");
           
            this.setState({ message: e.message});
        });
    }

    render(){
        return(
            <div className="col-md-6">
                    <Header title="Login" />
                    <hr className="my-3"/>
                    {
                        this.state.message !== ''? (
                            <Alert color="danger">{this.state.message}</Alert>
                        ) : ''
                    }
                <Form>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input type="text" id="email" onChange={e => this.email = e.target.value} placeholder="Informe seu email"></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="senha">Senha</Label>
                        <Input type="password" id="senha" onChange={e => this.password = e.target.value} placeholder="Informe sua senha"></Input>
                    </FormGroup>
                    <Button color="primary" block onClick={this.signIn}>Entrar</Button>
                </Form>

            </div>
        );
    }
}