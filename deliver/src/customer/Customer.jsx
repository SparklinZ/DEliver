import React, {Component} from 'react'
import OrderForm from './OrderForm'
import OrderList from './OrderList'

class Customer extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className='customerApp' style={{width:'100%'}}>
                <OrderList/>
                <OrderForm/>
            </div>
        );
    }
}

export default Customer;