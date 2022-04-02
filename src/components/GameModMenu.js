import { useState, forwardRef } from 'react';


const GameModMenu = forwardRef((props, ref) => {

    const ShowStates = {
        INIT: "init",
        SHOW: "show",
        HIDE: "hide"
    };

    const [min, setMin] = useState(2);
    const [sec, setSec] = useState(0);
    const [state, setState] = useState(ShowStates.INIT);

    const getTime = () => {
        return parseInt(sec) + parseInt(min)*60;
    }

    const setSecs = s => {
        if(s >= 60) {
            setSec(s%60);
            setMin(min+Math.floor(s/60));
        } else {
            setSec(s);
        }
    }

    const toggleState = () => {
        setState(state === ShowStates.SHOW ? ShowStates.HIDE : ShowStates.SHOW);
    }

    const startTimer = () => {
        props.send('timer', {endTime: Math.floor(new Date().getTime() / 1000) + getTime()});
    }

    return (
        <div className={"mod-toggle-menu "+"mod-toggle-menu-"+state}>
            <div className="mod-toggle-menu-menu">
                <div className="mod-toggle-menu-element">
                    <label>Timer</label>
                    <button onClick={startTimer}>Start</button>
                    <input 
                        placeholder="Min..."
                        value={min}
                        onChange={e => setMin(e.target.value)}
                        type="number"
                        step={1}
                        min={0}
                    ></input>
                    <input
                        placeholder="Sec..."
                        value={sec}
                        onChange={e => setSecs(e.target.value)}
                        type="number"
                        step={10}
                        min={0}
                    ></input>
                </div>
                <hr/>
            </div>
            <div 
                className="mod-toggle-menu-header"
                onClick={toggleState}
            >
                M
            </div>
        </div>
    );
});

export default GameModMenu