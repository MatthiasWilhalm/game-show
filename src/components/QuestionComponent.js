const QuestionComponent = props => {
    return (
        <div className="question-grid">
            <div className="question-content">
                {props.question.question}
            </div>
            {props.question?.presetAnswers?.map((a, i) =>
                <div 
                    className={"question-answer"+(props.asking?" question-answer-asking":"")+(props.selection===i?' selected':'')}
                    onClick={() => props.callback?props.callback(i):null}
                >
                    {a.text}
                </div>
            )}
        </div>
    );
}

export default QuestionComponent