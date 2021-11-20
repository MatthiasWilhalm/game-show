import React, { Component, useState, useEffect, useRef, createRef, forwardRef, useImperativeHandle } from 'react';

import {
    BrowserRouter as Router,
    Link,
    useHistory
} from "react-router-dom";
import DataPackage from '../tools/DataPackage';
import { getPlayerId, getUsername, storePlayerId, storeUsername } from '../tools/tools';
import { Event } from '../tools/Event';
import { Game } from '../tools/Game';


//const client = new W3CWebSocket('ws://127.0.0.1:3001');
/**
 * Hauptsächlich für das Routen zuständig
 */
const Home = forwardRef((props, ref) => {

    const [newUsername, setNewUsername] = useState(getUsername());
    const [eventList, setEventList] = useState([]);

    useEffect(() => {
        props.send('geteventlist', {});
    }, []);

    useImperativeHandle(ref, () => ({
        // webhook triggers
        setEvents(eventList) {
            setEventList(eventList ?? []);
        }
    }));

    const saveNewUsername = () => {
        storeUsername(newUsername);
        props.send('updateplayerdata', {oldPlayerId: getPlayerId(), username: getUsername()});
    }


    const createTestEvent = () => {
        let event = new Event("Test Event", [
            new Game("Quiz Show", "bla bla", "quizShow", false, {}),
            new Game("Bingo", "bla bla bla", "bingo", true, {})
        ]);
        props.send('createandjoinevent', event);
    }

    const joinEvent = eventId => {
        props.send('joinevent', {"eventId": eventId});
    }

    return (
        <div>
            <h1>Home</h1>
            <button onClick={createTestEvent}>Create Event</button>
            <input value={newUsername} onChange={e => setNewUsername(e.target.value)}></input>
            <button onClick={saveNewUsername}>Update Username</button>
            <ul>
                {eventList.map(a =>
                    <li onClick={() => joinEvent(a.eventId)}>
                        {a.eventId}
                    </li>    
                )}
            </ul>
        </div>
    );
});

export default Home
