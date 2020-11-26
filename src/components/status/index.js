import React from 'react'

import {
    StatusDiv,
    PotBarLevelContainer,
    PotLevelBar
} from '../../App.styles'

const StatusOn = ['on', 'Connected', '1', true]
const StatusOff = ['off', 'Disconnected', '0', false]

export const StatusComponent = ({ value }) => {
    if(StatusOn.includes(value)) {
      return <StatusDiv backgroundColor={`green`} />
    } else if(StatusOff.includes(value)) {
      return <StatusDiv backgroundColor={`red`} />
    } else return <StatusDiv backgroundColor={`gray`} />
}

export const PotStatusComponent = ({ level }) => (
    <PotBarLevelContainer>
      <PotLevelBar level={level} />
    </PotBarLevelContainer>
  )
  