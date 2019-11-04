import React from  'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import PrivateRoute from './auth';

import Login from './pages/Login';
import Logout from './pages/Logout';
import Atividade from './pages/Atividade';
import Projeto from './pages/Projeto';

const Routes  = () => (
     <Router>
         <Switch>
             <Route exact path="/" component ={Login}/> lo
             <Route exact path="/logout" component={Logout}/>
             <PrivateRoute path="/atividade/:id" component={Atividade}/>
             <PrivateRoute path="/projeto" component={Projeto}/>
             
         </Switch>
     </Router>
);

export default Routes;