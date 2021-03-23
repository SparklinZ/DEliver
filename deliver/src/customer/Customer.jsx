import React, {Component} from 'react'
import OrderForm from './OrderForm'
import OrderList from './OrderList'

class Customer extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className='customerApp' style={{width:'100%', display: "inline-block"}}>
                <header style={{ background: '#4B9CD3', color: '#fff', padding: '10px 20px' }}> DEliver | Receiver </header>
                <OrderList/>
                <OrderForm/>
            </div>
        );
    }
}

export default Customer;
