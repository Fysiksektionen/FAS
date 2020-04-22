import React from 'react';
import "./ErrorMessage.css"

type Props = {
    message: string
}

const ErrorMessage: React.FC<Props> = (props: Props) => {
    return(
        <div className="errorMessage">
            <h2>
                {props?.message ? props.message : "An error has occurred!"}
            </h2>
        </div>
    )
}

export default ErrorMessage;


