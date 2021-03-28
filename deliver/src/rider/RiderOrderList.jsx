import React, {Component} from 'react';
import './RiderOrderList.css'

class RiderOrderList extends Component{
    constructor(){
        super()
        /**call lists and created orders**/
        this.state = {
            riderId: 1,
            orders:[]
        }
    }

    componentDidMount() {
        const data = { user: this.state.riderId };
        fetch('http://localhost:5000/rider/getOwnOrders',{
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

    handleDelivered(id){
        //change to alert --> to say succesfull
        const token = prompt('Please enter customer token for verification.');
        // call deliveredOrder(id, token);
        /** call backend deliveredOrder and submit with orderID and token **/
        //const successful = true;
        if (token) {
            alert("Delivery Successful.");
        } else {
            alert("Invalid Customer Token.");
        }
    }

    render(){
        return(
            <div className='taskReport'>
                <h1> Task Report </h1>
                <ul style = {{overflowY: "scroll"}, {height: "280px"}}> 
                {
                    this.state.orders.map(x => 
                    <li>
                     <h3> {x.restaurant} </h3>
                     <p> {x.deliveryAddress} </p>
                     <p> Items: {x.itemNames.join(', ')} ...</p>
                     <p> Delivery Fee:  {x.deliveryFee} </p>
                     <button type="button" onClick={() => this.handleDelivered(x.id)}> Delivered </button>
                    </li>)
                }
                </ul>
            </div>
        )
    }
}

export default RiderOrderList;