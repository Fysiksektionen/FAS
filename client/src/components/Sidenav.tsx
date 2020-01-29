import React from 'react';
import './Sidenav.css';

type SidenavProps = {
    expanded: boolean,
    callback: Function
}

// Create the named arrow function Sidenav inheriting from React.FC with arguments (props: SidenavProps)
const Sidenav : React.FC<SidenavProps> = (props: SidenavProps) => {
    return (
        <div className="sidenav" style={props.expanded ? {width: "250px"} : {width: "0px"}}> 
                <h2 onClick={() => {props.callback();}}>Meny</h2>
                <hr></hr>
                <div className="sidenav-item">
                    <img src={process.env.PUBLIC_URL + '/icon_user64.png'}></img>
                    Användare                   
                </div>
                <div className="sidenav-item">
                    <img src={process.env.PUBLIC_URL + '/icon_group64.png'}></img>
                    Grupper
                </div>
                <hr></hr>
                <div className="sidenav-item">
                    <img src={process.env.PUBLIC_URL + '/icon_list64.png'}></img>
                    Listvy
                </div>
                <div className="sidenav-item">
                    <img src={process.env.PUBLIC_URL + '/icon_node64.png'}></img>
                    Trädvy
                </div>
                <hr></hr>
                <div className="sidenav-item">
                    <img src={process.env.PUBLIC_URL + '/icon_exit64.png'}></img>
                    Logout
                </div>
        </div>
    )
}

export default Sidenav;