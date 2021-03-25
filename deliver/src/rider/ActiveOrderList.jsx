import React, {Component} from 'react';
import './ActiveOrderList.css'

class ActiveOrderList extends Component{
    constructor(){
        super()
        /**call lists and created orders**/
        this.state = {
            orders:[
                {id: '1', DeliveryAddress: 'National University of Singapore', RestaurantName: 'KFC', FeesOffered: 3, items: ['a', 'b', 'c'], itemNum: [1,2,3]},
                {id: '4', DeliveryAddress: 'Changi Airport', RestaurantName: 'McDonalds', FeesOffered: 5, items: ['K', 'da', 'sd'], itemNum: [1,2,3]},
                {id: '5', DeliveryAddress: 'Changi Airport', RestaurantName: 'McDonalds', FeesOffered: 5, items: ['K', 'da', 'sd'], itemNum: [1,2,3]}
            ]
        }
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
                <ul> 
                {
                    this.state['orders'].map(x => 
                    <li>
                     <h3> {x.RestaurantName} </h3>
                     <p> {x.DeliveryAddress} </p>
                     <p> Items: {x.items.join(', ')} ...</p>
                     <p> Delivery Fee:  {x.FeesOffered} </p>
                    <button type="button" onClick={() => this.handlePickUp(x.id)}> Pick Up </button>
                    </li>)
                }
                </ul>
            </div>
        )
    }
}

export default ActiveOrderList;