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
            this.setState({ orders: list.reverse() });
        });
    }

    handlePickUp(id){
        alert("Accepted Order [ID:" + id + "]. Please complete the delivery in an hour.");
        const data = { 
            orderId: id,
            user: this.state.riderId, 
        };
        fetch('http://localhost:5000/rider/pickupOrder',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(res => res.json())
        .catch(error => {console.log(error)})
    }

    render(){
        return(
            <div className='activeOrders'>
                <h1> All Active Orders </h1>
                <ul> 
                {
                    this.state.orders.map(x => 
                    <li>
                     <h3> {x.restaurant} </h3>
                     <p> {x.deliveryAddress} </p>
                     <p> Items: {x.itemNames.join(', ')} ...</p>
                     <p> Delivery Fee:  {x.deliveryFee} </p>
                    <button type="button" onClick={() => this.handlePickUp(x.orderId)}> Pick Up </button>
                    </li>)
                }
                </ul>
            </div>
        )
    }
}

export default ActiveOrderList;