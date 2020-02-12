import React from 'react';
import './Header.css';

type HeaderProps = {
    expandSidenav: Function
}

const Header : React.FC<HeaderProps> = (props: HeaderProps) => {
    return (
        <div className="header">
            <div className="title">
                <h3 onClick={() => props.expandSidenav()}>FAS</h3>
            </div>
        </div>
    )
}

export default Header;