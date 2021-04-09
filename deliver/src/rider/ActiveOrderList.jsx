import React, {Component} from 'react';
import './ActiveOrderList.css'

class ActiveOrderList extends Component{
    constructor(props){
        super(props)
        this.state = {
            AccountNumber: this.props.AccountNumber,
            orders: []
        }

        this.fetchOrders = this.fetchOrders.bind(this)
        this.handlePickUp = this.handlePickUp.bind(this)
        this.convertTime = this.convertTime.bind(this)
        this.listItems = this.listItems.bind(this)
    }

    componentDidMount() {
        const data = { user: this.state.AccountNumber };
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
        const data = { user: this.state.AccountNumber };
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
            user: this.state.AccountNumber, 
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

    convertTime(time) {
        const dateObject = new Date(time*1000).toLocaleString();
        return dateObject;
    }

    listItems(names, quantity) {
        var string = "";
        for(let i = 0; i < names.length; i++){
            string += quantity[i] + "x " + names[i]
            if (i != names.length-1) {
                string += ", "
            } 
        };
        return string;
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
                     <p> Food Items: { this.listItems(x.itemNames, x.itemQuantities) } </p>
                     <p> Food Fee:  {x.foodFee} </p>
                     <p> Delivery Fee:  {x.deliveryFee} </p>
                     <p> Timestamp: { this.convertTime(x.orderTime) } </p>
                    <button type="button" onClick={() => this.handlePickUp(x.orderId)}> Pick Up </button>
                    </li>)
                }
                </ul>
            </div>
        )
    }
}

export default ActiveOrderList;