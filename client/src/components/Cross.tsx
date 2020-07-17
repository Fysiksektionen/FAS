import React from 'react';
import "./Cross.css"

type Props = {
    onClick: Function
}

const Cross: React.FC<Props> = (props: Props) => {
    return (
        <div className="cross" onClick={() => props.onClick()}></div>
    )
}

export default Cross;


