import { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Event } from "../tools/Event";
import { Game } from "../tools/Game";

const Editor = props => {

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [event, setEvent] = useState(new Event("", []));
    const [newGameSelector, setNewGameSelector] = useState("quiz");
    const [focusedGame, setFocusedGame] = useState(0);

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

    const updateQuestion = (name, value, questionIndex, game) => {
        game.content.questions[questionIndex][name] = value;
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

    const addNewContentUnit = game => {
        switch (game.type) {
            case 'quiz':
                if(game?.content?.questions instanceof Array) {
                    game.content.questions.push({
                        question: '',
                        url: '',
                        urlType: "none",
                        answerType: "preset",
                        randomize: false,
                        presetAnswers: []
                    });
                    updateContent('questions', game.content.questions, game);
                }
                break;
        
            default:
                break;
        }
    }

    const addAnswerForQuizUnit = (game, questionIndex) => {
        if(game?.content?.questions instanceof Array) {
            game.content.questions[questionIndex].presetAnswers.push({
                correct: false,
                text: "",
                url: "",
                urlType: "none"
            }); 
            updateContent('questions', game.content.questions, game);
        }
    }

    const renderGame = (game, index) => {
        if(focusedGame === index) {
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
        } else {
            return (
                <li>
                    <h3>{game.title!=='' ? game.title : game.type}</h3>
                    <button className="small-button" onClick={() => setFocusedGame(index)}>up</button>
                </li>
            );
        }
    }

    const renderQuizAnswers = question => {
        return (
            <ul className="editor-main-inner-list triple">
                {question.presetAnswers.map(a =>
                    <li>
                        <hr className="triple"></hr>
                        <input className="double" value={a.text} placeholder="Answer"></input>
                        <div>
                            <input type="checkbox" checked={a.correct}></input>
                            <label>correct</label>
                        </div>
                        <input className="double" value={a.url} placeholder="URL"></input>
                        <select value={a.urlType}>
                            <option value={'none'}>none</option>
                            <option value={'image'}>image</option>
                            <option value={'video'}>video</option>
                            <option value={'audio'}>audio</option>
                            <option value={'iframe'}>iframe</option>
                        </select>
                    </li>
                )}
            </ul>
        );
    }

    const renderGameEditList = game => {
        switch (game.type) {
            case 'quiz':
                return (
                    <ul className="editor-main-list">
                        <li>
                            <div></div>
                            <div></div>
                            <button className="normal-button editor-add-button" onClick={() => addNewContentUnit(game)}>Add</button>
                        </li>
                        {game.content.questions.map((a, i) => 
                            <li>
                                <input 
                                    className="double"
                                    value={a.question}
                                    onChange={e => updateQuestion('question', e.target.value, i, game)}
                                    placeholder="question">
                                </input>
                                <div>
                                    <button className="small-button">-</button>
                                    <button className="small-button" onClick={() => addAnswerForQuizUnit(game, i)}>+</button>
                                </div>
                                <input 
                                    className="double"
                                    value={a.url}
                                    placeholder="URL"
                                    onChange={e => updateQuestion('url', e.target.value, i, game)}>
                                </input>
                                <select value={a.urlType} onChange={e => updateQuestion('urlType', e.target.value,i ,game)}>
                                    <option value={'none'}>none</option>
                                    <option value={'image'}>image</option>
                                    <option value={'video'}>video</option>
                                    <option value={'audio'}>audio</option>
                                    <option value={'iframe'}>iframe</option>
                                </select>
                                {renderQuizAnswers(a)}
                            </li>
                        )}
                    </ul>
                );
        
            default:
                break;
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
                {renderGameEditList(event.games?.[focusedGame] ?? [])}
            </div>
        </div>
    );
}

export default Editor