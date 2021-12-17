import useToggle from "../tools/useToggle";
import chatIcon from "../assets/chat.svg";
import closeIcon from "../assets/close.svg";
import sendIcon from "../assets/send.svg";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { getPlayerId, getUsername } from "../tools/tools";

const ChatComponent = forwardRef((props, ref) => {

    const ShowStates = {
        INIT: "init",
        SHOW: "show",
        HIDE: "hide"
    };

    const TeamNames = ["Team A", "Team B"];

    const maxMsgLength = 200;

    const [showState, setShowState] = useState(ShowStates.INIT);
    const [currentMsg, setCurrentMsg] = useState("");
    const [isUnRead, setUnRead] = useState(false);
    const [chatroom, setChatroom] = useState(-1);

    const inputRef = useRef(null);
    const logRef = useRef(null);

    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);

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
            props.send('chat', {username: getUsername(), text: currentMsg, usercolor: '', team: chatroom});
            setCurrentMsg("");
        }
    }

    const setMsg = txt => {
        if(txt.length < maxMsgLength || txt.length < currentMsg) {
            setCurrentMsg(txt);
        }
    }

    const getPlayerlist = () => {
        let pl = JSON.parse(JSON.stringify(props.eventPlayerList?.filter(a => a.playerState === props.PlayerStates.PLAYER)));
        pl.map(a => {
            a.team = gameState?.playerProgress?.[a.playerId]?.team;
            return a;
        });
        return pl;
    }

    /**
     * -1 = Global
     * 0 = Team A
     * 1 = Team B
     * @param {Number} team 
     * @returns 
     */
    const getChat = team => {
        return props.chat.filter(a => a.team === team);
    }

    const getTeamFromPlayer = () => {
        return getPlayerlist()?.find(a => a.playerId === getPlayerId())?.team ?? -1;
    }

    const getAvailableTeams = () => {
        let t = [];
        getPlayerlist().forEach(a => a.team!==undefined && a.team !==-1 ? t.push(a.team) : null);
        return [... new Set(t)];
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
            // updateScrollbar();
            triggerUnRead();
        }
    }));

    const renderTeamList = team => {
        let t = getTeamFromPlayer();
        if(gameState?.teamsCreated && ((props.isMod && getAvailableTeams().length>0) || t === team)) {
            return (
                <li 
                    onClick={() => setChatroom(team)}
                    className={chatroom===team?"selected":""}
                >
                    {TeamNames[team]}
                </li>
            );
        } else return null;
    }

    return(
        <div className={"chat chat-state-"+showState}>
            <div className="chat-button" onClick={toggleShow}>
                {isUnRead?<div className="chat-unread"></div>:''}
                <img src={(showState===ShowStates.SHOW)?closeIcon:chatIcon}></img>
            </div>
            <div className="chat-main">
                <lu className="chat-tabs">
                    <li onClick={() => setChatroom(-1)} className={chatroom===-1?"selected":""}>Global</li>
                    {renderTeamList(0)}
                    {renderTeamList(1)}
                </lu>
                <div className="chat-msgs" ref={logRef}>
                    {props.chat?
                        getChat(chatroom).reverse().map(a => 
                            <div className="chat-item">
                                <diV>{a.username+": "+a.text}</diV>
                            </div>
                        )
                    :""}
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