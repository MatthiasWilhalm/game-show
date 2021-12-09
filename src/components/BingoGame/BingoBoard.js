import { useEffect } from "react";

const BingoBoard = props => {

    const getColumnsStyle = () => {
        let count = props.game?.content?.columCount || 3;
        count = Math.abs(parseInt(count));
        let ret = {"gridTemplateColumns": ""}
        for (let i = 0; i < count; i++) ret["gridTemplateColumns"] += "min-content ";
        return ret;
    }

    const selectCategory = index => {
        if(props.categoryCallback) {
            props.categoryCallback(index);
        }
    }

    const getSelection = index => {

    }



    return(
        <div className="bingo-board" style={getColumnsStyle()}>
            {props.game?.content?.questions?.map((a,i) =>
                <div 
                    className={"bingo-board-item"+(props.isMod?" clickable":"")+(props.selected===i?" selected":"")}
                    onClick={() => selectCategory(i)}
                >{a.category}</div>
                
            )}
        </div>
    );
}

export default BingoBoard