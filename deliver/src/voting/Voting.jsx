import React, {Component} from 'react'
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom'
import axios from 'axios';
import './VotingForm.css'


class Voting extends Component {
    constructor() {
        super()
        this.state={
            AccountNumber: '',
            CustomerOrRider: '',
            Content: [],
            Supporting: 'Rider'
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitAccountNumber = this.handleSubmitAccountNumber.bind(this);
    }
    


    handleChange(event){
        const value = event.target.value;
        if (event.target.name === 'AccountNumber') {
            this.setState({
                AccountNumber: value
            }, ()=>{
                console.log(this.state.AccountNumber)
            })
        } else {   
            this.setState({
                ...this.state,
                [event.target.name]: value
            }, ()=> console.log(this.state.Supporting))
        }
    }

    handleSubmitAccountNumber(event){
        // need to retrieve information on whether this account is a customer or rider
        
        if (this.state.AccountNumber === ''){
            alert('Please enter account number!')
        } 

        const payload = {
            "user": this.state.AccountNumber
        }
        
        axios.post('http://localhost:5000/customer/isCustomer', payload).then(res=> {
            console.log(res.data.customer)
            this.setState({flag: res.data.customer})
            if (res.data.customer) {
                this.setState({
                    CustomerOrRider: "Customer"
                })
            } else {
                this.setState({CustomerOrRider: "Rider"})
            }
            console.log(this.state)
        })
        .catch(error => {console.log(error)})

        fetch('http://localhost:5000/voting/getConflict',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then((response) => response.json())
        .then(list => {
            this.setState({ Content: list });
        });
        
        event.preventDefault();
    }


    handleVote(id){
        const data = { 
            user: this.state.AccountNumber,
            vote: this.state.Supporting === 'Customer' ? true : false,
            orderId: id
        };
        fetch('http://localhost:5000/voting/vote',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(res => res.json())
        .catch(error => {console.log(error)})
    }

    // 1. get a random conflict 
    // 2. render the information for random conflict
    // 3. get information from form when user clicks on Vote button
    // 4. check whether the user is a customer or rider, redirect to the approprite page
    // 5. update the votes for the conflict
    render() {
        if (this.state.CustomerOrRider === '') {
            return (
                <div className='votingApp'>
                    <header style={{ background: '#4B9CD3', color: '#fff', padding: '10px 20px' }}> DEliver | Voting </header>
                    <form className='votingForm'>
                        <input name='AccountNumber' className='form-input' style={{marginLeft:"14%" ,display:"block", top:"40%", textAlign:'center', alignContent:'center', position:"absolute"}} type='text' placeholder='Enter your account number' onChange={this.handleChange}/>    
                        <button className='form-input-btn' type='submit' style={{marginLeft:"14%", top:"50%", position:"absolute", display:"block", alignContent:'center'}} onClick={this.handleSubmitAccountNumber}>
                            Submit
                        </button>
                    </form>
                </div>            
            );
        }
        else{
            if (this.state.Content.length === 0) {
                return <Redirect to={{
                    pathname: this.state.CustomerOrRider === 'Customer' ? '/customer' : '/rider',
                    state: {
                        AccountNumber: this.state.AccountNumber,
                        IsCustomer: this.state.CustomerOrRider === 'Customer' ? true : false
                    }
                }}></Redirect>
            } else {
                return (
                    <div className='votingApp'>
                        <header style={{ background: '#4B9CD3', color: '#fff', padding: '10px 20px' }}> DEliver | Voting </header>
                        <form className='votingForm'>
                            {
                                <li style={{textAlign:'center', font:'serif', whiteSpace:'pre-line', marginTop:"100px", marginLeft:"20px", marginRight:"20px"}}>
                                    <p style = {{fontSize: 18}}>Restaurant: {this.state.Content["restaurant"]}</p>
                                    <p style = {{fontSize: 18}}>Food Fee: {this.state.Content["foodFee"]}</p>
                                    <p style = {{fontSize: 18}}>Delivery Fee: {this.state.Content["deliveryFee"]}</p>
                                    <p style = {{fontSize: 18}}>Customer Complaint: {this.state.Content["customerComplaint"]}</p>
                                    <p style = {{fontSize: 18}}>Rider Complaint: {this.state.Content["riderComplaint"]}</p>
                                </li>
                            }
                            <label className='form-label' style={{marginLeft:"33%" ,display:"block", top:"60%", textAlign:'center', alignContent:'center', position:"absolute", display:"block", fontWeight:"bold"}}>Who do you support?</label>
                            <select name='Supporting' style={{textAlign:'center', top: "70%", borderRadius: "2px", height: "36px", width: "300px", display:"inline-block", marginLeft:"27%", position:"absolute"}} onChange={this.handleChange}>
                                <option>Rider</option>
                                <option>Customer</option>
                            </select>
                            <Link to={{
                                pathname: this.state.CustomerOrRider === 'Customer' ? '/customer' : '/rider',
                                state: {
                                    AccountNumber: this.state.AccountNumber,
                                    IsCustomer: this.state.CustomerOrRider === 'Customer' ? true : false
                                }
                            }} className='form-input-btn' type='submit' onClick={this.handleVote(this.state.Content["orderId"])} style={{ height: '30px' ,textAlign:'center', textDecoration:"none", marginLeft:"14%", paddingTop:"2.5%", top:"80%", position:"absolute", display:"block", alignContent:'center'}}>
                                Vote
                            </Link>
                        </form>
                    </div>            
                );
            }

        }
    }
}

export default Voting;
