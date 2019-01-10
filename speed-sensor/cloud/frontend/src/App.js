import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';
import speedometer from './_assets/png/speedometer.png';
import axios from 'axios'
import { meshbluDefault, backendDefault } from './config';
import openSocket from 'socket.io-client';

const meshbluDefaultHost = meshbluDefault.host;
const meshbluDefaultPort = meshbluDefault.port;

class App extends Component {
  constructor() {
    super();
    this.state = {};
    this.createDeviceCard = this.createDeviceCard.bind(this);
    this.createDeviceList = this.createDeviceList.bind(this);
    this.getDevices = this.getDevices.bind(this);
    this.setNewStartValue = this.setNewStartValue.bind(this);
    this.updateDevice = this.updateDevice.bind(this);
  }

  getDevices() {
    const { uuid } = this.state;
    const { token } = this.state;
    const { host } = this.state;
    const { port } = this.state;
    const backendRoute = `${backendDefault.host}:${backendDefault.port}`;
    const socket = openSocket(backendRoute);

    this.setState({
      socket
    });

    if (!uuid) {
      window.alert('UUID is mandatory'); // eslint-disable-line no-alert
      return;
    }
    if (!token) {
      window.alert('TOKEN is mandatory'); // eslint-disable-line no-alert
      return;
    }

    axios.get('devices', {
      headers: {
        'Meshblu-Host': host || meshbluDefaultHost,
        'Meshblu-Port': port || meshbluDefaultPort,
        'Meshblu-Auth-UUID': uuid,
        'Meshblu-Auth-Token': token
      }
    })
      .then((response) => {
        this.setState({
          devices: response.data
        });
        _.map(response.data, this.updateDevice);
      })
      .catch((error) => { // eslint-disable-next-line no-alert
        window.alert(`An error occured. Check the information provided and try again. ${error}.`);
      });
  }

  updateDevice(device) {
    const { uuid } = this.state;
    const { token } = this.state;
    const { host } = this.state;
    const { port } = this.state;
    const { socket } = this.state;

    const request = {
      meshbluHost: host || meshbluDefaultHost,
      meshbluPort: port || meshbluDefaultPort,
      meshbluAuthUUID: uuid,
      meshbluAuthToken: token
    };

    request.deviceId = device.id;
    socket.on(device.id, (response) => {
      const { devices } = this.state;
      const i = devices.findIndex(element => element.id === response.source);

      devices[i].value = response.data.value;

      this.setState({
        devices
      });
    });
    socket.emit('subscribe', request);
  }

  setNewStartValue(deviceId, sensorId) {
    const { uuid } = this.state;
    const { token } = this.state;
    const { host } = this.state;
    const { port } = this.state;
    const { value } = this.state;

    axios.put(`/devices/${deviceId}/sensors/${sensorId}`, {
      data: {
        value 
      }
    }, {
      headers: {
        'Meshblu-Host': host || meshbluDefaultHost,
        'Meshblu-Port': port || meshbluDefaultPort,
        'Meshblu-Auth-UUID': uuid,
        'Meshblu-Auth-Token': token
      }
    })
      .then(() => { // eslint-disable-next-line no-alert
        window.alert(`Start value modified!.`);
      })
      .catch((error) => { // eslint-disable-next-line no-alert
        window.alert(`An error occured. Check the information provided and try again. ${error}.`);
      });
  }

  createDeviceCard(device) {
    return (
      <div className="online-device" id={device.id} key={device.id}>
        <div class="flex-container">
        <div className="device-info">
          <div className="device-name">
            {device.name}
          </div>
          <div className="device-id">
            {device.id}
          </div>
          <label htmlFor="value">
           <input type="text" id="value" className="device-value-text" onChange={e => this.setState({ value: e.target.value })} />
        </label>        
        <button type="button" className="switch" onClick={() => this.setNewStartValue(device.id, device.sensorid)}>
              SET VALUE
        </button>
        </div>
        <div className="device-value">
          <img src={speedometer} alt="speed-img" width="90" height="70" />
          {device.value}
        </div>
        </div>
      </div>
    );
  }

  createDeviceList() {
    const { devices } = this.state;

    return (
      <div id="online-devices">
        <h1 className="online-devices-header">
          ONLINE DEVICES
        </h1>
        {_.map(devices, this.createDeviceCard)}
      </div>
    );
  }

  render() {
    const { devices } = this.state;

    return (
      <div className="App">
         <div className="header-wrapper">
          <header className="App-header">
            <h1 className="App-title">Welcome to KNoT</h1>
          </header>
        </div>
        <div className="knot-info-wrapper">
          <div className="knot-info">
            <label htmlFor="host">
              MESHBLU HOST
              <input type="text" id="host" className="knot-info-text" placeholder={meshbluDefaultHost} onChange={e => this.setState({ host: e.target.value })} />
            </label>
          </div>
          <div className="knot-info">
            <label htmlFor="port">
              MESHBLU PORT
              <input type="text" id="port" className="knot-info-text" placeholder={meshbluDefaultPort} onChange={e => this.setState({ port: e.target.value })} />
            </label>
          </div>
          <div className="knot-info">
            <label htmlFor="uuid">
              UUID
              <input type="text" id="uuid" className="knot-info-text" onChange={e => this.setState({ uuid: e.target.value })} />
            </label>
          </div>
          <div className="knot-info">
            <label htmlFor="token">
              TOKEN
              <input type="text" id="token" className="knot-info-text" onChange={e => this.setState({ token: e.target.value })} />
            </label>
          </div>
          <button type="button" className="btn" onClick={this.getDevices}>
          GET DEVICES
          </button>
        </div>
        <div className="list-devices-wrapper">
          {_.isEmpty(devices) ? <div /> : <this.createDeviceList className="list-devices" />}
        </div>
      </div>
    );
  }
}

export default App;
