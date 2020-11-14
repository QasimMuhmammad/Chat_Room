const { count } = require('console');

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let chatLogs = []
let onlineUsers = []
let uniqueUserNames = []
let userCount = 0


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Will put all events here
io.on('connection', (socket) => {
  console.log('A user has connected to the server');

  // Inside this function, I can hold local variables for the specific user, Use these to to hold the username and color
  let userForInstance = null;
  let colorForUser = null;

  // On disconnect, I would like to remove user from the online users list
  socket.on('disconnect', () =>{
    console.log('user disconnected', userForInstance);
    if(userForInstance !== null){
      var index = onlineUsers.indexOf(userForInstance.user.toLowerCase());
      if (index !== -1) {
        onlineUsers.splice(index, 1);
      }
      let data = {chat:chatLogs,online:onlineUsers};
      io.emit('update', data)
    }
  })

  // On specific disconnect, I would like to remove user from the online users list
  socket.on('disconnect-user', () =>{
    console.log('user disconnect-user', userForInstance);
    if(userForInstance !== null){
      var index = onlineUsers.indexOf(userForInstance.user.toLowerCase());
      if (index !== -1) {
        onlineUsers.splice(index, 1);
      }
      let data = {chat:chatLogs, online:onlineUsers};
      io.emit('update', data)
    }
  })

  // On register, I would like to add a new user to the list and return their username
  socket.on('register', () =>{
    console.log('user trying to register');
    // Check cookies if they were here from before, if yes give old username

    // If not old user, give them a new username 
    let user = 'username' + userCount++;
    colorForUser = '000000'
    userForInstance = {user:user, color:colorForUser};

    onlineUsers.push(user.toLowerCase())
    uniqueUserNames.push(user.toLowerCase())

    let data = {chat:chatLogs,online:onlineUsers,user:userForInstance};
    socket.emit('initialize', data)

    let updateData = {chat:chatLogs,online:onlineUsers}
    io.emit('update', updateData)
  })

  // Coookie user detected, need to just update their logs as well as make sure they show up online up 
  socket.on('update-chat', (value) =>{
    console.log('upchate chat has: ', value)
    var index = onlineUsers.indexOf(value.user.user.toLowerCase());
    if (index === -1) {
      onlineUsers.push(value.user.user.toLowerCase());
      index = uniqueUserNames.push(value.user.user.toLowerCase());
    }
    userForInstance = value.user
    colorForUser = value.user.color
    let updateData = {chat:chatLogs, online:onlineUsers}
    io.emit('update', updateData)
  })

  // Retrieved a message for the chat, could be command or actual message
  socket.on('send-message', (msg) =>{
    console.log('user sent message', msg);
    // Check for command
    let split = msg.content.split(' ')

    if(split[0][0] ==='/'){
      console.log('in command detection')
      if(split.length === 2){

        // Color Change Command
        if(split[0] ==='/color'){
          if(isHexColor(split[1])){
            let newColor = split[1];

            for(let i = 0; i < chatLogs.length; i++){  
              if(chatLogs[i].user ===userForInstance.user){
                chatLogs[i]= {...chatLogs[i],color:newColor}
              }
            }
            colorForUser = newColor
            userForInstance = {...userForInstance, color:newColor}
            let data = {chat:chatLogs,online:onlineUsers,user:userForInstance};
            socket.emit('initialize', data)
  
            let updateData = {chat:chatLogs,online:onlineUsers}
            io.emit('update', updateData)
          }
        } else if (split[0] ==='/username'){
          // New username, lets replace all old messages with new one, 
          // change this instance var and also send a intialize and a io emit
          
          let newUser = split[1].toLowerCase()
          let index = onlineUsers.indexOf(newUser.toLowerCase());
          let index2 = uniqueUserNames.indexOf(newUser.toLowerCase());
          if (index === -1 && index2 === -1) {

            for(let i = 0; i < chatLogs.length; i++){
              if(chatLogs[i].user ===userForInstance.user){
                chatLogs[i]= {...chatLogs[i],user:newUser}
              }
            }
            index = onlineUsers.indexOf(userForInstance.user.toLowerCase());
            onlineUsers.splice(index, 1);
            userForInstance = {...userForInstance, user:newUser, color:colorForUser};
            onlineUsers.push(userForInstance.user.toLowerCase());
            uniqueUserNames.push(userForInstance.user.toLowerCase());

            let data = {chat:chatLogs,online:onlineUsers,user:userForInstance};
            socket.emit('initialize', data)
  
            let updateData = {chat:chatLogs,online:onlineUsers}
            io.emit('update', updateData)


          }
        }
      }

    } else{ 
      
      // Simple update onto the message list
      let timeStamp = getDate();
      msg = {...msg, timeStamp:timeStamp};

      // Remove first message if at max of 200 messages
      if(chatLogs.length === 200){
        chatLogs.splice(0,1);
      }

      chatLogs.push(msg)
      let updateData = {chat:chatLogs,online:onlineUsers}
      io.emit('update', updateData)
    }
  })


});

http.listen(3000, () => {
  console.log('listening on *:3000');
});


function isHexColor (hex) {
  return typeof hex === 'string'
      && hex.length === 6
      && !isNaN(Number('0x' + hex))
}

// Function to retrieve current timestamp for a message
function getDate(){
  let currentdate = new Date(); 
  return currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
}