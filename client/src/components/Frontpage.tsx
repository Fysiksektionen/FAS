import React from 'react';
import './Frontpage.css'



export const Frontpage: React.FC = () => {
    return (
        <div className="center">
            <h1>FAS</h1>
            <h2>Fysiksektionens administratörssystem</h2>
            <form action="/login">
                <button className="btn-large" type="submit">Login</button>
            </form>
            <a href="//f.kth.se">
                <button className="btn-large">Homepage</button>
            </a>
            <div className='footer'>
                <p>By F.dev 2020</p>
                <a href="mailto:webmaster@f.kth.se">webmaster@f.kth.se</a>
            </div>

        </div>
    )
}

export default Frontpage;