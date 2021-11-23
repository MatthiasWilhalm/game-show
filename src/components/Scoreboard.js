const Scoreboard = props => {

    return (
        <div className="scoreboard">
            {console.log(props.eventPlayerList)}
            <ul>
                {props.eventPlayerList.map(a => 
                    <li>
                        {a.username +" : "+a.playerState}
                    </li>
                )}
            </ul>
        </div>
    );
}

export default Scoreboard