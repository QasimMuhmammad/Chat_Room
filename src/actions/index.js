// import io from 'socket.io-client'


export const UPDATE_CHAT_LOG = "UPDATE_CHAT_LOG"
export function updateChatLog(update){
    return {
        type: UPDATE_CHAT_LOG,
        update
    }
}

export const UPDATE_ALL = "UPDATE_ALL"
export function initialize(update){
    return {
        type: UPDATE_ALL,
        update
    }
}

export const KEEP_USERNAME = "KEEP_USERNAME"
export function consistency(update){
    return {
        type: KEEP_USERNAME,
        update
    }
}

export const loadInitialDataSocket = (socket) => {
    // Set up some socket functions
    console.log('Looking at cookies:', document.cookie)
    if(cookieKey('username')){
        return (dispatch) => {
            socket.on('initialize',(res)=>{
                document.cookie = `username=${res.user.user.toLowerCase()}; path=/; max-age=31536000`;
                document.cookie = `color=${res.user.color}; path=/; max-age=31536000`;
                console.log('In initialize: ',res)
                dispatch(initialize(res))
            })
        // Update the value of username and pass, then get all other info
        let update = {user: {user : getCookieValue('username'), color: getCookieValue('color')}}
        dispatch(consistency(update))
        socket.emit('update-chat', update);
        }
    } else {

    return (dispatch) => {
		socket.on('initialize',(res)=>{
           document.cookie = `username=${res.user.user}; path=/; max-age=31536000`;
           document.cookie = `color=${res.user.color}; path=/; max-age=31536000`;
           console.log('In initialize: ',res)
           dispatch(initialize(res))
       })
       socket.emit('register');
    }	
    }
}

export const UPDATE = "UPDATE"
export function updata_some(update){
    return {
        type: UPDATE,
        update
    }
}

export const update = (data) => {
    return (dispatch) => {
        dispatch(updata_some(data))
    }
}


function getCookieValue(key) {
    if(!cookieKey(key)) return "";
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${key}=`))
        .split('=')[1];
    return cookieValue;
}

function cookieKey(key) {
    if (document.cookie.split(';').some((item) => item.trim().startsWith(`${key}=`))) {
        return true;
    }
    return false;
}
