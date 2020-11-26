import styled from '@emotion/styled'


export const ConnectionStatusContainer = styled('div')`
  align-items: center;
  display: flex;
  margin: auto 2vw;
`

export const AppContainer = styled('div')`
  align-items: center;
  background-color: #282c34;
  color: #282c34;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
`
export const ReactLogoImg = styled('img')`
  height: 10vh;
  width: 10vw;
`

export const RectContainer = styled('div')`
  align-items: center;
  background-color: lightgray;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  flex-direction:${props => props.flexDirection}
`

export const PotBarLevelContainer = styled('div')`
  background-color: white;
  border-radius: 10px;
  height: 5vh;
  width: 80%;
`

export const PotLevelBar= styled('div')`
  background-color: green;
  border-radius: inherit;
  height: 100%;
  width:${props => 100*(props.level*1)/1024}%
` 

export const HeaderWrapper = styled('div')`
  background-color: #5F99BA;
  display: flex;
  position: fixed;
  top: 0;
  width: 100%;
`

export const GridContainer = styled('div')`
  display: grid;
  grid-template-columns: 40% 40%;
  height: 70vh;
  justify-content: space-between;
  width: 90%;
`

export const StatusDiv = styled('div')`
  align-self: center;
  background-color: ${props => props.backgroundColor};
  border-radius: 60%;
  height: 32px;
  margin-left: 1vw;
  width: 32px;
`