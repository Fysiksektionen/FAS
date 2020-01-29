import React, { useState } from 'react';
import './Header.css';

type HeaderProps = {
    expandSidenav: Function
}

const Header : React.FC<HeaderProps> = (props: HeaderProps) => {
    return (
        <div className="header">
            <div className="title">
                <img src={process.env.PUBLIC_URL + '/icon_list64.png'}
                     onClick={() => props.expandSidenav()}></img>
            </div>
        </div>
    )
}

export default Header;