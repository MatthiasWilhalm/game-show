import React, { Component, useState, useEffect, useRef, createRef, forwardRef,useImperativeHandle } from 'react';

import { useNavigate } from 'react-router-dom';

import DataPackage from '../tools/DataPackage';
import { getPlayerId, getPlayerState, getUsername, storePlayerId, storePlayerState, storeUsername } from '../tools/tools';
import { Event } from '../tools/Event';
import { Game } from '../tools/Game';
import Scoreboard from './Scoreboard';
import ChatComponent from './ChatComponent';
import MainButton from './MainButton';
import LobbyPlayerScreen from './LobbyPlayerScreen';
import LobbyModScreen from './LobbyModScreen';
import GameQueuePlayerScreen from './GameQueuePlayerScreen';
import GameQueueModScreen from './GamequeueModScreen';


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

    const renderGameScreen = isMod => {
        let currentId = props.eventStatus?.gameStatus?.findIndex(a => a.current);
        if(currentId!==-1) {
            let type = props?.eventData?.games[currentId]?.type;
            switch (type) {
                case "queue":
                    if(isMod)
                        return (<GameQueuePlayerScreen {...props}/>);
                    else
                        return (<GameQueueModScreen {...props}/>);
            
                default:
                    return(
                        <div>
                            {"null"}
                        </div>
                    );
                    break;
            }
        }


    }

    const renderScreenState = () => {
        
        const isMod = getPlayerState()!==props.PlayerStates?.MOD

        if(!!props.eventStatus?.gameStatus?.find(a => a.current)) {
            return renderGameScreen(isMod);
        } else {
            return (
                <div>
                    {isMod?
                        <LobbyPlayerScreen {...props}/>
                    :
                        <LobbyModScreen {...props}/>
                    }
                </div>
            );
        }
    }

    return (
        <div>
            {renderScreenState()}
            {showScoreboard?
                <Scoreboard {...props}/>
            :''}
            <ChatComponent {...props} ref={chatRef}/>
        </div>
    );
});

export default GameScreen
