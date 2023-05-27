const MainButton = props => {

    let { text, onClick, className, locked } = props;
    if(locked) {
        onClick = null;
        className += " locked";
    }

    return (
        <button 
            onClick={e => onClick?.(e)}
            className={"main-button "+(className ?? "")}
            style={props.style}
        >
            {text}
        </button>
    );
}

export default MainButton