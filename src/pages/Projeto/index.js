import React, { Component } from 'react';

import Header from '../../components/Header';

import { Form, FormGroup, Label, Input, Button, Table } from 'reactstrap';


export default class Projeto extends Component {

    constructor(props) {
        super(props)
        this.state = {
            projetos: [],
            token: localStorage.getItem('token'),
            model: {
                id: 0,
                descricao: ''
            }
        }
    }

    componentDidMount() {
        this.listaProjetos();
    }

    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model });
    }

    initForm = () => {
        this.setState({
            model: {
                id: 0,
                descricao: ''
            }
        })

    }

    salvar = (e) => {
        e.preventDefault();

        var projeto = {
            id: this.state.model.id ? this.state.model.id : 0,
            descricao: this.state.model.descricao
        }

        console.log(projeto);

        var method = this.state.model.id ? 'PUT' : 'POST';

        const requestInfo = {
            method: method,
            body: JSON.stringify(projeto),
            headers: new Headers({
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            }),
        };

        fetch('http://localhost:4000/projeto', requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                this.state.model.id = 0;
                this.initForm();
                throw new Error('Falha ao salvar!');
            })
            .then(data => {
                this.initForm();
                this.listaProjetos();
                return;
            });
    }

    editarProjeto = (data) => {
        this.setState({
            model: {
                id: data.id,
                descricao: data.descricao,
            }
        });
    }

    removerProjeto = (id) => {
        const requestInfo = {
            method: 'DELETE',
            headers: new Headers({
                'x-access-token': this.state.token,
            }),
        };


        fetch('http://localhost:4000/projeto/' + id, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Ops! ocorreu um erro");

            })
            .then(data => {
                this.listaProjetos();
            })
            .catch(e => console.log(e));
    }

    listaProjetos = () => {
        const requestInfo = {
            method: 'GET',
            headers: new Headers({
                'x-access-token': this.state.token,
            }),
        };


        fetch('http://localhost:4000/projeto', requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Ops! ocorreu um erro");

            })
            .then(data => {
                console.log(data.data);
                this.setState({
                    projetos: data.data
                });
            })
            .catch(e => console.log(e));
    }

    irParaAtividades = (id) => {
        this.props.history.push("/atividade/" + id);
    }


    sair = () => {
        this.props.history.push("/logout");
    }

    render() {
        return (
            <div className="col-md-8">
                <Header title="Cadastrar Projeto" />
                <hr className="my-3" />
                <Form ref="formProjeto">
                    <FormGroup>
                        <Label for="descricao">Descrição</Label>
                        <Input onChange={e => this.setValues(e, 'descricao')} type="text" id="descricao" placeholder="Informe a  descrição" value={this.state.model.descricao}></Input>
                    </FormGroup>
                    <Button color="primary" block onClick={(e) => this.salvar(e)}>Salvar</Button>
                </Form>
                <hr className="my-5" />
                <Table hover>
                    <thead>
                        <tr>
                            <th>Descrição</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.projetos.map((data, i) =>
                            <tr key={data.id}>
                                <td>{data.descricao} </td>
                                <td> <Button onClick={() => this.editarProjeto(data)} outline color="info">Editar</Button>{' '}
                                    <Button onClick={() => this.removerProjeto(data.id)} outline color="danger">Excluir</Button>{' '}
                                    <Button onClick={() => this.irParaAtividades(data.id)} outline color="primary">Atividades</Button>
                                </td>
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


