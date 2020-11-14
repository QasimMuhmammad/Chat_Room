import React, { createContext } from 'react'
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { updateChatLog } from './actions';

const WebSocketContext = createContext(null)

export { WebSocketContext }

export default ({ children }) => {
    let socket;
    let ws;

    const dispatch = useDispatch();

    const sendMessage = (username, message) => {
        const payload = {
            username: username,
            data: message
        }
        socket.emit("send-message", JSON.stringify(payload));
        dispatch(updateChatLog(payload));
    }

    // All the actions with me recieving socket messages
    if (!socket) {
        socket = io.connect('http://localhost:3000')

        socket.on("get-message", (msg) => {
            const payload = JSON.parse(msg);
            dispatch(updateChatLog(payload));
        })

        ws = {
            socket: socket,
            sendMessage
        }
    }

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}