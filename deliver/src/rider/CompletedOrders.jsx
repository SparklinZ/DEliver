import React, {Component} from 'react';
import './CompletedOrders.css'

class CompletedOrders extends Component{
    constructor(){
        super()
        /**call lists and created orders**/
        this.state = {
            orders:[
                {id: '3', DeliveryAddress: 'Changi Airport', RestaurantName: 'Ding TaiFung', FeesOffered: 5, items: ['K', 'da', 'sd']},
                {id: '2', DeliveryAddress: 'Marina Bay Sands', RestaurantName: 'Pizza Hut', FeesOffered: 5, items: ['K', 'da', 'sd'], customer: '63FaC9201494f0bd17B9892B9fae4d52fe3BD377'},
            ]
        }
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

    render(){
        return(
            <div className='taskReport'>
                <h1> Delivery History </h1>
                <ul> 
                {
                    this.state['orders'].map(x => 
                    <li>
                     <h3> {x.RestaurantName} </h3>
                     <p> {x.DeliveryAddress} </p>
                     <p> Items: {x.items.join(', ')} ...</p>
                     <p> Delivery Fee:  {x.FeesOffered} </p>
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