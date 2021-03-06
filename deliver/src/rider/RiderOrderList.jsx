import React, {Component} from 'react';
import './RiderOrderList.css'

class RiderOrderList extends Component{
    constructor(props){
        super(props)
        this.state = {
            AccountNumber: this.props.AccountNumber,
            orders: []
        }
        
        this.handleComplaint = this.handleComplaint.bind(this)
        this.convertTime = this.convertTime.bind(this)
        this.listItems = this.listItems.bind(this)
    }

    componentDidMount() {
        const data = { user: this.state.AccountNumber };
        fetch('http://localhost:5000/rider/getOwnOrders',{
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

    handleComplaint(id){
        const token = prompt('Please submit supporting evidence along with your complaint.');
        const data = { 
            complaint: token,
            orderId: id,
            user : this.state.AccountNumber,
         };
        alert("You have filed for a complain!")
        fetch('http://localhost:5000/voting/complain',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(res => res.json())
        .catch(error => {console.log(error)})
        window.location.reload();
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
                <h1> Task Report </h1>
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
                    {
                        x.hasFiledComplain == 1 ? <p style={{color:"red"}}>"RECEIVED COMPLAINT FROM CUSTOMER!" </p> : ""
                    }
                    {
                        x.hasFiledComplain == 2 || x.hasFiledComplain == 3? <p style={{color:"red"}}> "Compaint has been filed!" </p> : <button name="complain" type="button" onClick={() => this.handleComplaint(x.orderId)}> File Complaint  </button>
                    }
                    </li>)
                }
                </ul>
            </div>
        )
    }
}

export default RiderOrderList;