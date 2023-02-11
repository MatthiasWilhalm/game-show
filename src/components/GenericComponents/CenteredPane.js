import React, { Component, useState, useEffect, useRef, createRef, forwardRef, useImperativeHandle, useReducer } from 'react';

import {
    BrowserRouter as Router,
    Link,
    useHistory
} from "react-router-dom";
import MainButton from '../MainButton';

const CenteredPane = forwardRef((props, ref) => {

    return (
        <div className="centered-pane">
            {props.title && <h1>{props.title}</h1>}
            {props.subtitle && <h3>{props.subtitle}</h3>}
            {props.children}
        </div>
    );
});

export default CenteredPane;