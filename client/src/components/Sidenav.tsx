import React from 'react';
import './Sidenav.css';

type SidenavProps = {
    expanded: boolean,
    callback: Function
}

const Sidenav : React.FC<SidenavProps> = (props: SidenavProps) => {
    return (
        <div className="sidenav" style={props.expanded ? {width: "250px"} : {width: "0px"}}> 
                <h2 onClick={() => {props.callback()}}>Meny</h2>
                <hr></hr>
                <a href="/users">
                    <div className="sidenav-item">
                        <img src={process.env.PUBLIC_URL + '/icon_user64.png'}></img>
                        Användare                
                    </div>
                </a>  
                <a href="/groups">
                    <div className="sidenav-item">
                        <img src={process.env.PUBLIC_URL + '/icon_group64.png'}></img>
                        Grupper
                    </div>
                </a>
                <hr></hr>
                <a href="/listview">
                    <div className="sidenav-item">
                        <img src={process.env.PUBLIC_URL + '/icon_list64.png'}></img>
                        Listvy
                    </div>
                </a>
                <a href="/graphview">
                    <div className="sidenav-item">
                        <img src={process.env.PUBLIC_URL + '/icon_node64.png'}></img>
                        Trädvy
                    </div>
                </a>
                <hr></hr>
                <a href="/logout">
                    <div className="sidenav-item">
                        <img src={process.env.PUBLIC_URL + '/icon_exit64.png'}></img>
                        Logga ut
                    </div>
                </a>
        </div>
    )
}

export default Sidenav;