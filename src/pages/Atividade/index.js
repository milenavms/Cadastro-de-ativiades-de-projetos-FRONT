import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';

import Header from '../../components/Header';

export default class Atividade extends Component {
    componentDidMount() {
        const token = localStorage.getItem('token');
        console.log(token);

        this.listaStatus();
        this.listaUsuario();


    }

    constructor(props) {
        super(props)
        this.state = {
            usuarios: [],
            status: [],
            token: localStorage.getItem('token'),
            statusSelecionado: {},
            ususarioSelecionado: {}

        }
    }

    listaStatus = () => {
        const requestInfo = {
            method: 'GET',
            headers: new Headers({
                'x-access-token': this.state.token,
            }),
        };


        fetch('http://localhost:4000/status', requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Ops! ocorreu um erro");

            })
            .then(data => {
                console.log(data);
                this.setState({
                    status: data.data,
                    statusSelecionado: data.data[0].id
                });

                //console.log(this.state);
            })
            .catch(e => console.log(e));
    }

    listaUsuario = () => {
        const requestInfo = {
            method: 'GET',
            headers: new Headers({
                'x-access-token': this.state.token,
            }),
        };


        fetch('http://localhost:4000/usuario', requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Ops! ocorreu um erro");

            })
            .then(data => {
                console.log(data);
                this.setState({
                    usuarios: data.data,
                    ususarioSelecionado: data.data[0].id
                });

                //console.log(this.state);
            })
            .catch(e => console.log(e));
    }

    salvar = (e) => {
        e.preventDefault();

        var usuarioId = this.usuario ? this.usuario: this.state.ususarioSelecionado;
        var statusId = this.status ? this.status: this.state.statusSelecionado;

        var atividade =  {
            descricao: this.descricao,
            deadline: this.deadline,
            projetoId:2,
            usuario: {
                id: usuarioId
            },
            status: {
                id: statusId
            }
        }
        console.log(atividade);


        const requestInfo = {
            method: 'POST',
            body: JSON.stringify(atividade),
            headers: new Headers({
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            }),
        };

        fetch('http://localhost:4000/atividade', requestInfo )
        .then(response => {
            console.log(response);
            if(response.ok) {
                return response.json()
            }
            throw new Error('Falha ao salvar!');
        })
        .then(data => {
           
        console.log(data);

           return;
        })
    }





    render() {
        return (
            <div className="col-md-6">
                <Header title="Cadastrar Atividade" />
                <hr className="my-3" />

                <Form ref="formAtividade">
                    <FormGroup>
                        <Label for="descricao">Descrição</Label>
                        <Input  onChange={e => this.descricao = e.target.value} type="text" id="descricao" placeholder="Informe a  descrição"></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="deadline">Data Final</Label>
                        <Input
                            onChange={e => this.deadline = e.target.value}
                            type="date"
                            name="deadine"
                            id="deadline"
                            placeholder="data final"
                        />
                    </FormGroup>

                    <Row>
                        <Col xs="6">
                            <FormGroup>
                                <Label for="usuario">Usuário</Label>
                                <Input   onChange={e => this.usuario = e.target.value} type="select" name="usuario" id="usuario">
                                    {this.state.usuarios.map((data, i) =>
                                        <option key={data.id} value={data.id}> {data.email} </option>
                                    )}

                                </Input>
                            </FormGroup>
                        </Col>
                        <Col xs="6">
                            <FormGroup>
                                <Label for="status">Status</Label>
                                <Input onChange={e => this.status = e.target.value} type="select" name="status" id="status">
                                {this.state.status.map((data, i) =>
                                        <option key={data.id} value={data.id}> {data.descricao} </option>
                                    )}
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Button color="primary" block onClick={(e)=>this.salvar(e)}>Cadastrar</Button>
                </Form>
            </div>
        );
    }
}