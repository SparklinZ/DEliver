import React from 'react'
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom'
import Customer from './customer/Customer'
import Rider from './rider/Rider'
import Voting from './voting/Voting'

function App() {
  return (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" render ={()=>
            {
              return <Redirect to="/voting"></Redirect>
            }}/>
            <Route path='/customer' render={(props) => <Customer {...props}/> }/>
            <Route path='/rider' component={Rider}/>
            <Route path='/voting' component={Voting}/>

        </Switch>

    </BrowserRouter>
  );
}

export default App;

