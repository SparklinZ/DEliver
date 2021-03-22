import React, {Component} from 'react'
import ActiveOrderList from './ActiveOrderList'
import RiderOrderList from './RiderOrderList'
import './Rider.css'


class Rider extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className='riderApp' style={{width:'100%'}}>
                <header> FoodBlockChainApp </header>
                <h1 className='title' > Rider Dashboard  </h1>
                    <div style={{paddingLeft:'20px', width: '48%', float:'left'}}>
                        <ActiveOrderList/>
                    </div>
                    <div style={{width: '48%', float:'right',paddingRight:'20px'}}>
                        <RiderOrderList/>
                    </div>
            </div>
        );
    }
}

export default Rider;