import React from 'react';
import socketIOClient from "socket.io-client";
import Switch from '@material-ui/core/Switch'
import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton';
import SyncIcon from '@material-ui/icons/Sync';

import logo from './logo.svg';
import './App.css';
const ENDPOINT = "http://192.168.15.12:3000"

function App() {
  const[connectionStatus, setConnectionStatus] = React.useState()
  const[ledStatus, setLedStatus] = React.useState()
  const[switchStatus, setSwitch] = React.useState(false)
  const[potMode, setPotMode] = React.useState(false)
  const [potStatus, setPotStatus] = React.useState('0')
  const[buttonStatus, setButtonStatus] = React.useState()
  const socket = socketIOClient(ENDPOINT);
  React.useEffect(() => {
    socket.emit('FromClient', 'Hello, from the front.')
      // eslint-disable-next-line
  }, []);
  React.useLayoutEffect(() => {
    socket.on('esp/led/status', status => setLedStatus(status))
    socket.on('connectionStatus', status => {
      console.log('connection status', status)
      setConnectionStatus(status)
    })
    socket.on('buttonStatus', status => setButtonStatus(status))
    potStatus && socket.on('potStatus', status => setPotStatus(status))
  })
  const ledControl = (value) => {
    setSwitch(value)
    let binaryValue = value ? '1' : '0'
    const operation = {
      '0': {
        status: 0,
        message: 'Turning Led Off'
      },
      '1':{
        status: 1,
        message: 'Turning Led on'
      }
    }
    socket.emit('esp/led/control', operation[binaryValue])
  }
  const dimLed = (value) => {
    socket.emit('rangeTest', value)
  }

  const handlePotSwitch = (value) => {
    setPotMode(value)
    let valueToSend = value === true ? 'true' : 'false'
    socket.emit('potControl', valueToSend)
    console.log('valueToSend', valueToSend)
  }

  const StatusDiv = ({ value }) => {
    if(value === 'on' || value === 'Connected' || value+'' === '1' || value === true) {
      return (
        <div
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'green',
            alignSelf: 'center',
            borderRadius: '60%',
            marginLeft: '1vw'
          }}
        />
      )
    } else if(value === 'off' || value === 'Disconnected' || value+'' === '0' || value === false) {
      return (
        <div
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'red',
            alignSelf: 'center',
            borderRadius: '60%',
            marginLeft: '1vw'

          }}
        />
      )
    } else return (
      <div
      style={{
        width: '32px',
        height: '32px',
        backgroundColor: 'gray',
        alignSelf: 'center',
        borderRadius: '60%',
        marginLeft: '1vw'
      }}
    />
    )
  }

  const sync = () => {
    socket.emit('esp/led/status/get', 'ack')
  }
  console.log('ledStatus', ledStatus)
  return (
    <div className="App">
      <div className="App-header">
        <div style={{
          width: '100%',
          position: 'fixed',
          top: '0',
          backgroundColor: '#5F99BA',
          display: 'flex'
          }} >
            <img src={logo} style={{ width: '10vw', height: '10vh' }} className="App-logo" alt="logo" />
          <p>
          Connection Status:
          </p>
          <StatusDiv value={connectionStatus} />
          <IconButton
          style={{
            position: 'absolute',
            alignSelf: 'center',
            right: '0'
          }}
          onClick={() => sync()}
          >
          <SyncIcon
          fontSize='large'/>
          </IconButton>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '40% 40%',
            justifyContent: 'space-between',
            width:'90%',
            height: '70vh'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid black',
              backgroundColor: 'lightgray',
            }}
            >
              <h3>
                Reading
              </h3>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid black',
              backgroundColor: 'lightgray',
            }}
            >
            <h3>
              Control
            </h3>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid black',
              backgroundColor: 'lightgray',
            }}
            >
            <p>
              Node MCU Led Status: {ledStatus}
            </p>
            <StatusDiv value={ledStatus} />
          </div>
          <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid black',
              backgroundColor: 'lightgray'
            }}>          
            <p>
              Node MCU Led Control
            </p>
            <Switch checked={switchStatus} onClick={(e) => ledControl(e.target.checked)} />
          </div>
          <div style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'space-around',
              border: '2px solid black',
              backgroundColor: 'lightgray',
            }}>          
            <p>Potentiometer status value : {potStatus}</p>
            <div style={{ width: '80%', height: '5vh', backgroundColor: 'white' }}>
              <div style={{ backgroundColor: 'green', height: '100%', width:`${100*(potStatus*1)/1024}%`}} />
            </div>
          </div>
          <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid black',
              backgroundColor: 'lightgray',
            }}>          
            <p>Potentiometer status control</p>
            <Switch checked={potMode} onClick={(e) => handlePotSwitch(e.target.checked)} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid black',
              backgroundColor: 'lightgray',
            }}
            >
            <p>
              Button Status:
            </p>
            <StatusDiv value={buttonStatus} />
          </div>
          <div style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'space-around',
              border: '2px solid black',
              backgroundColor: 'lightgray',
            }}>
          <span style={{ width: '35vw' }}> PWM Led Control </span>
          <Slider
            min={0}
            max={100}
            onChange={(_, value) => dimLed(value)}
            style={{ width: '15vw' }}
          />
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;
