import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';


const Timer = forwardRef((props, ref) => {

    const [timerFkt, setTimerFkt] = useState(null);
    const [endTime, setEndTime] = useState(-1);
    const [time, setTime] = useState(-1);
    const [displayTime, setDisplayTime] = useState("0:00");

    useEffect(() => {
        if(time>=0 && !timerFkt) {
            setTimerFkt(setTimeout(refreshTimer, 1000));
        }
    }, [timerFkt, endTime, time, displayTime]);

    const showTimer = () => {
        return props.timer && props.timer > 0;
    }

    const getRelativeTime = absTime => {
        return absTime - Math.floor(new Date().getTime() / 1000);
    }

    useImperativeHandle(ref, () => ({
        triggerTimer(et) {
            et = parseInt(et);
            setEndTime(et);
            setTime(getRelativeTime(et));
        }
    }));

    const refreshTimer = () => {
        if(time>=0) {
            let t = time-1;
            if(t>=0) {
                setTime(t);
                updateDisplayTime(t);
                setTimerFkt(null);
            } else {
                setEndTime(-1);
                setTime(-1);
                clearTimeout(timerFkt);
                setTimerFkt(null);
            }
        }
    }

    const updateDisplayTime = relativeTime => {
        let m = Math.floor(relativeTime/60);
        let s = relativeTime%60;
        setDisplayTime(m+":"+(s<10?"0":"")+s);
    }

    return (
        <div className='timer'>
            {endTime!==-1 ? displayTime : ""}
        </div>
    );
});

export default Timer