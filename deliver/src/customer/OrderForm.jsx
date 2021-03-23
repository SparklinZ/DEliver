import React, {Component} from 'react';
import './OrderForm.css'
// import ReactScrollableList from 'react-scrollable-list';

class OrderForm extends Component {
    constructor() {
        super()
        this.state = {
                        DeliverAddress: '',
                        RestaurantName: '',
                        FeesOffered: '',
                        ItemIndex: 0,
                        tempItem: 'Default',
                        tempQuantity: '1',
                        OrderItem: [],
                        Quantity: [],
                    };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddNewItem = this.handleAddNewItem.bind(this);
        // this.handleResetItemList = this.handleResetItemList.bind(this);
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
        // alert('An order is submitted: ' + this.state.RestaurantName);
        console.log(this.state)
        event.preventDefault();
    }

    handleAddNewItem(event){
        // alert('Adding new item: '+ this.state.Quantity);
        if (!this.state.tempItem || this.state.tempItem === 'Default') {
            alert('Please enter correct item name!')
        }
        else {
            var newArrayOrderItem = Array.from(this.state.OrderItem);
            newArrayOrderItem[this.state.ItemIndex] = this.state.tempItem
            console.log(newArrayOrderItem)
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
        alert('Resetting item list');
        event.preventDefault();
    }

//     handleValidation(){
//         let fields = this.state.fields;
//         let errors = {};
//         let formIsValid = true;
//
//         if (!fields[''])
//
//     }


    render() {
        // if no active order, return this
        return (
            <div>
                <form className='form' style={{width: '50%', float:'right'}}>
                    <h1>Submit Order</h1>
                    <nav>
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