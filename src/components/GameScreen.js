import React, { Component, useState, useEffect, useRef, createRef, forwardRef,useImperativeHandle } from 'react';

import { useNavigate } from 'react-router-dom';

import DataPackage from '../tools/DataPackage';
import { getPlayerId, getPlayerState, getUsername, storePlayerId, storePlayerState, storeUsername } from '../tools/tools';
import { Event } from '../tools/Event';
import { Game } from '../tools/Game';
import Scoreboard from './Scoreboard';


//const client = new W3CWebSocket('ws://127.0.0.1:3001');
/**
 * Hauptsächlich für das Routen zuständig
 */
const GameScreen = forwardRef((props, ref) => {

    const navigate = useNavigate();

    const [showScoreboard, setShowScoreboard] = useState(false);

    useEffect(() => {
        if(!props.eventData) {
            navigate('/home');
        }
        document.addEventListener('keydown', keyDownEvents);
        document.addEventListener('keyup', keyUpEvents);
        console.log(props.eventData);
        console.log(props.eventStatus);
        return () => {
            document.removeEventListener('keydown', keyDownEvents);
            document.removeEventListener('keyup', keyUpEvents);
        }
    }, []);

    useImperativeHandle(ref, () => ({
        // webhook triggers
    }));

    const changeToSpectator = () => {
        props.send('updateplayerdata', {oldPlayerId: getPlayerId(), playerState: props.PlayerStates.SPECTATOR});
        storePlayerState(props.PlayerStates.SPECTATOR);
    }

    const keyDownEvents = k => {
        console.log(k.key);
        if(k.key === 'Tab') {
            k.preventDefault();
            setShowScoreboard(true);
            // console.log(showScoreboard);
        } else if(k.key === 'e') {
            // setShowScoreboard(false);
        }
    }

    const keyUpEvents = k => {
        if(k.key === 'Tab') {
            setShowScoreboard(false);
        }
    }

    return (
        <div>
            Game
            <h1>{props.eventData?.title}</h1>
            <h2>game starts soon...</h2>
            <h3>{props.eventPlayerList?.length+" online"}</h3>
            {(getPlayerState() === props.PlayerStates.PLAYER+'')?
                    <button onClick={changeToSpectator}>switch to spectator</button>
                :
                    <button>TODO: request to play</button>
            }
            {showScoreboard?
                <Scoreboard {...props}></Scoreboard>
            :''}
        </div>
    );
});

export default GameScreen
