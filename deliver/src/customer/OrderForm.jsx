import React, {Component} from 'react';
import axios from 'axios';
import './OrderForm.css'
 
// import ReactScrollableList from 'react-scrollable-list';

class OrderForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
                        TotalAmountFood: '',
                        DeliverAddress: '',
                        RestaurantName: '',
                        FeesOffered: '',
                        ItemIndex: 0,
                        tempItem: 'Default',
                        tempQuantity: '1',
                        OrderItem: [],
                        Quantity: [],
                        AccountNumber: this.props.AccountNumber
                    };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddNewItem = this.handleAddNewItem.bind(this);
        this.handleResetItemList = this.handleResetItemList.bind(this);
        console.log(this.state)
    }

    handleChange(event){
        const value = event.target.value;
        if (event.target.name === 'OrderItem') {
            this.setState({
                tempItem: value
            })
        } else {   
            if (event.target.name === 'Quantity') {
                this.setState({
                    tempQuantity: value
                })
            }
            else {
                this.setState({
                    ...this.state,
                    [event.target.name]: value
                })
            }
        }
    
    // console.log(this.state)
    }

    handleSubmit(event){
        const payload = {
            "restaurant": this.state.RestaurantName,
            "deliveryFee": this.state.FeesOffered,
            "deliveryAddress": this.state.DeliverAddress,
            "itemNames": this.state.OrderItem,
            "itemQuantities": this.state.Quantity.map(Number),
            "user": this.state.AccountNumber
        }

        var check = true
        for(const prop in payload) {
            if (payload[prop]) {

            } else {
                check = false
            }
        }

        if (payload.itemNames.length == 0){
            check = false
        }

        if (check) {
            alert('Submitting a new order: ' + this.state.RestaurantName);
            axios.post('http://localhost:5000/customer/createOrder', payload)
            .then(res => res.json())
            .catch(error => {console.log(error)})
            window.location.reload();
            event.preventDefault();            
        } else {
            alert("Do not leave any field empty!")
            event.preventDefault();
        }

    }

    handleAddNewItem(event){
        // alert('Adding new item: '+ this.state.Quantity);
        if (!this.state.tempItem || this.state.tempItem === 'Default') {
            alert('Please enter correct item name!')
        }
        else {
            var newArrayOrderItem = Array.from(this.state.OrderItem);
            newArrayOrderItem[this.state.ItemIndex] = this.state.tempItem
            var newArrayOrderQuantity = Array.from(this.state.Quantity);
            newArrayOrderQuantity[this.state.ItemIndex] = this.state.tempQuantity

            const newCounter = this.state.ItemIndex + 1

            this.setState({
                OrderItem: newArrayOrderItem,
                Quantity: newArrayOrderQuantity,
                ItemIndex: newCounter
            }, () => {
                console.log(this.state)
            })
        }
        event.preventDefault();
    }

    handleResetItemList(event) {
        alert('Reset item list');
        this.setState({
            OrderItem: [],
            Quantity: [],
            ItemIndex: 0
        }, () => {
            console.log(this.state)
        })
        event.preventDefault();
    }


    render() {
        // if no active order, return this
        return (
            <div>
                <form className='form' style={{width: '50%', float:'right'}}>
                    <h1>Submit Order</h1>
                    <h3 style={{fontSize:'20px', marginBottom:'0px', marginRight:'35%', textAlign:'left'}}>Items</h3>
                    <nav className='addItemFormNav'>
                        <ul className='itemList'>
                            {
                                this.state.OrderItem.map((item, index) => 
                                    <li key={index}>
                                        <text> {item} x {this.state.Quantity[index]}</text>
                                    </li>
                                )
                            }

                        </ul>
                    </nav>
                    <a style={{fontSize:"10px"}}>*Scroll down to view more</a>

                    <div className='form=inputs'>
                        <label className='form-label'>Add new item</label>
                        <input name='OrderItem' style={{ marginLeft: "1%", marginBottom: "0.5rem", borderRadius: "2px", paddingLeft: "10px", height: "30px", width: "27%" }} type="text" placeholder="Item Name" onChange={this.handleChange}/>
                        <label className='form-label' style={{ marginLeft: "10px" }}>Quantity</label>
                        <select name='Quantity' style={{ marginLeft: "1%", marginBottom: "0.5rem", borderRadius: "2px", paddingLeft: "10px", height: "36px", width: "8%" }} onChange={this.handleChange}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                        </select>
                        <div style={{ justifyContent: "center" }}>
                            <button type='submit' class="action_btn addItem" onClick={this.handleAddNewItem}> Add Item </button>
                            <button type='submit' class="action_btn resetList" onClick={this.handleResetItemList}> Reset </button>
                        </div>
                    </div>
                </form>

                <form className='form' style={{width: '50%', float:'right'}}>
                    <div className='form=inputs'>
                        <label className='form-label'>Total Amount For Food</label>
                        <input className='form-input' type='number' step='0.50' min='0' name='TotalAmountFood' placeholder='Enter total amount for all food items above' value={this.state.TotalAmountFood} onChange={this.handleChange}/>

                        <label className='form-label'>Delivery Address</label>
                        <input className='form-input' type='text' name='DeliverAddress' placeholder='Enter your address' value={this.state.DeliverAddress} onChange={this.handleChange}/>

                        <label className='form-label'>Restaurant Name</label>
                        <input className='form-input' type='text' name='RestaurantName' placeholder='Enter restaurant name' value={this.state.RestaurantName} onChange={this.handleChange}/>

                        <label className='form-label'>Delivery Fee Offered</label>
                        <input className='form-input' type='number' step='0.05' min='0' name='FeesOffered' placeholder='Enter delivery fee' value={this.state.FeesOffered} onChange={this.handleChange}/>
                    </div>
                    <button className='form-input-btn' type='submit' onClick={this.handleSubmit}>
                        Place order
                    </button>
                </form>
            </div>
        )
    }
}

export default OrderForm;


