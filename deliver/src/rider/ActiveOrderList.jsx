import React, {Component} from 'react';
import './ActiveOrderList.css'

class ActiveOrderList extends Component{
    constructor(){
        super()
        {/**call lists and created orders**/}
        this.state = {
            orders:[
                {DeliveryAddress: 'National University of Singapore', RestaurantName: 'KFC', FeesOffered: 3},
                {DeliveryAddress: 'Changi Airport', RestaurantName: 'Ding TaiFung', FeesOffered: 3},
                {DeliveryAddress: 'Changi Airport', RestaurantName: 'McDonalds', FeesOffered: 6},
                {DeliveryAddress: 'National University of Singapore', RestaurantName: 'Subway', FeesOffered: 8},
            ]
        }
    }

    render(){
        return(
            <div className='activeOrders'>
                <h1> Active Orders</h1>
                <ul> 
                {/**ADD IN ORDERS GET**/}
                {
                    this.state['orders'].map(x => 
                    <li>
                     <h3> {x.RestaurantName} </h3>
                     <p> {x.DeliveryAddress} </p>
                     <p> Delivery Fee:  {x.FeesOffered} </p>
                     {/**ON CLICK --> call pick up order and should be removed from main list**/}
                    <button type="button" >Pick Up</button>
                    </li>)
                }
                </ul>
            </div>
        )
    }
}

export default ActiveOrderList;