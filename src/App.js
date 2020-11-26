import React from 'react';
import socketIOClient from "socket.io-client";
import Switch from '@material-ui/core/Switch'
import Slider from '@material-ui/core/Slider'

import './App.css';
import * as topics from './topics'
import {
  AppContainer,
  RectContainer,
  GridContainer
} from './App.styles'
import Header from './components/header'
import { StatusComponent, PotStatusComponent } from './components/status'

const ENDPOINT = "http://192.168.15.12:3000"
const socket = socketIOClient(ENDPOINT);


function App() {
  const [socketStatus, setSocketStatus] = React.useState(false)
  const [espConnectionStatus, setEspConnectionStatus] = React.useState()
  const [ledStatus, setLedStatus] = React.useState()
  const [switchStatus, setSwitch] = React.useState(false)
  const [potMode, setPotMode] = React.useState(false)
  const [potStatus, setPotStatus] = React.useState('0')
  const [buttonStatus, setButtonStatus] = React.useState()


  const socketEmit = (payload) => {
    return socket.emit('apiSocket', payload)
  }

  React.useEffect(
    () => {
      socket.on('clientSocket', payload => {
        const { topic, message } = payload
        switch(topic) {
          case topics.ESP_CONNECTION_SENDSTATUS:
            return setEspConnectionStatus(message)
          case topics.ESP_LED_SENDSTATUS: 
              setLedStatus(message)
              setSwitch(Boolean(message * 1))
          break
          case topics.ESP_POT_SENDSTATUS:
            return potStatus && setPotStatus(message)
          case topics.ESP_BUTTON_SENDSTATUS:
            return setButtonStatus(message)
          case topics.ESP_POT_SENDCONTROL:
            return updatePotSwitch(message)
          default: return
        }
      })  
    }
    // eslint-disable-next-line
  , [])

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
    return socketEmit({
      topic: topics.ESP_LED_CONTROL,
      message: binaryValue
    })
  }
  const dimLed = (value) => {
    let valueToNumber = value * 1
    let payload = Math.trunc(((valueToNumber)/100)*(1023)).toString()

    return socketEmit({
      topic: topics.ESP_PWMLED_CONTROL,
      message: payload
    })
  }

  const updatePotSwitch = (value) => {
    let newPotSwitchValue
    if(value === 'false') {
      newPotSwitchValue = false
    } else if(value === 'true') {
      newPotSwitchValue = true
    }
    return setPotMode(newPotSwitchValue)
  }

  const handlePotSwitch = (value) => {
    setPotMode(value)
    let valueToSend = value === true ? 'true' : 'false'
    return socketEmit({
      topic: topics.ESP_POT_SETCONTROL,
      message: valueToSend
    })
  }
  const sync = () => {
    return socketEmit({
      topic: topics.ESP_OVERALL_GETSTATUS,
      message: 'Requesting Overall Status'
    })
  }
  return (
      <AppContainer>
        <Header
          socketStatus={socketStatus}
          espConnectionStatus={espConnectionStatus}
          sync={sync}
        />
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
              Node MCU Digital Controlled Led Status: {ledStatus}
            </span>
            <StatusComponent value={ledStatus} />
          </RectContainer>
          <RectContainer>          
            <span>
              Node MCU Led Switch
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
  );
}

export default App;
