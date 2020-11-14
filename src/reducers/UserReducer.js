const initialState = {
    chatLog: [],
    usersOnline: [],
    username: null
}

export default (state = initialState, action) => {
    
    console.log('In UserReducer after event has been dispatched',action)
    
    switch(action.type){
        case 'UPDATE_CHAT_LOG':
            return {...state, chatLog:action.update.chat, usersOnline:action.update.online, username: action.update.user};
            document.cookie = `username=${action.update.user.user}; path=/; max-age=31536000`;
            document.cookie = `color=${action.update.user.color}; path=/; max-age=31536000`;
        case 'UPDATE_ALL':
            return {...state, chatLog:action.update.chat, usersOnline:action.update.online, username: action.update.user};
            document.cookie = `username=${action.update.user.user}; path=/; max-age=31536000`;
            document.cookie = `color=${action.update.user.color}; path=/; max-age=31536000`;
        case 'UPDATE':
            return {...state, chatLog:action.update.chat, usersOnline:action.update.online};
        case 'KEEP_USERNAME':
            return {...state, username: action.update.user};
        default:
            return state;
    }
}