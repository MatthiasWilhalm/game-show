import { useEffect, useState } from "react";
import useToggle from "../tools/useToggle";
import ChatComponent from "./ChatComponent";
import MainButton from "./MainButton";

const UiTest = props => {

    const [currentElement, setCurrentElement] = useState("button");
    const [hideSidebar, toggleHideSidebar] = useToggle();

    useEffect(() => {
        document.addEventListener('keydown', keyDownEvents);
        // document.addEventListener('keyup', keyUpEvents);
        return () => {
            document.removeEventListener('keydown', keyDownEvents);
            // document.removeEventListener('keyup', keyUpEvents);
        }
    }, []);

    const keyDownEvents = k => {
        if(k.key==='h') {
            toggleHideSidebar(!hideSidebar);
        }
    }

    const testChat = [
        {"username": "Bob", "text": "Hi there"},
        {"username": "Hans", "text": "Moin"},
        {"username": "Reeeeeeeeeeeeeeee", "text": "Moinnnnnnnnnnnnnnnnnnnnnn nnnnnnnnnnnnnnnnnnnnnnnnnn nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn"},
    ]

    const renderElement = () => {
        console.log(currentElement);
        switch (currentElement) {
            case 'button':
                return(
                    <MainButton 
                        onClick={() => console.log("Main Button click")}
                        text={"Testbutton"}
                    ></MainButton>
                );  
            case 'panel':
                return(
                    <div className="panel">
                        <ul className="small-list">
                            <li>
                                <div>long Name</div>
                                <div>33</div>
                            </li>
                            <li>
                                <div>long Name</div>
                                <div>33</div>
                            </li>
                            <li>
                                <div>long Name</div>
                                <div>33</div>
                            </li>
                        </ul>
                    </div>
                );  
            case 'panel-click':
                
                return(
                    <div className="panel">
                        <ul className="small-list clickable-list">
                            <li>
                                <div>long Name</div>
                                <div>33</div>
                            </li>
                            <li>
                                <div>long Name</div>
                                <div>33</div>
                            </li>
                            <li>
                                <div>long Name</div>
                                <div>33</div>
                            </li>
                        </ul>
                    </div>
                );
            case 'panel-states':
                
                return(
                    <div className="panel">
                        <ul className="small-list clickable-list">
                            <li className="right">
                                <div>long Name</div>
                                <div>33</div>
                            </li>
                            <li className="wrong">
                                <div>long Name</div>
                                <div>33</div>
                            </li>
                            <li className="locked">
                                <div>long Name</div>
                                <div>33</div>
                            </li>
                        </ul>
                    </div>
                );
            case 'lobby-screen':
                return(
                    <div className="lobby-screen">
                        <h1>TFGame Summer 2022</h1>
                        <h2>Game starts soon...</h2>
                        <h3>Mod: Hugo</h3>
                        <p>6 Online</p>
                        <div className="center">
                            <MainButton text={"switch to spectator"}></MainButton>
                        </div>
                    </div>
                );
            case 'chat':
                return(
                    <ChatComponent chat={testChat}></ChatComponent>
                );
            default:
                return(
                    <p>
                        no element found
                    </p>
                );
        }
    }

    return (
        <div>
            {!hideSidebar?
                <div className="uitest-sidepanel">
                    <ul>
                        <li onClick={() => setCurrentElement('button')}>button</li>
                        <li onClick={() => setCurrentElement('panel')}>panel</li>
                        <li onClick={() => setCurrentElement('panel-click')}>panel-click</li>
                        <li onClick={() => setCurrentElement('panel-states')}>panel-states</li>
                        <li onClick={() => setCurrentElement('lobby-screen')}>lobby-screen</li>
                        <li onClick={() => setCurrentElement('chat')}>chat</li>
                        <li>scoreboard</li>
                    </ul>
                </div>
            :''}
            <div className="uitest-canvas">
                {renderElement()}
            </div>
        </div>
    );
}

export default UiTest