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


//const client = new W3CWebSocket('ws://127.0.0.1:3001');
/**
 * Hauptsächlich für das Routen zuständig
 */
const Home = forwardRef((props, ref) => {

    const [newUsername, setNewUsername] = useState(getUsername());
    const [eventList, setEventList] = useState([]);

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

    const createTestEvent = () => {
        refUpload?.current.click();
        // let event = new Event("Test Event", [
        //     new Game("Quiz Show", "bla bla", "quiz", false, {
        //         scoreWin: 5,
        //         scoreSpecWin: 2,
        //         scoreLose: 0,
        //         scoreSpecLose: 0,
        //         questions: [
        //             {
        //                 question: "Who is Obama?!",
        //                 url: "",
        //                 urlType: "none",
        //                 answerType: "preset",
        //                 randomize: true,
        //                 presetAnswers: [
        //                     {
        //                         correct: false,
        //                         text: "Shrek",
        //                         url: "",
        //                         urlType: "none"
        //                     },
        //                     {
        //                         correct: true,
        //                         text: "Obama",
        //                         url: "",
        //                         urlType: "none"
        //                     },
        //                     {
        //                         correct: false,
        //                         text: "Trump",
        //                         url: "",
        //                         urlType: "none"
        //                     },
        //                     {
        //                         correct: true,
        //                         text: "Simba",
        //                         url: "",
        //                         urlType: "none"
        //                     }
        //                 ]
        //             }
        //     ]
        //     }),
        //     new Game("Bingo", "bla bla bla", "bingo", true, {
        //         scoreWin: 4,
        //         scoreSpecWin: 2,
        //         scoreLose: -1,
        //         scoreSpecLose: 0,
        //         columCount: 3,
        //         questions: [
        //             {
        //                 category: "ses",
        //                 question: {
        //                     question: "Who is Obama?!",
        //                     url: "",
        //                     urlType: "none",
        //                     answerType: "preset",
        //                     randomize: true,
        //                     presetAnswers: [
        //                         {
        //                             correct: false,
        //                             text: "Shrek",
        //                             url: "",
        //                             urlType: "none"
        //                         },
        //                         {
        //                             correct: true,
        //                             text: "Obama",
        //                             url: "",
        //                             urlType: "none"
        //                         },
        //                         {
        //                             correct: false,
        //                             text: "Trump",
        //                             url: "",
        //                             urlType: "none"
        //                         },
        //                         {
        //                             correct: true,
        //                             text: "Simba",
        //                             url: "",
        //                             urlType: "none"
        //                         }
        //                     ]
        //                 }
        //             },
        //             {
        //                 category: "sas",
        //                 question: {
        //                     question: "Who is Obama?!",
        //                     url: "",
        //                     urlType: "none",
        //                     answerType: "preset",
        //                     randomize: true,
        //                     presetAnswers: [
        //                         {
        //                             correct: false,
        //                             text: "Shrek",
        //                             url: "",
        //                             urlType: "none"
        //                         },
        //                         {
        //                             correct: true,
        //                             text: "Obama",
        //                             url: "",
        //                             urlType: "none"
        //                         },
        //                         {
        //                             correct: false,
        //                             text: "Trump",
        //                             url: "",
        //                             urlType: "none"
        //                         },
        //                         {
        //                             correct: true,
        //                             text: "Simba",
        //                             url: "",
        //                             urlType: "none"
        //                         }
        //                     ]
        //                 }
        //             }
        //         ]
        //     }),
        //     new Game("Text erraten", "bla bla bla", "queue", false, {
        //         scoreWin: 4,
        //         scoreLose: -2,
        //         skipAfterOneTry: false,
        //         rounds: [
        //             {
        //                 hints: [
        //                     {
        //                         text: "AAA",
        //                         url: "",
        //                         urlType: "none"
        //                     },
        //                     {
        //                         text: "BBB",
        //                         url: "",
        //                         urlType: "none"
        //                     }
        //                 ],
        //                 answer: "Obama"
        //             },
        //             {
        //                 hints: [
        //                     {
        //                         text: "111",
        //                         url: "",
        //                         urlType: "none"
        //                     },
        //                     {
        //                         text: "222",
        //                         url: "",
        //                         urlType: "none"
        //                     }
        //                 ],
        //                 answer: "reeeeeeeee"
        //             }
        //         ]
        //     })
        // ]);
        // props.send('createandjoinevent', event);
    }

    const uploadEvent = e => {
        let file = e.target.files[0];
        if(file) {
            let event = null;
            const reader = new FileReader();
            reader.addEventListener('load', ev => {
                try {
                    let result = ev.target.result;
                    event = JSON.parse(result);
                    console.log(event);
                    props.send('createandjoinevent', event);
                } catch(err) {
                    console.log(err);
                }
            });
            reader.readAsText(file);
        }
    }

    const joinEvent = eventId => {
        props.send('joinevent', {"eventId": eventId});
    }

    const displayNone = () => {
        return {
            "display": "none"
        }
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
                <div className="home-main-button-array">
                    <MainButton onClick={createTestEvent} text={"Open Event"}/>
                    <MainButton onClick={null} text={"Editor"}/>
                </div>
                <div style={displayNone()}>
                    <input 
                        type="file"
                        ref={refUpload}
                        onChange={uploadEvent}
                    ></input>
                </div>
            </div>
        </div>
    );
});

export default Home
