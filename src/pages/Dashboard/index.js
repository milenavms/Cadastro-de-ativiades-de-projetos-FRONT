import React, {Component} from 'react';

import Header from '../../components/Header';
import {Link} from 'react-router-dom';

export default class Dashboard extends Component{
componentDidMount(){
    const token = localStorage.getItem('token');
    console.log(token);

    const requestInfo = {
        method: 'GET',
        headers: new Headers({
            'x-access-token': token
        }),
    };


    fetch('http://localhost:4000/status', requestInfo)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new Error("Ops! ocorreu um erro" );

    })
    .then( data => console.log(data))
    .catch(e => console.log(e));
}


    render(){
        return(
            <div>
                <Header title="teste"/>
                <hr className="my-3"/>
                <p/>
                <Link to="/logout" className="btn btn-outline-primary"> Log Out</Link>
            </div>
        );
    }
}