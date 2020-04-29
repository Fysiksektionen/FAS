import React from 'react';
import "./ErrorBox.css"

type Props = {
    message: string
}

const ErrorBox: React.FC<Props> = (props: Props) => {
    return(
        <div className="errorBox">
            <img src={process.env.PUBLIC_URL + '/icon_error64.png'} alt=""/>
            <h3>{props?.message ? props.message : "An error has occurred!"}</h3>
        </div>
    )
}

export default ErrorBox;


