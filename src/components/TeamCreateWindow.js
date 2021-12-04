import { useEffect, useReducer, useState } from "react";
import randomIcon from "../assets/random.svg"

const TeamCreateWindow = props => {

    const [playerlist, setPlayerlist] = useState([
        {playerId: "0", username: "Hans", team: "a"},
        {playerId: "1", username: "Emma", team: "a"},
        {playerId: "2", username: "Monika", team: "a"},
        {playerId: "3", username: "Moriz", team: "a"},
        {playerId: "4", username: "Felix", team: "a"},
        {playerId: "5", username: "Orsus", team: "b"},
        {playerId: "6", username: "Leia", team: "b"},
        {playerId: "7", username: "Luis", team: "b"},
        {playerId: "8", username: "Marisa", team: "b"}
    ]);

    const reverseStyle = {
        "grid-template-columns": "20% 80%"
    };

    const switchTeam = playerId => {
        let pl = JSON.parse(JSON.stringify(playerlist));
        let p = pl.find(a => a.playerId === playerId);
        p.team = p.team==="a"?"b":"a";

        setPlayerlist(pl);
    }

    const shuffleTeams = () => {
        let s = shuffle(playerlist.length);
        let pl = JSON.parse(JSON.stringify(playerlist));
        let toA = !!Math.round(Math.random());
        const odd = !!pl.length%2;
        s.forEach((si, i) => {
            if(!odd ? i<pl.length/2 : (toA ? i<Math.ceil(pl.length/2) : i<Math.floor(pl.length/2))) {
                pl[si].team = "a";
            } else {
                pl[si].team = "b";
            }
        });
        setPlayerlist(pl);
    }

    /**
     * returns a array with number from 0 - max in a random order
     * @param {Number} max 
     * @returns {Array<Number>}
     */
    const shuffle = max => {
        let ret = [];
        let arr = [];
        for (let i = 0; i < max; i++) arr.push(i);
        while (max > 0) {
            let ran = parseInt(Math.random() * max);
            ret.push(arr.splice(ran, 1)[0]);
            max--;
        }
        return ret;
    }

    useEffect(() => {

    }, [playerlist])

    return (
        <div className="window-bg">
            <div className="team-create-window">
                <h1>create Teams</h1>
                <h2>Team A</h2>
                <div></div>
                <h2>Team B</h2>
                <div className="team-create-window-panel team-a">
                    <lu className="small-list">
                        {playerlist.filter(a => a.team === "a").map(a => 
                            <li>
                                <div>
                                    {a.username}
                                </div>
                                <div className="arrow-right arrow-right-click" onClick={() => switchTeam(a.playerId)}>
                                    
                                </div>
                            </li>
                        )}
                    </lu>
                </div>
                <div className="mod-menu-button" onClick={shuffleTeams}>
                    <img src={randomIcon}></img>
                </div>
                <div className="team-create-window-panel team-b">
                    <lu className="small-list">
                        {playerlist.filter(a => a.team === "b").map(a =>
                            <li style={reverseStyle}>
                                <div className="arrow-left arrow-left-click" onClick={() => switchTeam(a.playerId)}>

                                </div>
                                <div>
                                    {a.username}
                                </div>
                            </li>
                        )}

                    </lu>
                </div>
            </div>
        </div>
    );
}

export default TeamCreateWindow