import React, {Component} from 'react'
import ActiveOrderList from './ActiveOrderList'
import RiderOrderList from './RiderOrderList'
import CompletedOrders from './CompletedOrders'
import './Rider.css'


class Rider extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className='riderApp' style={{width:'100%'}}>
                <header style={{ background: '#4B9CD3', color: '#fff', padding: '10px 20px' }}> DEliver | Rider </header>
                <h1 className='title' > Rider Dashboard  </h1>
                    <div style={{paddingLeft:'20px', width: '48%', float:'left'}}>
                        <ActiveOrderList/>
                    </div>
                    <div style={{width: '48%', float:'right',paddingRight:'20px'}}>
                        <RiderOrderList/>
                        <CompletedOrders/>
                    </div>
            </div>
        );
    }
}

export default Rider;