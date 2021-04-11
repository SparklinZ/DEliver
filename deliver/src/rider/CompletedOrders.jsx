import React, {Component} from 'react';
import './CompletedOrders.css'

class CompletedOrders extends Component{
    constructor(props){
        super(props)
        this.state = {
            AccountNumber: this.props.AccountNumber,
            orders: []
        }

        this.convertTime = this.convertTime.bind(this)
        this.listItems = this.listItems.bind(this)
    }

    componentDidMount() {
        const data = { user: this.state.AccountNumber };
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
                    </li>)
                }
                </ul>
            </div>
        )
    }
}

export default CompletedOrders;