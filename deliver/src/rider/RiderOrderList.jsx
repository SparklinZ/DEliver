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
            this.setState({ orders: list.reverse() });
        });
    }

    /*handleDelivered(id){
        alert("Completed Order [ID:" + id + "].");
        const data = { user: this.state.riderId };
        //const token = prompt('Please enter customer token for verification.');
        fetch('http://localhost:5000/rider/deliveredOrder',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(res => res.json())
        .catch(error => {console.log(error)})
    }*/

    handleComplaint(id){
        const token = prompt('Please submit supporting evidence along with your complaint.');
        const data = { 
            user: this.state.riderId
         };
        //const token = prompt('Please enter customer token for verification.');
        fetch('http://localhost:5000/rider/deliveredOrder',{
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
            string += quantity[i] + "=" + names[i]
            if (i != names.length-1) {
                string += ", "
            } 
        };
        return string;
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
                     <p> Food Items: { this.listItems(x.itemNames, x.itemQuantities) } </p>
                     <p> Delivery Fee:  {x.deliveryFee} </p>
                     <p> Timestamp: { this.convertTime(x.orderTime) } </p>
                     <button name="complain" type="button" onClick={() => this.handleComplaint(x.customer)}> File Complaint  </button>
                    </li>)
                }
                </ul>
            </div>
        )
    }
}

export default RiderOrderList;