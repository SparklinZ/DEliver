import React, {Component} from 'react';
import './CompletedOrders.css'

class CompletedOrders extends Component{
    constructor(){
        super()
        /**call lists and created orders**/
        this.state = {
            riderId: 2,
            orders:[
                //{id: '3', DeliveryAddress: 'Changi Airport', RestaurantName: 'Ding TaiFung', FeesOffered: 5, items: ['K', 'da', 'sd']},
                //{id: '2', DeliveryAddress: 'Marina Bay Sands', RestaurantName: 'Pizza Hut', FeesOffered: 5, items: ['K', 'da', 'sd'], customer: '63FaC9201494f0bd17B9892B9fae4d52fe3BD377'},
            ]
        }
    }

    componentDidMount() {
        const data = { user: this.state.riderId };
        fetch('http://localhost:5000/rider/deliveredOrder',{
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

    handleReview(customer){
        const token = prompt('Rate customer a scale from 1 to 5 with 1 being the most unsatisfactory to 5 being most satisfactory.');
        if (token < 5 & token > 0 ) {
            // call backend with review s
            alert("Review successful.");
        } else {
            alert("Invalid Review Rating. Please Try Again.");
        }
    }

    handleComplaint(customer){
        const token = prompt('Please submit supporting evidence along with your complaint.');
        if (token) {
            // call backend with review s
            alert("Complaint successful.");
        } else {
            alert("Invalid Complaint. Please Try Again.");
        }
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
            <div className='taskReport'>
                <h1> Delivery History </h1>
                <ul style = {{overflowY: "scroll"}, {height: "280px"}}> 
                {
                    this.state.orders.map(x => 
                    <li>
                     <h3> {x.restaurant} </h3>
                     <p> {x.deliveryAddress} </p>
                     <p> Food Items: { this.listItems(x.itemNames, x.itemQuantities) } </p>
                     <p> Food Fee:  {x.foodFee} </p>
                     <p> Delivery Fee:  {x.deliveryFee} </p>
                     <p> Timestamp: { this.convertTime(x.orderTime) } </p>
                     <button name="review" type="button" onClick={() => this.handleReview(x.customer)}> Review Customer </button>
                     <button name="complain" type="button" onClick={() => this.handleComplaint(x.customer)}> File Complaint  </button>
                    </li>)
                }
                </ul>
            </div>
        )
    }
}

export default CompletedOrders;