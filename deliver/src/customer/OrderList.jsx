import React, {Component} from 'react';
import './OrderList.css'

class OrderList extends Component{
    constructor(){
        super()
        this.state = {
            orders:[
                {DeliveryAddress: 'National University of Singapore', RestaurantName: 'KFC', FeesOffered: 3},
                {DeliveryAddress: 'Changi Airport', RestaurantName: 'Ding TaiFung', FeesOffered: 3}
            ]
        }
    }

    render(){
        return(

            <div className='orders' style={{width: '50%', float:'left'}}>
                <h1>All orders</h1>

                <ul>
                {
                    this.state['orders'].map(x => <li>
                     <h3> {x.RestaurantName} </h3>
                     <p> {x.DeliveryAddress}, {x.FeesOffered} </p>
                    </li>)
                }
                </ul>
            </div>
        )
    }
}

export default OrderList;