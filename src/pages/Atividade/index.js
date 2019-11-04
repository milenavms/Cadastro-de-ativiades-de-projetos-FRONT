import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button, Row, Col, Table } from 'reactstrap';

import Header from '../../components/Header';
import moment from "moment";
moment.locale("pt-BR");

export default class Atividade extends Component {
    componentDidMount() {
        const token = localStorage.getItem('token');
        console.log(token);
        this.listaStatus();
        this.listaUsuario();
        this.listaAtividades();


    }

    constructor(props) {
        super(props)
        this.state = {
            projetoId: props.match.params.id,
            usuarios: [],
            status: [],
            atividades: [],
            token: localStorage.getItem('token'),
            statusSelecionado: 0,
            ususarioSelecionado: 0,
            descricao: '',
            deadline: '',
            model: {
                id: 0,
                descricao: '',
                deadline: '',
                projetoId: 0,
                usuario: 0,
                status: 0
            }
        }
    }

    initForm = () => {

        this.setState({
            statusSelecionado: 0,
            ususarioSelecionado: 0,
            model: {
                id : 0,
                descricao : '',
                deadline : '',
                usuario: 0,
                status: 0
            }
        })

    }

    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model });
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
                this.setState({
                    status: data.data,
                    statusSelecionado: data.data[0].id
                });

                console.log(this.state.model);
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
                this.setState({
                    usuarios: data.data,
                    ususarioSelecionado: data.data[0].id
                });

                //console.log(this.state);
            })
            .catch(e => console.log(e));
    }

    listaAtividades = () => {
        const requestInfo = {
            method: 'GET',
            headers: new Headers({
                'x-access-token': this.state.token,
            }),
        };


        fetch('http://localhost:4000/atividade/projeto/'+this.state.projetoId, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Ops! ocorreu um erro");

            })
            .then(data => {
                console.log(data.data);
                this.setState({
                    atividades: data.data
                });


            })
            .catch(e => console.log(e));
    }

    removerAtividade = (id) => {
        const requestInfo = {
            method: 'DELETE',
            headers: new Headers({
                'x-access-token': this.state.token,
            }),
        };


        fetch('http://localhost:4000/atividade/' + id, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Ops! ocorreu um erro");

            })
            .then(data => {
                console.log(data.data);
                this.listaAtividades();
            })
            .catch(e => console.log(e));
    }

    editarAtividade = (data) => {
        this.setState({
            model: {
                id: data.id,
                descricao: data.descricao,
                status: data.statusId,
                usuario: data.usuarioId,
                deadline: data.deadline.substring(0, 10)
            }
        });

        this.state.model.id = data.id;

    }

    salvar = (e) => {
        e.preventDefault();

        var atividade = {
            id: this.state.model.id ? this.state.model.id : 0,
            descricao: this.state.model.descricao,
            deadline: this.state.model.deadline,
            projetoId: this.state.projetoId,
            usuario: {
                id: this.state.model.usuario ? this.state.model.usuario : this.state.ususarioSelecionado
            },
            status: {
                id: this.state.model.status ? this.state.model.status : this.state.statusSelecionado
            }
        }

        var method = this.state.model.id ? 'PUT' : 'POST';

        const requestInfo = {
            method: method,
            body: JSON.stringify(atividade),
            headers: new Headers({
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            }),
        };

        fetch('http://localhost:4000/atividade', requestInfo)
            .then(response => {
                console.log(response);
                if (response.ok) {
                    return response.json()
                }
                this.state.model.id = 0;
                this.initForm();
                throw new Error('Falha ao salvar!');
            })
            .then(data => {
                this.state.model.id = 0;
                console.log(data);
                this.initForm();
                this.listaAtividades();

                return;
            });
    }

    dataFormatada = (data) => {
        var dia = data.substring(8,10);
        var mes = data.substring(5,7);
        var ano = data.substring(0,4);

        return dia+'/'+mes+'/'+ano;
    }

    sair = () => {
        this.props.history.push("/logout");
    }

    render() {
        return (
            <div className="col-md-8">
                <Header title="Cadastrar Atividade" />
                <hr className="my-3" />

                <Form ref="formAtividade">
                    <FormGroup>
                        <Label for="descricao">Descrição</Label>
                        <Input onChange={e => this.setValues(e, 'descricao')} type="text" id="descricao" placeholder="Informe a  descrição" value={this.state.model.descricao}></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="deadline">Data Final</Label>
                        <Input
                            onChange={e => this.setValues(e, 'deadline')}
                            type="date"
                            name="deadine"
                            id="deadline"
                            value={this.state.model.deadline}
                            placeholder="data final"
                        />
                    </FormGroup>

                    <Row>
                        <Col xs="6">
                            <FormGroup>
                                <Label for="usuario">Usuário</Label>
                                <Input onChange={e => this.setValues(e, 'usuario')} value={this.state.model.usuario} type="select" name="usuario" id="usuario" >
                                    {this.state.usuarios.map((data, i) =>
                                        <option key={data.id} value={data.id}> {data.email} </option>
                                    )}

                                </Input>
                            </FormGroup>
                        </Col>
                        <Col xs="6">
                            <FormGroup>
                                <Label for="status">Status</Label>
                                <Input onChange={e => this.setValues(e, 'status')} value={this.state.model.status} type="select" name="status" id="status">
                                    {this.state.status.map((data, i) =>
                                        <option key={data.id} value={data.id}> {data.descricao} </option>
                                    )}
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Button color="primary" block onClick={(e) => this.salvar(e)}>Cadastrar</Button>
                </Form>

                <hr className="my-5" />


                <Table hover>
                    <thead>
                        <tr>
                            <th>Descrição</th>
                            <th>Data Final </th>
                            <th>Responsável</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.atividades.map((data, i) =>
                            <tr key={data.id}>
                                <td>{data.descricao} </td>
                                <td>{ this.dataFormatada(data.deadline)}</td>
                                <td>{data.usuarioEmail}</td>
                                <td>{data.statusDescricao}</td>
                                <td> <Button onClick={() => this.editarAtividade(data)} outline color="info">Editar</Button>{' '}
                                    <Button onClick={() => this.removerAtividade(data.id)} outline color="danger">Excluir</Button> </td>
                            </tr>

                        )}
                    </tbody>
                </Table>

                <hr className="my-5" />

                <Button color="secondary" onClick={() => this.sair()}>Logout</Button>


            </div>
        );
    }
}


