import React from 'react';
import socketIOClient from "socket.io-client";
import Switch from '@material-ui/core/Switch'
import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton';
import SyncIcon from '@material-ui/icons/Sync';

import logo from './logo.svg';
import './App.css';
import * as topics from './topics'
import {
  ConnectionStatusContainer,
  AppContainer,
  ReactLogoImg,
  RectContainer,
  PotBarLevelContainer,
  PotLevelBar,
  HeaderWrapper,
  GridContainer,
  StatusDiv
} from './App.styles'

const ENDPOINT = "http://192.168.15.12:3000"


const PotStatusComponent = ({ level }) => (
  <PotBarLevelContainer>
    <PotLevelBar level={level} />
  </PotBarLevelContainer>
)

const StatusComponent = ({ value }) => {
  if(value === 'on' || value === 'Connected' || value+'' === '1' || value === true) {
    return <StatusDiv backgroundColor={`green`} />
  } else if(value === 'off' || value === 'Disconnected' || value+'' === '0' || value === false) {
    return <StatusDiv backgroundColor={`red`} />
  } else return <StatusDiv backgroundColor={`gray`} />
}


function App() {
  const [socketStatus, setSocketStatus] = React.useState(false)
  const[espConnectionStatus, setEspConnectionStatus] = React.useState()
  const[ledStatus, setLedStatus] = React.useState()
  const[switchStatus, setSwitch] = React.useState(false)
  const[potMode, setPotMode] = React.useState(false)
  const [potStatus, setPotStatus] = React.useState('0')
  const[buttonStatus, setButtonStatus] = React.useState()
  const socket = socketIOClient(ENDPOINT);
  const socketEmit = (payload) => {
    return socket.emit('apiSocket', payload)
  }

  React.useCallback(socket.on('clientSocket', payload => {
    const { topic, message } = payload
    switch(topic) {
      case topics.ESP_CONNECTION_SENDSTATUS:
        return setEspConnectionStatus(message)
      case topics.ESP_LED_SENDSTATUS:
        return setLedStatus(message)
      case topics.ESP_POT_SENDSTATUS:
        return potStatus && setPotStatus(message)
      case topics.ESP_BUTTON_SENDSTATUS:
        return setButtonStatus(message)
      default: return
    }
  }), [socket])

  React.useEffect(() => {
    if(socketStatus) {
      socketEmit({
        topic: 'front/presence',
        message: 'Hello from the front'
      })
      sync()
    }
    // eslint-disable-next-line
  }, [socketStatus])

  React.useCallback(socket.on('disconnect', payload => {
    setSocketStatus(false)
  }), [socket])

  React.useCallback(socket.on('connect', payload => {
    setSocketStatus(true)
  }), [socket])

  const ledControl = (value) => {
    setSwitch(value)
    let binaryValue = value ? '1' : '0'
    socketEmit({
      topic: topics.ESP_LED_CONTROL,
      message: binaryValue
    })
  }
  const dimLed = (value) => {
    let valueToNumber = value * 1
    let payload = Math.trunc(((valueToNumber)/100)*(1023)).toString()
    socketEmit({
      topic: topics.ESP_LED_ANALOGWRITE,
      message: payload
    })
  }

  const handlePotSwitch = (value) => {
    setPotMode(value)
    let valueToSend = value === true ? 'true' : 'false'
    socketEmit({
      topic: topics.ESP_POT_CONTROL,
      message: valueToSend
    })
  }
  const sync = () => {
    socketEmit({
      topic: topics.ESP_LED_GETSTATUS,
      message: 'Requesting Led Status'
    })
  }

  return (
    <div className="App">
      <AppContainer>
        <HeaderWrapper>
          <ReactLogoImg className='App-logo' src={logo} alt="logo" />
          <ConnectionStatusContainer>
          <span>Socket Connection Status:</span>
            <StatusComponent value={socketStatus} />
          </ConnectionStatusContainer>
          <ConnectionStatusContainer>
          <span>Esp Connection Status:</span>
            <StatusComponent value={espConnectionStatus} />
          </ConnectionStatusContainer>
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
        </HeaderWrapper>
        <GridContainer>
          <RectContainer>
              <h3>
                Reading
              </h3>
          </RectContainer>
          <RectContainer>
            <h3>
              Control
            </h3>
          </RectContainer>
          <RectContainer>
            <span>
              Node MCU Led Status: {ledStatus}
            </span>
            <StatusComponent value={ledStatus} />
          </RectContainer>
          <RectContainer>          
            <span>
              Node MCU Led Control
            </span>
            <Switch
              disabled={!espConnectionStatus}
              checked={switchStatus}
              onClick={(e) => ledControl(e.target.checked)}
            />
          </RectContainer>
          <RectContainer flexDirection={`column`} >
            <span>Potentiometer status value : {potStatus}</span>
            <PotStatusComponent level={potStatus} />
          </RectContainer>
          <RectContainer>          
            <p>Potentiometer status control</p>
            <Switch
              disabled={!espConnectionStatus}
              checked={potMode}
              onClick={(e) => handlePotSwitch(e.target.checked)}
            />
          </RectContainer>
          <RectContainer>
            <span>
              Button Status:
            </span>
            <StatusComponent value={buttonStatus} />
          </RectContainer>
          <RectContainer flexDirection={`column`} >
            <span> PWM Led Control </span>
            <Slider
              disabled={!espConnectionStatus}
              min={0}
              max={100}
              onChange={(_, value) => dimLed(value)}
              style={{ width: '15vw' }}
            />
          </RectContainer>
        </GridContainer>
      </AppContainer>
    </div>
  );
}

export default App;
