import React, {Component} from 'react';
import './RiderOrderList.css'

class RiderOrderList extends Component{
    constructor(){
        super()
         {/**call lists and created orders**/}
        this.state = {
            orders:[
                {DeliveryAddress: 'National University of Singapore', 
                RestaurantName: 'KFC', 
                FeesOffered: 3},
                {DeliveryAddress: 'Changi Airport', 
                RestaurantName: 'Ding TaiFung', 
                FeesOffered: 3}
            ]
        }
    }

    handleDelivered(event){
        const token = prompt('Please enter customer token for verification.');
        token.preventDefault();
        /**call backend!!!!**/
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
                     <p> Delivery Fee:  {x.FeesOffered} </p>
                     <button type="button" onClick={this.handleDelivered}> Delivered </button>
                    </li>)
                }
                </ul>
            </div>
        )
    }
}

export default RiderOrderList;