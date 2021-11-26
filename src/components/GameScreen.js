import React, { Component, useState, useEffect, useRef, createRef, forwardRef,useImperativeHandle } from 'react';

import { useNavigate } from 'react-router-dom';

import DataPackage from '../tools/DataPackage';
import { getPlayerId, getPlayerState, getUsername, storePlayerId, storePlayerState, storeUsername } from '../tools/tools';
import { Event } from '../tools/Event';
import { Game } from '../tools/Game';
import Scoreboard from './Scoreboard';
import ChatComponent from './ChatComponent';
import MainButton from './MainButton';


//const client = new W3CWebSocket('ws://127.0.0.1:3001');
/**
 * Hauptsächlich für das Routen zuständig
 */
const GameScreen = forwardRef((props, ref) => {

    const navigate = useNavigate();

    const chatRef = useRef(null);

    const [showScoreboard, setShowScoreboard] = useState(false);

    useEffect(() => {
        if(!props.eventData) {
            navigate('/home');
        }
        document.addEventListener('keydown', keyDownEvents);
        document.addEventListener('keyup', keyUpEvents);
        return () => {
            document.removeEventListener('keydown', keyDownEvents);
            document.removeEventListener('keyup', keyUpEvents);
        }
    }, [showScoreboard]);

    useImperativeHandle(ref, () => ({
        triggerChat() {
            chatRef?.current.newMsg();
        }
    }));

    const changeToSpectator = () => {
        props.send('updateplayerdata', {oldPlayerId: getPlayerId(), playerState: props.PlayerStates.SPECTATOR});
        storePlayerState(props.PlayerStates.SPECTATOR);
    }

    const keyDownEvents = k => {
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

    const renderMainView = () => {
        switch (getPlayerState()) {
            case props.PlayerStates.MOD:
                return(
                    <div>
                        Mod view
                    </div>
                );
            default:
                return (
                    <div className="lobby-screen">
                        <h1>{props.eventData?.title}</h1>
                        <h2>Game starts soon...</h2>
                        <h3>Mod: Hugo</h3>
                        <p>{props.eventPlayerList?.length+" online"}</p>
                        {(getPlayerState() === props.PlayerStates.PLAYER+'')?
                            <div className="center">
                                <MainButton text={"switch to spectator"} onClick={changeToSpectator}></MainButton>
                            </div>
                        :
                            <div className="center">
                                <MainButton text={"request to play"}></MainButton>
                            </div>
                        }
                    </div>
                );
        }
    }

    const renderModView = () => {
        return (
            <div>
                <div className="game-title">
                    <h1>
                        {props.eventData?.title}
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="lobby-grid">
                <div></div>
                {getPlayerState()!==props.PlayerStates?.MOD?
                    renderMainView()
                :
                    renderModView()
                }
            </div>
            {showScoreboard?
                <Scoreboard {...props}></Scoreboard>
            :''}
            <ChatComponent {...props} ref={chatRef}></ChatComponent>
        </div>
    );
});

export default GameScreen
