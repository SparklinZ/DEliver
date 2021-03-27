import React, {Component} from 'react';
import './ActiveOrderList.css'

class ActiveOrderList extends Component{
    constructor(){
        super()
        this.state = {
            riderId: 1,
            orders: []
        }
    }

    componentDidMount() {
        const data = { user: this.state.riderId };
        fetch('http://localhost:5000/rider/getOrders',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then(list => {
            this.setState({ orders: list });
        });
    }

    fetchOrders = () => {
        const data = { user: this.state.riderId };
        fetch('http://localhost:5000/rider/getOrders',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then(list => {
            this.setState({ orders: list });
        });
    }

    handlePickUp(id){
        alert("Accepted Order (ID:" + id + "). Please complete the delivery in an hour.");
        // call pickupOrder(id);
        /** call backend pickUpOrder and submit with orderID **/
    }

    render(){
        return(
            <div className='activeOrders'>
                <h1> All Active Orders </h1>
                <button onClick={this.fetchOrders}> Load New Orders </button>
                <ul> 
                {
                    this.state.orders.map(x => 
                    <li>
                     <h3> {x.restaurant} </h3>
                     <p> {x.deliveryAddress} </p>
                     <p> Items: {x.itemNames.join(', ')} ...</p>
                     <p> Delivery Fee:  {x.deliveryFee} </p>
                    <button type="button" onClick={() => this.handlePickUp(x.id)}> Pick Up </button>
                    </li>)
                }
                </ul>
            </div>
        )
    }
}

export default ActiveOrderList;