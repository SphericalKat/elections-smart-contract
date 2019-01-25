import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import energyCredits from './energy_credits';

class App extends Component {
  state = { currentPrice: '',
            balance: '',
            creditsToBuy: '',
            message: ''
  };

  async componentDidMount() {
      const accounts = await web3.eth.getAccounts();
      const currentPrice = await energyCredits.methods.CURRENT_CREDIT_PRICE().call();
      const balance = await energyCredits.methods.getBalance().call({from: accounts[0]});
      this.setState({ currentPrice, balance });
  }

  onBuy = async event => {
      event.preventDefault();
      const accounts = await web3.eth.getAccounts();
      this.setState({message: 'Processing your transaction. Please wait for 15-30 seconds.'});
      await energyCredits.methods.purchaseCredits(Number(this.state.creditsToBuy)).send({
          from: accounts[0],
          value: Number(this.state.currentPrice)*Number(this.state.creditsToBuy)
      });
      this.setState({message: 'Transaction successfully processed.', balance: await energyCredits.methods.getBalance().call({from: accounts[0]})});
  };
  render() {
    return (
      <div>
        <h2>Buy energy credits today!</h2>
        <p>Current energy credit price is {web3.utils.fromWei(this.state.currentPrice, 'ether')} ETH.</p>
        <p>Energy credits in your Account are {this.state.balance}</p>

          <hr/>

          <form onSubmit={this.onBuy}>
              <h4>Buy energy credits today!</h4>
              <div>
                  <label>Amount of energy credits you want to buy</label>
                  <input
                      value={this.state.creditsToBuy}
                      onChange={event => this.setState({creditsToBuy: event.target.value})}
                  />
              </div>
              <button>Buy</button>
          </form>

          <hr/>

          <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
