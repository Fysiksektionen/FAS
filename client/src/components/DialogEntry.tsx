import React from 'react';
import "./Dialog.css"

type Props = {
    title: string,
    message: string,
    onConfirm: Function,
    onCancel: Function,
}

const DialogConfirm: React.FC<Props> = (props: Props) => {
    return (
        <div className="dialog">
            <div className="dialog-inner">
                <h2>{props.title}</h2>
                <p>{props.message}</p>
                <input type="text"></input>
                <button onClick={() => props.onConfirm()}>Confirm</button>
                <button className="btn-red" onClick={() => props.onCancel()}></button>

            </div>
        </div>
    )
}

export default DialogConfirm;


