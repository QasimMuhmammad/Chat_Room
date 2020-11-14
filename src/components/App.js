import React from 'react';

import NavBar from './navbar/NavBar'
import ChatRoom from './chatroom/ChatRoom'


const App = () => {
    return(
        <div className='ui container center aligned fluid'>
            <NavBar />
            <ChatRoom />
        </div>
    );
};

export default App;