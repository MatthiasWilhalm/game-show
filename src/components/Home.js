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
import MainButton from './MainButton';


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
            new Game("Quiz Show", "bla bla", "quiz", false, {}),
            new Game("Bingo", "bla bla bla", "bingo", true, {}),
            new Game("Text erraten", "bla bla bla", "queue", false, {
                skipAfterOneTry: false,
                rounds: [
                    {
                        hints: [
                            {
                                text: "AAA",
                                url: "",
                                urlType: "none"
                            },
                            {
                                text: "BBB",
                                url: "",
                                urlType: "none"
                            }
                        ],
                        answer: "Obama"
                    },
                    {
                        hints: [
                            {
                                text: "111",
                                url: "",
                                urlType: "none"
                            },
                            {
                                text: "222",
                                url: "",
                                urlType: "none"
                            }
                        ],
                        answer: "reeeeeeeee"
                    }
                ]
            })
        ]);
        props.send('createandjoinevent', event);
    }

    const joinEvent = eventId => {
        props.send('joinevent', {"eventId": eventId});
    }

    return (
        <div>
            <div className="change-username">
                <input value={newUsername} onChange={e => setNewUsername(e.target.value)}></input>
                <button onClick={saveNewUsername}>Update Username</button>
            </div>
            <div className="home-grid">
                <div></div>
                <div className="panel centered-panel">
                    <ul className="small-list clickable-list">
                        {eventList.map(a =>
                            <li onClick={() => joinEvent(a.eventId)}>
                                <div>{a.title}</div>
                                <div>{a.online}</div>
                            </li>    
                        )}
                    </ul>
                </div>
                <div className="home-main-button-array">
                    <MainButton onClick={createTestEvent} text={"Open Event"}/>
                    <MainButton onClick={null} text={"Editor"}/>
                    {/* <button onClick={createTestEvent} className="main-button">Create Event</button>
                    <button onClick={null} className="main-button">Event Editor</button> */}
                </div>
            </div>
        </div>
    );
});

export default Home
