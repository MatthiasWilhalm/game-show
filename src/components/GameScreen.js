import React, { Component, useState, useEffect, useRef, createRef, forwardRef,useImperativeHandle } from 'react';

import { useNavigate } from 'react-router-dom';

import DataPackage from '../tools/DataPackage';
import { getPlayerId, getUsername, storePlayerId, storeUsername } from '../tools/tools';
import { Event } from '../tools/Event';
import { Game } from '../tools/Game';


//const client = new W3CWebSocket('ws://127.0.0.1:3001');
/**
 * Hauptsächlich für das Routen zuständig
 */
const GameScreen = forwardRef((props, ref) => {

    const navigate = useNavigate();

    useEffect(() => {
        if(!props.eventData) {
            navigate('/home');
        }
        console.log(props.eventData);
        console.log(props.eventStatus);
    }, []);

    useImperativeHandle(ref, () => ({
        // webhook triggers
    }));


    return (
        <div>
            Game
        </div>
    );
});

export default GameScreen
