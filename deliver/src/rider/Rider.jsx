import React, {Component} from 'react'
import ActiveOrderList from './ActiveOrderList'
import RiderOrderList from './RiderOrderList'
import CompletedOrders from './CompletedOrders'
import './Rider.css'
import {BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom'


class Rider extends Component {
    constructor(props) {
        super(props)

        this.state = {
            AccountNumber: this.props.location.state ? this.props.location.state.AccountNumber: '' ,
            IsCustomer: this.props.location.state ? this.props.location.state.IsCustomer: '',
            pending_orders: []
        }
    }

    render() {
        if (this.state.IsCustomer === false) {
            return (
                <div className='riderApp' style={{width:'100%'}}>
                    <header style={{ background: '#4B9CD3', color: '#fff', padding: '10px 20px' }}> DEliver | Rider </header>
                        <div style={{paddingLeft:'20px', width: '48%', float:'left'}}>
                            <ActiveOrderList/>
                        </div>
                        <div style={{width: '48%', float:'right',paddingRight:'20px'}}>
                            <RiderOrderList/>
                            <CompletedOrders/>
                        </div>
                </div>
            );  
        } else {
            return <Redirect to="/voting"></Redirect>
        }
        
    }
}

export default Rider;