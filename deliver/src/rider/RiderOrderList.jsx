import React, {Component} from 'react';
import './RiderOrderList.css'

class RiderOrderList extends Component{
    constructor(){
        super()
        /**call lists and created orders**/
        this.state = {
            orders:[
                {id: '3', DeliveryAddress: 'Changi Airport', RestaurantName: 'Ding TaiFung', FeesOffered: 5, items: ['K', 'da', 'sd']},
            ]
        }
    }

    handleDelivered(id){
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
                <ul> 
                {
                    this.state['orders'].map(x => 
                    <li>
                     <h3> {x.RestaurantName} </h3>
                     <p> {x.DeliveryAddress} </p>
                     <p> Items: {x.items.join(', ')} ...</p>
                     <p> Delivery Fee:  {x.FeesOffered} </p>
                     <button type="button" onClick={() => this.handleDelivered(x.id)}> Delivered </button>
                    </li>)
                }
                </ul>
            </div>
        )
    }
}

export default RiderOrderList;