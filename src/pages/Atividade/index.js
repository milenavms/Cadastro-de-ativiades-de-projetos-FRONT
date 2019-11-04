import React, {Component} from 'react';

import Header from '../../components/Header';

export default class Atividade extends Component{
componentDidMount(){
    const token = localStorage.getItem('token');
    console.log(token);


}


    render(){
        return(
            <div>
                <Header title="Atividade"/>
                <hr className="my-3"/>
            
            </div>
        );
    }
}