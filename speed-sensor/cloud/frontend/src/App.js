import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import KLoginIcon from './_assets/png/KLoginIcon.png';
import Githublogo from './_assets/png/Githublogo.png';

const meshbluDefaultHost = 'knot-test.cesar.org.br';
const meshbluDefaultPort = '3000';

class App extends Component {
  constructor() {
    super();
    this.state = {};
    this.getDevices = this.getDevices.bind(this);
  }

  getDevices() {
    const { uuid } = this.state;
    const { token } = this.state;
    const { host } = this.state;
    const { port } = this.state;

    if (!uuid) {
      window.alert('UUID is mandatory');
      return;
    }
    if (!token) {
      window.alert('TOKEN is mandatory');
      return;
    }

    axios
      .get('devices', {
        headers: {
          'Meshblu-Host': host || meshbluDefaultHost,
          'Meshblu-Port': port || meshbluDefaultPort,
          'Meshblu-Auth-UUID': uuid,
          'Meshblu-Auth-Token': token
        }
      })
      .then(() => {
        window.alert('Authentication confirmed!');
      })
      .catch((error) => {
        window.alert(
          `An error ocurred. Check the information provided and try again. ${error}`
        );
      });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className="git-view-text">
          View on Github.
          </div>
          <a href="https://github.com/CESARBR/knot-samples" className="git-repo-text">
          CESARBR/knot-samples
          </a>
          <img className="git-image" src={Githublogo} alt="KNoT logo" />
        </div>
        <div className="wrapper">
          <img className="knot-logo-image" src={KLoginIcon} alt="KNoT logo" />
          <div className="welcome-text">
          Welcome to the knot web app!
          </div>
          <div className="insert-text">
          To get your devices, insert your credentials!
          </div>
          <div className="server-wrapper">
            <div className="server-text">
              Server Address
            </div>
            <label htmlFor="host">
              <input
                type="text"
                id="host"
                className="server-info-text"
                onChange={e => this.setState({ host: e.target.value })}
                placeholder="knot-test.cesar.org.br"
              />
            </label>
            <div className="host-text">
                HOST
            </div>
            <label htmlFor="port">
              <input
                type="text"
                id="port"
                className="server-info-text"
                onChange={e => this.setState({ port: e.target.value })}
                placeholder="3000"
              />
            </label>
            <div className="port-text">
                PORT
            </div>
          </div>
          <div className="user-wrapper">
            <div className="user-text">
        User Credentials
            </div>
            <label htmlFor="uuid">
              <input
                type="text"
                id="uuid"
                className="user-info-text"
                onChange={e => this.setState({ uuid: e.target.value })}
                placeholder="UUID"
              />
            </label>
            <label htmlFor="token">
              <input
                type="text"
                id="token"
                className="user-info-text"
                onChange={e => this.setState({ token: e.target.value })}
                placeholder="TOKEN"
              />
            </label>
          </div>
          <button type="button" className="btn" onClick={this.getDevices}>
            GET DEVICES
          </button>
        </div>
      </div>
    );
  }
}

export default App;
