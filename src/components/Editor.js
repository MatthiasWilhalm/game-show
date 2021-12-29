import { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Event } from "../tools/Event";
import { Game } from "../tools/Game";

const Editor = props => {

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [event, setEvent] = useState(new Event("", []));
    const [newGameSelector, setNewGameSelector] = useState("quiz")

    const handleUpdate = (name, value) => {
        event[name] = value;
        setEvent(event);
        forceUpdate();
        console.log(event);
    }

    const updateGame = (name, value, game) => {
        game[name] = value;
        handleUpdate('games', event.games);
    }

    const updateContent = (name, value, game) => {
        game.content[name] = value;
        handleUpdate('games', event.games);
    }

    const createNewGame = () => {
        let g = event.games;
        g.push(new Game('', '', newGameSelector, newGameSelector==='bingo', {
            scoreWin: 5,
            scoreSpecWin: 2,
            scoreLose: 0,
            scoreSpecLose: 0,
            questions: []
        }));
        handleUpdate('games', g);
    }

    const renderGame = (game, index) => {
        switch (game.type) {
            case 'quiz':
                return(
                    <li>
                        <input 
                            type={"text"}
                            value={game.title}
                            placeholder="Title"
                            onChange={e => updateGame("title", e.target.value, game)}
                            className="double"
                        ></input>
                        <textarea
                            value={game.description}
                            placeholder="description"
                            onChange={e => updateGame("description", e.target.value, game)}
                            className="double"
                        ></textarea>
                        <input 
                            type={"number"}
                            value={game.content?.scoreWin}
                            placeholder="Score Win"
                            onChange={e => updateContent("scoreWin", e.target.value, game)}
                            className="double"
                        ></input>
                        <input 
                            type={"number"}
                            value={game.content?.scoreSpecWin}
                            placeholder="Score Spec Win"
                            onChange={e => updateContent("scoreSpecWin", e.target.value, game)}
                            className="double"
                        ></input>
                        <input 
                            type={"number"}
                            value={game.content?.scoreLose}
                            placeholder="Score Lose"
                            onChange={e => updateContent("scoreLose", e.target.value, game)}
                            className="double"
                        ></input>
                        <input 
                            type={"number"}
                            value={game.content?.scoreSpecLose}
                            placeholder="Score Spec Lose"
                            onChange={e => updateContent("scoreSpecLose", e.target.value, game)}
                            className="double"
                        ></input>
                    </li>
                );                
            case 'queue':
                return(
                    <li>

                    </li>
                );
            case 'bingo':
                return (
                    <li>

                    </li>
                );
            default:
                return null;
        }
    }

    return (
        <div className="lobby-mod-grid">
            <div className="mod-title">
                <div className="game-title">
                    <h1>
                        {"Editor"}
                    </h1>
                </div>
                <div className="mod-menu-button-array-2">
                    <Link to={'/home'}>
                        <div className="mod-menu-button" onClick={null}>Home</div>
                    </Link>
                    <div className="mod-menu-button" onClick={null}>
                        Down load
                    </div>
                </div>
            </div>
            <div className="sidepanel panel double-r">
                <ul className="editor-side-list">
                    <li>
                        <input 
                            type={"text"} value={event.title}
                            placeholder="Title"
                            onChange={e => handleUpdate("title", e.target.value)}
                            className="double"
                        ></input>
                        <div></div>
                    </li>
                    <li>
                        <select value={newGameSelector} onChange={e => setNewGameSelector(e.target.value)}>
                            <option value={"quiz"}>quiz</option>
                            <option value={"queue"}>queue</option>
                            <option value={"bingo"}>bingo</option>
                        </select>
                        <button className="small-button" onClick={createNewGame}>+</button>
                        <div></div>
                    </li>
                    {event?.games.map(renderGame)}
                </ul>
            </div>
            <div className="panel">
                <ul>

                </ul>
            </div>
        </div>
    );
}

export default Editor