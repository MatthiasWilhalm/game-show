import useToggle from "../tools/useToggle";
import chatIcon from "../assets/chat.svg";
import closeIcon from "../assets/close.svg";
import sendIcon from "../assets/send.svg";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { getUsername } from "../tools/tools";

const ChatComponent = forwardRef((props, ref) => {

    const ShowStates = {
        INIT: "init",
        SHOW: "show",
        HIDE: "hide"
    };

    const maxMsgLength = 200;

    const [showState, setShowState] = useState(ShowStates.INIT);
    const [currentMsg, setCurrentMsg] = useState("");
    const [isUnRead, setUnRead] = useState(false);

    const inputRef = useRef(null);
    const logRef = useRef(null);

    useEffect(() => {
        document.addEventListener('keydown', keyDownEvent);
        return () => {
            document.removeEventListener('keydown', keyDownEvent);
        }
    }, [showState, currentMsg, isUnRead]);

    const keyDownEvent = k => {
        switch (k.key) {
            case 'c':
                if(showState!==ShowStates.SHOW)               
                    toggleShow();
                break;
            case 'Enter':
                if(showState!==ShowStates.SHOW)
                    toggleShow();
                else if(showState===ShowStates.SHOW)
                    sendMsg();
                break;
            case 'Escape':
                if(showState===ShowStates.SHOW)
                    setShowState(ShowStates.HIDE);
                break;
            default:
                break;
        }
    }

    const toggleShow = () => {
        if(showState!==ShowStates.SHOW) {
            setUnRead(false);
            inputRef?.current.focus();
        }
        setShowState(showState===ShowStates.SHOW?ShowStates.HIDE:ShowStates.SHOW);
    }

    const triggerUnRead = () => {
        if(showState!==ShowStates.SHOW)
            setUnRead(true);
    }

    const sendMsg = () => {
        if(currentMsg!=="") {
            props.send('chat', {username: getUsername(), text: currentMsg});
            setCurrentMsg("");
        }
    }

    const setMsg = txt => {
        if(txt.length < maxMsgLength || txt.length < currentMsg) {
            setCurrentMsg(txt);
        }
    }

    /**
     * 
     * @param {HTMLElement} e 
     */
    const updateScrollbar = () => {
        let e = logRef.current;
        e.scrollTop = e.scrollHeight - e.clientHeight;

    }

    useImperativeHandle(ref, () => ({
        newMsg() {
            updateScrollbar();
            triggerUnRead();
        }
    }));

    return(
        <div className={"chat chat-state-"+showState}>
            <div className="chat-button" onClick={toggleShow}>
                {isUnRead?<div className="chat-unread"></div>:''}
                <img src={(showState===ShowStates.SHOW)?closeIcon:chatIcon}></img>
            </div>
            <div className="chat-main">
                <lu className="chat-tabs">
                    <li>Global</li>
                    <li>Team A</li>
                    <li>Team B</li>
                </lu>
                <div className="chat-msgs" ref={logRef}>
                    {props.chat?props.chat.map(a => 
                        <div className="chat-item">
                            <diV>{a.username+": "+a.text}</diV>
                        </div>
                    ):""}
                    {/* <div className="chat-item"></div> */}
                </div>
                <div className="chat-textfield">
                    <input 
                        placeholder="message..."
                        value={currentMsg}
                        onChange={e => setMsg(e.target.value)}
                        ref={inputRef}
                    ></input>
                    <button onClick={sendMsg}>
                        <img src={sendIcon}></img>
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ChatComponent