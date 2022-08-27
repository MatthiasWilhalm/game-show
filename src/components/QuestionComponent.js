import fiftyfifty from "../assets/fiftyfifty.png";

const jokerAssets = {
    "fiftyfifty": fiftyfifty
}

const renderMediaContent = (url, type, className) => {
    switch (type) {
        case "image":
            return (
                <img src={url} className={className || ""}></img>
            );            
        case "video":
            return (
                <video src={url} className={className || ""}></video>
            );
        case "audio":
            return (
                <audio src={url} className={className || ""}></audio>
            );
        case "iframe":
            return (
                <iframe src={url} className={className || ""}></iframe>
            );
        default:
            return null;
    }
};

const renderJoker = (joker, callback) => {
    if(!joker) return null;
    return (
        <div className="joker-content">
            {Object.keys(joker).map(a => 
                joker[a] > 0 ?
                    <img src={jokerAssets[a]} onClick={callback ? () => callback(a) : null}></img>
                :
                    null
            )}
        </div>
    );
}

const QuestionComponent = props => {
    return (
        <div className="question-grid">
            {renderJoker(props.joker, props.jokerCallback)}
            <div className="question-content">
                {props.question.url?
                    renderMediaContent(props.question.url, props.question.urlType, "question-content-img")
                :''}
                {props.question.question}
            </div>
            {props.question?.presetAnswers?.map((a, i) =>
                <div 
                    className={"question-answer"+(props.asking?" question-answer-asking":"")+(props.selection===i?' selected':'')}
                    onClick={() => props.callback?props.callback(i):null}
                >
                    {a.url?
                        renderMediaContent(a.url, a.urlType, "question-answer-img")
                    :''}
                    {a.text}
                </div>
            )}
        </div>
    );
}

export default QuestionComponent