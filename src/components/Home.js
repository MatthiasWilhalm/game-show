import React, { Component, useState, useEffect, useRef, createRef, forwardRef, useImperativeHandle, useReducer } from 'react';

import {
    BrowserRouter as Router,
    Link,
    useHistory
} from "react-router-dom";
import DataPackage from '../tools/DataPackage';
import { getPlayerId, getUsername, storePlayerId, storeUsername } from '../tools/tools';
import { Event } from '../tools/Event';
import { Game } from '../tools/Game';
import MainButton from './MainButton';

import iconUser from '../assets/user.svg';
import HomeSidePanel from './SidePanel/HomeSidePanel';


//const client = new W3CWebSocket('ws://127.0.0.1:3001');
/**
 * Hauptsächlich für das Routen zuständig
 */
const Home = forwardRef((props, ref) => {

    const [newUsername, setNewUsername] = useState(getUsername());
    const [eventList, setEventList] = useState([]);
    const [showSidePanel, setShowSidePanel] = useState(false);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const refUpload = createRef();

    useEffect(() => {
        props.send('geteventlist', {});
    }, []);

    useImperativeHandle(ref, () => ({
        updateUsername() {
            setNewUsername(getUsername());
        },
        setEvents(eventList) {
            setEventList(eventList ?? []);
        }
    }));

    const saveNewUsername = () => {
        if(newUsername!==getUsername()) {
            storeUsername(newUsername);
            forceUpdate();
            props.send('updateplayerdata', {oldPlayerId: getPlayerId(), username: getUsername()});
        }
    }

    const isUsernameSaveable = () => {
        return newUsername!=="" && newUsername !== getUsername();
    }

    const updateNewUsername = username => {
        if(username.length<=16) {
            setNewUsername(username);
        }
    }

    const joinEvent = eventId => {
        props.send('joinevent', {"eventId": eventId});
    }

    return (
        <div>
            <div className="change-username">
                <input value={newUsername} onChange={e => updateNewUsername(e.target.value)}></input>
                <button 
                    onClick={() => isUsernameSaveable()?saveNewUsername():null}
                    className={isUsernameSaveable()?"":"locked"}>
                        Update Username
                </button>
            </div>
            <div className="home-grid">
                <div></div>
                <div className="panel centered-panel">
                    <ul className="small-list clickable-list">
                        {eventList.map(a =>
                            <li onClick={() => joinEvent(a.eventId)}>
                                <div>{a.title}</div>
                                <div>
                                    {a.online}
                                    <img src={iconUser}></img>
                                </div>
                            </li>    
                        )}
                    </ul>
                </div>
            </div>
            <div className="buttom-right-button">
                <MainButton 
                    text={"Moderate Event"}
                    onClick={() => setShowSidePanel(!showSidePanel)}
                />
            </div>
            <HomeSidePanel 
                show={showSidePanel}
                onClose={() => setShowSidePanel(false)}
                send={props.send}
            />
        </div>
    );
});

export default Home
