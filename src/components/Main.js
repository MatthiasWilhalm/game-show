import useWebSocket from 'react-use-websocket';
import React, { Component, useState, useEffect, useRef, createRef } from 'react';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Redirect,
    withRouter,
    useNavigate
} from "react-router-dom";
import DataPackage from '../tools/DataPackage';
import { getPlayerId, getUsername, storePlayerId, storePlayerState, storeUsername } from '../tools/tools';
import { Event } from '../tools/Event';
import { Game } from '../tools/Game';
import Home from './Home';
import GameScreen from './GameScreen';
import UiTest from './UiTest';


//const client = new W3CWebSocket('ws://127.0.0.1:3001');
/**
 * Hauptsächlich für das Routen zuständig
 */
const Main = () => {
    const PORT = 5110;
    const socketUrl = 'ws://'+window.location.hostname+":"+PORT;

    const PlayerStates = {
        MOD: "mod",
        PLAYER: "player",
        SPECTATOR: "spectator"
    }

    const refHome = createRef();
    const refGame = createRef();

    const navigate = useNavigate();

    const [eventData, setEventData] = useState(null);
    const [eventStatus, setEventStatus] = useState(null);
    const [eventPlayerList, setEventPlayerList] = useState([]);
    const [chatLog, setchatLog] = useState([]);

    useEffect(() => {

    }, [eventData, eventStatus, eventPlayerList, chatLog]);

    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket
    } = useWebSocket(socketUrl, {
        onOpen: e => {
            console.log('WebSocket Client Connected');
        },
        onError: e => {
            console.log('can not connect');
        },
        share: true,
        onMessage: e => {
            let msg = new DataPackage();
            msg.parse(e.data);
            console.log(msg.type);
            switch (msg.type) {
                case 'getplayerid':
                    if(!getPlayerId()) {
                        storePlayerId(msg.payload);
                    }
                    send('updateplayerdata', {oldPlayerId: msg.payload, username: getUsername()});
                    break;
                case 'updateplayerdata':
                    handlePlayerDataUpdate(msg);
                    break;
                case 'createandjoinevent':
                    console.log(msg.payload);
                    break;
                case 'eventupdate':
                    handleEventUpdate(msg);
                    break;
                case 'eventstatusupdate':
                    handleEventStatusUpdate(msg);
                    break;
                case 'geteventlist':
                    if(refHome?.current) {
                        refHome.current.setEvents(msg.payload);
                    }
                    break;
                case 'updateplayerlist':
                    handlePlayerList(msg);
                    break;
                case 'chat':
                    handleChatUpdate(msg);
                    break;
                default:
                    break;
            }

        }
    });
    
    const send = (type, data) => {
        sendMessage(new DataPackage(type, getPlayerId(), data).toString());
    }

    const handleEventUpdate = msg => {
        setEventData(msg.payload);
        if(!window.location.pathname.includes('game'))
            navigate('/game');
    } 

    const handleEventStatusUpdate = msg => {
        console.log(msg.payload);
        setEventStatus(msg.payload);
    } 

    const handlePlayerList = msg => {
        setEventPlayerList(msg.payload);
        if(getPlayerId()) {
            let player = msg.payload?.find(player => player.playerId === getPlayerId());
            if(player) {
                storePlayerState(player.playerState);
            }
        }
    }

    const handlePlayerDataUpdate = msg => {
        if(msg.payload.username) storeUsername(msg.payload.username);
        if(msg.payload.playerState) storePlayerState(msg.payload.playerState); 
    }

    const handleChatUpdate = msg => {
        let log = chatLog;
        if(chatLog.length>100)
            log.shift();
        log.push(msg.payload);
        setchatLog(log);
        refGame?.current.triggerChat();
    }


    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Home send={send} ref={refHome}/>}></Route>
                <Route path="/home" element={<Home send={send} ref={refHome}/>}></Route>
                <Route exact path="/game" element={
                    <GameScreen 
                        send={send}
                        ref={refGame}
                        eventData={eventData}
                        eventStatus={eventStatus}
                        eventPlayerList={eventPlayerList}
                        PlayerStates={PlayerStates}
                        chat={chatLog}
                    />
                }></Route>
                <Route path="/uitest" element={<UiTest/>}></Route>
            </Routes>
        </div>
    );
}

export default Main
