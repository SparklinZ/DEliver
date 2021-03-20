import React from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import Customer from './customer/Customer'
import Rider from './rider/Rider'
import Voting from './voting/Voting'

function App() {
  return (
    <BrowserRouter>
        <switch>
            <Route exact path='/customer' component={Customer}/>
            <Route exact path='/rider' component={Rider}/>
            <Route exact path='/voting' component={Voting}/>
        </switch>

    </BrowserRouter>
  );
}

export default App;

