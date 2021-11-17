import useWebSocket from 'react-use-websocket';
import React, { Component, useState, useEffect, useRef, createRef } from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    withRouter,
    useHistory
} from "react-router-dom";
import DataPackage from '../tools/DataPackage';


//const client = new W3CWebSocket('ws://127.0.0.1:3001');
/**
 * Hauptsächlich für das Routen zuständig
 */
const Main = () => {
    const NOPROXYPORT = 5110;
    const socketUrl = 'ws://'+window.location.hostname+":"+NOPROXYPORT;

    const refHome = createRef();
    const refLogin = createRef();
    const refGame = createRef();
    const refQuestion = createRef();

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
            console.log("new msg res");
            console.log(e);
            let msg = new DataPackage();
            msg.parse(e.data);
            console.log(msg);

        }
    });

    const send = (type, data) => {
        sendMessage("" + type + data);
    }

    useEffect(() => {
        send("hello"," world");
    }, []);


    return (
        <div>
            Home
        </div>
        // <div>
        //     <Router>
        //         <div>
        //             <Switch>
        //                 <Route exact path="/"><Home send={send} ref={refHome}></Home></Route>
        //                 <Route path="/home"><Home send={send} ref={refHome}></Home></Route>
        //                 <Route path="/login"><Login send={send} ref={refLogin}></Login></Route>
        //                 <Route exact path="/game"><Game send={send} ref={refGame}></Game></Route>
        //                 <Route path="/game/:id"><Game send={send} ref={refGame}></Game></Route>
        //                 <Route path="/question"><Question send={send} ref={refQuestion}></Question></Route>
        //             </Switch>
        //         </div>
        //     </Router>
        // </div>
    );
}

export default Main
