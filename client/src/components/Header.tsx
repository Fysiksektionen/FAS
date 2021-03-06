import React from 'react';
import './Header.css';

type HeaderProps = {
    expandSidenav: Function,
    pageTitle?: string
}

const Header : React.FC<HeaderProps> = (props: HeaderProps) => {
    return (
        <div className="header">
            <div className="title">
                <img src={process.env.PUBLIC_URL + '/icon_menu64.png'} alt=""
                    onClick={() => props.expandSidenav()}></img>
                <a href="/">
                    <h3>FAS</h3>
                </a>
            </div>
            <div className="page-title">
                <h2>{props?.pageTitle}</h2>
            </div>
        </div>
    )
}

export default Header;