import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import SyncIcon from '@material-ui/icons/Sync';

import { StatusComponent } from '../status'
import logo from '../../logo.svg';


import { HeaderWrapper, ConnectionStatusContainer, ReactLogoImg } from '../../App.styles'

const Header = ({
    socketStatus, espConnectionStatus, sync
}) => {
    return (
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
                onClick={sync}
            >
                <SyncIcon fontSize='large'/>
            </IconButton>
        </HeaderWrapper>
    )
}

export default Header;