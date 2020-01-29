import React, { useState } from 'react';
import './ExpandButton.css';


export type ButtonProps = {
    expanded: Boolean,
    callback?: Function
}



const ExpandButton : React.FC<ButtonProps> = (props: ButtonProps) => {
    return (
        <div className="expandButtonContainer">
            <div className={`expandButton ${props.expanded ? 'expanded' : ''}`} 
            onClick={() => {
                if (props.callback) { // if parent wants to callback when pressed
                    props.callback()
                }
            }}>
            </div>
        </div>
    )
}

export default ExpandButton;