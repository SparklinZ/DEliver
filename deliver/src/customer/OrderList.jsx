import React, {Component} from 'react';
import axios from 'axios';
import './OrderList.css'

class OrderList extends Component{
    constructor(props){
        super(props)
        this.state = {
            AccountNumber: this.props.AccountNumber,
            pending_orders: [],
            pickedup_order: []
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleEditFee = this.handleEditFee.bind(this)
        this.handleDeleteOrder = this.handleDeleteOrder.bind(this)
        this.handleCompleteOrder = this.handleCompleteOrder.bind(this)
        this.handleFileComplain = this.handleFileComplain.bind(this)
    }

    componentDidMount() {
        const payload = {
            "user": this.state.AccountNumber
        }

        axios.post('http://localhost:5000/customer/getNotPickedUpOrders', payload)
                    .then(res => {
                        console.log(res.data)
                        this.setState({pending_orders: res.data})
                        const state = this.state
                        this.state.pending_orders.map(order=>state[order.orderId]=order.deliveryFee)
                        this.setState(state)
                    }).then(res => console.log(this.state))

        axios.post('http://localhost:5000/customer/getPickedUpOrders', payload)
        .then(res => {
            console.log(res.data)
            this.setState({pickedup_order: res.data})
            const state = this.state
            this.state.pickedup_order.map(order=>state[order.orderId]='')
            this.setState(state)
        }).then(res => console.log(this.state))
    }

    handleChange(event){
        const value = event.target.value
        event.preventDefault();
        this.setState({
            ...this.state,
            [event.target.name]: value
        })
        event.preventDefault();
    }

    handleEditFee(event){
        const order_id = event.target.title
        const deliveryFee = this.state[order_id]
        const accountNumber = this.state.AccountNumber
        const payload = {
            "orderId": order_id,
            "deliveryFee": deliveryFee,
            "user": accountNumber
        }
        if (deliveryFee) {
            axios.post('http://localhost:5000/customer/updateOrder', payload).then(res => console.log(res))
            window.location.reload();
            event.preventDefault();            
        } else {
            alert("Please enter a fee!")
        }
    }

    handleDeleteOrder(event){
        const order_id = event.target.title
        const accountNumber = this.state.AccountNumber
        const payload = {
            "orderId": order_id,
            "user": accountNumber
        }
        axios.post('http://localhost:5000/customer/deleteOrder', payload).then(res => console.log(res))
        window.location.reload();
        event.preventDefault();
    }


    handleCompleteOrder(event){
        const order_id = event.target.title
        const accountNumber = this.state.AccountNumber
        const payload = {
            "orderId": order_id,
            "user": accountNumber
        }

        alert("Order: " + order_id + " has been closed!")
        axios.post('http://localhost:5000/customer/receivedOrder', payload).then(res => console.log(res))
        window.location.reload();
        event.preventDefault();
    }


    handleFileComplain(event){
        const order_id = event.target.title
        const accountNumber = this.state.AccountNumber
        const complaint = this.state[order_id]
        const payload = {
            "orderId": order_id,
            "complaint": complaint,
            "user": accountNumber
        }

        alert("You have filed for a complain!")
        axios.post('http://localhost:5000/voting/complain', payload).then(res => console.log(res))
        window.location.reload();
        event.preventDefault();
    }

    render(){
        return(
            <div className='orders' style={{width: '50%', float:'left'}}>
                <h1>All orders</h1>
                <h3 style={{fontSize:'20px', marginBottom:'0px', marginRight:'30%', textAlign:'center'}}>Delivering</h3>
                <nav className='pickedUpOrderList'>
                    <ul style={{overflowY: "scroll"}}>
                    {
                        this.state['pickedup_order'].map(x => 
                        <li>
                            <form>
                                <p>Your order for {x.itemNames.join(', ')} @{x.restaurant} with ${x.deliveryFee} delivery ordered is on its way to you! </p>
                                <textarea name={x.orderId} type='text' style={{width: "80%", height:"40px", marginBottom:"2px", marginRight:'2.5px', textAlign:'right'}} value={this.state[x.orderId]} onChange={this.handleChange}/>
                                <br/>
                                <button title={x.orderId} className='editFeesButton' type='submit' style={{width:"200px", paddingBottom:'5px'}} onClick={this.handleCompleteOrder}>Complete Order</button>
                                <br/>
                                <button title={x.orderId} className='deleteOrderButton' type='submit' style={{width:"200px"}} onClick={this.handleFileComplain}>File Complain</button>
                            </form>
                        </li>)
                    }
                    </ul>
                </nav>

                <h3 style={{fontSize:'20px', marginBottom:'0px', marginRight:'30%', textAlign:'center'}}>Pending</h3>
                <nav className='pendingOrderList'>
                    <ul style={{overflowY: "scroll"}}>
                    {
                        this.state['pending_orders'].map(x => 
                        <li>
                            <h3> {x.restaurant} </h3>
                            <p> Delivery Address: {x.deliveryAddress} </p>
                            <p> Items: {x.itemNames.join(', ')} ...</p>
                            <form>                        
                                <input name={x.orderId} min="0" type='number' placeholder={x.deliveryFee} style={{width: "15%", marginBottom:"2px", marginRight:'2.5px', textAlign:'right'}} value={this.state[x.orderId]} onChange={this.handleChange}/>
                                <br/>
                            <button title={x.orderId} className='editFeesButton' type='submit' style={{height:"30px", width:"150px"}} onClick={this.handleEditFee}>Edit Fees</button>
                            <button title={x.orderId} className='deleteOrderButton' type='submit' style={{height:"30px", width:"100px"}} onClick={this.handleDeleteOrder}>Delete</button>
                            </form>
                        </li>)
                    }
                    </ul>
                </nav>
            </div>
        )
    }
}

export default OrderList;