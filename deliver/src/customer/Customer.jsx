import React, {Component} from 'react'
import OrderForm from './OrderForm'
import OrderList from './OrderList'
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom'

class Customer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            AccountNumber: this.props.location.state ? this.props.location.state.AccountNumber: '' ,
            IsCustomer: this.props.location.state ? this.props.location.state.IsCustomer: '',
            pending_orders: []
        }
    }


    render() {
        if (this.state.IsCustomer) {
            return (
                <div className='customerApp' style={{width:'100%', display: "inline-block"}}>
                    <header style={{ background: '#4B9CD3', color: '#fff', padding: '10px 20px' }}> DEliver | Customer </header>
                    <OrderList AccountNumber={this.state.AccountNumber}/>
                    <OrderForm AccountNumber={this.state.AccountNumber}/>
                </div>
            );            
        }
        else{
            return <Redirect to="/voting"></Redirect>      
        }
    }
}

export default Customer;
