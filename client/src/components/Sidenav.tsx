import React from 'react';
import Cross from './Cross'
import { APIRequest, httpMethod }    from '../App'
import  './Sidenav.css';



type Props = {
    expanded: boolean,
    callback: Function
}
type State = {
    name: String,
    version: String
}

class Sidenav extends React.Component<Props, State> {

    selfRef = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        
        APIRequest("me", httpMethod.get).then(res => this.setState(res));
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(e: MouseEvent) {
        if (this.props.expanded && this.selfRef.current && e.target instanceof Node 
                                && !this.selfRef.current.contains(e.target)) {
            this.props.callback()
        }
    }
    
    render() {
    return (
        <div className="sidenav" ref={this.selfRef} style={this.props.expanded ? {width: "250px"} : {width: "0px"}}> 
            <Cross onClick={() => this.props.callback()}/> 
            <h2>Meny</h2>
            <p>Användare: {this.state?.name}</p>

            <hr></hr>
            <a href="/users">
                <div className="sidenav-item">
                    <img src={process.env.PUBLIC_URL + '/icon_user64.png'} alt=""></img>
                    Användare                
                </div>
            </a>  
            <a href="/groups">
                <div className="sidenav-item">
                    <img src={process.env.PUBLIC_URL + '/icon_group64.png'} alt=""></img>
                    Grupper
                </div>
            </a>
            <a href="/grouptree">
                <div className="sidenav-item">
                    <img src={process.env.PUBLIC_URL + '/icon_node64.png'} alt=""></img>
                    Trädvy
                </div>
            </a>
            <hr></hr>
            <a href="/logout">
                <div className="sidenav-item">
                    <img src={process.env.PUBLIC_URL + '/icon_exit64.png'} alt=""></img>
                    Logga ut
                </div>
            </a>

            <p style={{bottom: 0, position: "absolute"}}>FAS v. {this.state?.version}</p>
            <p style={{bottom: 20, position: "absolute"}}>By F.dev 2020</p>
        </div>
    )}
}

export default Sidenav;