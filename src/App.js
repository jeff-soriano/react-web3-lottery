import './App.css';
import web3 from './web3';
import React, { useEffect, useState } from 'react';
import lottery from './lottery';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [winMessage, setWinMessage] = useState('');

  useEffect(() => {
    async function loadWeb3() {
      const manager = await lottery.methods.manager().call();

      setManager(manager);
      update();
    }

    loadWeb3();
  }, []);

  async function update() {
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    setPlayers(players);
    setBalance(balance);
  }

  async function onSubmit(event) {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    setLoading(true);
    await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei(value, 'ether') });
    update();
    setLoading(false);
  }

  async function onClick() {
    const accounts = await web3.eth.getAccounts();

    setLoading(true);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    update();
    setWinMessage('A winner has been picked!');
    setLoading(false);
  }

  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}.
        There are currently {players.length} people entered,
        competing to win {web3.utils.fromWei(balance, 'ether')} ether!
      </p>
      <hr />
      {loading ? <p>Waiting for transaction to complete...</p> :
        <div>
          <form onSubmit={onSubmit}>
            <h4>Want to try your luck?</h4>
            <div>
              <label>Amount of ether to enter</label>
              <input
                value={value}
                onChange={event => setValue(event.target.value)}>
              </input>
              <button type="submit">Enter</button>
            </div>
          </form>

          <hr />

          <h4>Ready to pick a winner?</h4>
          {winMessage && <h5>{winMessage}</h5>}
          <button onClick={onClick}>Pick a winner!</button>
        </div>
      }
    </div>
  );
}

export default App;
