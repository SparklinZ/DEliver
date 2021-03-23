import React, {Component} from 'react'
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom'
import './VotingForm.css'


class Voting extends Component {
    constructor() {
        super()
        this.state={
            AccountNumber: '',
            CustomerOrRider: '',
            Content: 'dasjlauindlausnvufabvuilbfaluivbluadb uhuibnaiubub  dasudbausbdubaubdu auduasdhaushduasudhaus asuhduahsudhuahdas auhduhuhasudhuashdu ahusduahsuhdus',
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
        // the entered account number could be wrong     
        else{
            this.setState({
                // dummy, set to customer mannually
                CustomerOrRider: "Customer"
            })
        }  
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
            return (
                <div className='votingApp'>
                    <header style={{ background: '#4B9CD3', color: '#fff', padding: '10px 20px' }}> DEliver | Voting </header>
                    <form className='votingForm'>
                        <p style={{textAlign:'center', fontSize:'20px',font:'serif', whiteSpace:'pre-line', marginTop:"100px", marginLeft:"20px", marginRight:"20px"}}>{this.state.Content}</p>
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
                        }} className='form-input-btn' type='submit' style={{ height: '30px' ,textAlign:'center', textDecoration:"none", marginLeft:"14%", paddingTop:"2.5%", top:"80%", position:"absolute", display:"block", alignContent:'center'}}>
                            Vote
                        </Link>
                    </form>
                </div>            
            );
        }
    }
}

export default Voting;