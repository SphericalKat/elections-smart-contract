import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import election from './election';

class App extends Component {
    state = {
        candidateId: '',
        message: '',
        bjpVotes: 0,
        incVotes: 0,
        aapVotes: 0,
        sipVotes: 0,
        notaVotes: 0
    };

    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        this.setState({
            bjpVotes: await election.methods.candidates(1).call(),
            incVotes: await election.methods.candidates(2).call(),
            aapVotes: await election.methods.candidates(3).call(),
            sipVotes: await election.methods.candidates(4).call(),
            notaVotes: await election.methods.candidates(5).call()
        });
    }

    onVote = async event => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        this.setState({message: 'Casting your vote... Please wait for 15-30 seconds.'});
        try {
            await election.methods.vote(this.state.candidateId).send({from: accounts[0]});
        } catch (e) {
            if (e.toString().includes('revert')) {
                this.setState({ message: 'You may not vote twice.'});
                return
            }
            this.setState({ message: 'Your vote has been successfully cast.'})
        }

        this.setState({message: 'Transaction successfully processed.'});
    };

    render() {
        return (
            <div>
                <h2>Vote for your candidate</h2>

                <hr/>

                <form onSubmit={this.onVote}>
                    <h4>Vote for your preferred candidate. The available options are:</h4>
                    <ol>
                        <li>BJP</li>
                        <li>INC</li>
                        <li>AAP</li>
                        <li>SIP</li>
                        <li>NOTA</li>
                    </ol>

                    <div>
                        <label>S.no of the candidate you want to vote for: </label>
                        <input
                            value={this.state.candidateId}
                            onChange={event => this.setState({candidateId: event.target.value})}
                        />
                    </div>
                    <button>Vote</button>
                </form>

                <hr/>

                <h1>{this.state.message}</h1>

                <hr/>

                <ul>
                    <li>Number of votes for BJP: {this.state.bjpVotes.voteCount}</li>
                    <li>Number of votes for INC: {this.state.incVotes.voteCount}</li>
                    <li>Number of votes for AAP: {this.state.aapVotes.voteCount}</li>
                    <li>Number of votes for SIP: {this.state.sipVotes.voteCount}</li>
                    <li>Number of votes for NOTA: {this.state.notaVotes.voteCount}</li>
                </ul>
            </div>
        );
    }
}

export default App;
