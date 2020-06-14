import React from 'react';
import "./Dialog.css"

type Props = {
    title: string,
    message: string,
    buttons: {
        label: string,
        onClick: Function
    }[]
}

const Dialog: React.FC<Props> = (props: Props) => {
    return (
        <div className="dialog">
            <div className="dialog-inner">
                <h2>{props.title}</h2>
                <p>{props.message}</p>
                {props.buttons.map(g => <button className="btn-small" 
                                                onClick={() => g.onClick()}>{g.label}</button>)}
            </div>
        </div>
    )
}

export default Dialog;


