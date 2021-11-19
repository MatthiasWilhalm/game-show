import React, { Component, useState, useEffect, useRef, createRef } from 'react';


import DataPackage from '../tools/DataPackage';
import { getPlayerId, getUsername, storePlayerId, storeUsername } from '../tools/tools';
import { Event } from '../tools/Event';
import { Game } from '../tools/Game';


//const client = new W3CWebSocket('ws://127.0.0.1:3001');
/**
 * Hauptsächlich für das Routen zuständig
 */
const GameScreen = () => {


    useEffect(() => {
        
    }, []);


    return (
        <div>
            Game
        </div>
    );
}

export default GameScreen
