import React, {Component} from 'react';
import './OrderList.css'

class OrderList extends Component{
    constructor(){
        super()
        this.state = {
            pending_orders:[
                {id: '1', DeliveryAddress: 'National University of Singapore', RestaurantName: 'KFC', FeesOffered: 3, items: ['a', 'b', 'c']},
                {id: '2', DeliveryAddress: 'Changi Airport', RestaurantName: 'Ding TaiFung', FeesOffered: 5, items: ['K', 'da', 'sd']},
                {id: '3', DeliveryAddress: 'Changi Airport', RestaurantName: 'Ding TaiFung', FeesOffered: 5, items: ['K', 'da', 'sd']},
                {id: '4', DeliveryAddress: 'Changi Airport', RestaurantName: 'Ding TaiFung', FeesOffered: 5, items: ['K', 'da', 'sd']},
                {id: '5', DeliveryAddress: 'Changi Airport', RestaurantName: 'Ding TaiFung', FeesOffered: 5, items: ['K', 'da', 'sd']}
            ],
            pickedup_order: [
                {id: '6', DeliveryAddress: 'National University of Singapore', RestaurantName: 'KFC', FeesOffered: 3, items: ['a', 'b', 'c']},
            ]
        }
    }

    render(){
        return(

            <div className='orders' style={{width: '50%', float:'left'}}>
                <h1>All orders</h1>
                <h3 style={{fontSize:'20px', marginBottom:'0px', marginRight:'30%', textAlign:'center'}}>Delivering</h3>
                <nav className='pickedUpOrderList'>
                    <ul style={{overflowY: "scroll"}}>
                    {
                        this.state['pickedup_order'].map(x => 
                        <li>
                            <p>Your order for {x.items.join(', ')} @{x.RestaurantName} with ${x.FeesOffered} delivery ordered is on its way to you! </p>
                        </li>)
                    }
                    </ul>
                </nav>

                <h3 style={{fontSize:'20px', marginBottom:'0px', marginRight:'30%', textAlign:'center'}}>Pending</h3>
                <nav className='pendingOrderList'>
                    <ul style={{overflowY: "scroll"}}>
                    {
                        this.state['pending_orders'].map(x => 
                        <li>
                            <h3> {x.RestaurantName} </h3>
                            <p> Delivery Address: {x.DeliveryAddress} </p>
                            <p> Items: {x.items.join(', ')} ...</p>
                            <form id={x.id}>                        
                                <input placeholder={x.FeesOffered} style={{width: "15%", marginBottom:"2px", marginRight:'2.5px', textAlign:'right'}}/>
                            </form>
                            <button className='editFeesButton' style={{width:"100px"}}>Edit Fees</button>
                            <button className='deleteOrderButton'>Delete</button>
                        </li>)
                    }
                    </ul>
                </nav>
            </div>
        )
    }
}

export default OrderList;