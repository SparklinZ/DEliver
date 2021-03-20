import React, {Component} from 'react';
import './OrderForm.css'

class OrderForm extends Component {
    constructor() {
        super()
        this.state = {
                        DeliverAddress: '',
                        RestaurantName: '',
                        FeesOffered: ''
                    };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        const value = event.target.value;
        this.setState({
        ...this.state,
        [event.target.name]: value
        })
    }

    handleSubmit(event){
        alert('An order is submitted: ' + this.state.RestaurantName);
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
            <form className='form' style={{width: '50%', float:'right'}} onSubmit={this.handleSubmit}>
                <h1>Your Order</h1>

                <div className='form=inputs'>
                    <label className='form-label'>Delivery Address</label>
                    <input className='form-input' type='text' name='DeliverAddress' placeholder='Enter your address' value={this.state.DeliverAddress} onChange={this.handleChange}/>

                    <label className='form-label'>Restaurant Name</label>
                    <input className='form-input' type='text' name='RestaurantName' placeholder='Enter restaurant name' value={this.state.RestaurantName} onChange={this.handleChange}/>

                    <label className='form-label'>Delivery Fee Offered</label>
                    <input className='form-input' type='text' name='FeesOffered' placeholder='Enter delivery fee' value={this.state.FeesOffered} onChange={this.handleChange}/>
                </div>

                <button className='form-input-btn' type='submit'>
                    Place order
                </button>

            </form>
        )
    }
}

export default OrderForm;