import React from 'react';
import logo from './logo.svg'

function HomeIntro() {
    return (
        <div>
            <img src={logo} className="logo" alt="logo" />
            <h1>Stock Screener</h1>
            <h2> Welcome to the Stock Market Page. You may click on stocks to view
                all the stocks or search to view the latest 100 days of activity. </h2>
        </div>
    );
}

function Home() {
    return (
        <div className="home">
            <HomeIntro />
        </div>
    );
}

export default Home;