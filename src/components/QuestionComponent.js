const QuestionComponent = props => {
    return (
        <div className="question-grid">
            <div className="question-content">
                {props.question.question}
            </div>
            {props.question?.presetAnswers?.map(a =>
                <div className={"question-answer"+(props.asking?" question-answer-asking":"")}>
                    {a.text}
                </div>
            )}
        </div>
    );
}

export default QuestionComponent