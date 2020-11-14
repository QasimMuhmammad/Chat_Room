const { count } = require('console');

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let chatLogs = []
let onlineUsers = []
let usersEnteredMessage = []
let userCount = 0



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Will put all events here
io.on('connection', (socket) => {
  console.log('A user has connected to the server');
  let userForInstance = null;
  let colorForUser = null;

  socket.on('disconnect', () =>{
    console.log('user disconnected', userForInstance);
    if(userForInstance !== null){
      var index = onlineUsers.indexOf(userForInstance.user);
      if (index !== -1) {
        onlineUsers.splice(index, 1);
      }
      let data = {chat:chatLogs,online:onlineUsers};
      io.emit('update', data)
    }
  })

  socket.on('disconnect-user', () =>{
    console.log('user disconnect-user', userForInstance);
    if(userForInstance !== null){
      var index = onlineUsers.indexOf(userForInstance.user);
      if (index !== -1) {
        onlineUsers.splice(index, 1);
      }
      let data = {chat:chatLogs, online:onlineUsers};
      io.emit('update', data)
    }
  })

  socket.on('register', () =>{
    console.log('user trying to register');
    // Check cookies if they were here from before, if yes give old username

    // If not old user, give them a new username 
    let user = 'Username' + userCount++;
    colorForUser = '000000'
    userForInstance = {user:user, color:colorForUser};

    onlineUsers.push(user)

    let data = {chat:chatLogs,online:onlineUsers,user:userForInstance};
    socket.emit('initialize', data)

    let updateData = {chat:chatLogs,online:onlineUsers}
    io.emit('update', updateData)
  })

  socket.on('update-chat', (value) =>{
    // Coookie user detected, need to just update their logs as well as make sure they show up online up 
    console.log('upchate chat has: ', value)
    var index = onlineUsers.indexOf(value.user.user);
    if (index === -1) {
      onlineUsers.push(value.user.user);
    }
    userForInstance = value.user
    colorForUser = value.user.color
    let updateData = {chat:chatLogs, online:onlineUsers}
    io.emit('update', updateData)
  })

  socket.on('send-message', (msg) =>{
    console.log('user sent message', msg);
    // Check for command
    let split = msg.content.split(' ')
    if(split[0] ==='/color' || split[0] === '/username'){
      console.log('in command detection')
      if(split.length === 2){
        if(split[0] ==='/color'){
          if(split[1].length === 6){
            let newColor = split[1];

            for(let i = 0; i < chatLogs.length; i++){  
              if(chatLogs[i].user ===userForInstance.user){
                chatLogs[i]= {...chatLogs[i],color:newColor}
              }
            }
            colorForUser = newColor
            userForInstance = {...userForInstance, color:newColor}
          }
        } else{
          let newUser = split[1]
          var index = onlineUsers.indexOf(newUser);
          if (index === -1) {
            // New username, lets replace all old messages with new one, 
            // change this instance var and also send a intialize and a io emit

            for(let i = 0; i < chatLogs.length; i++){
              if(chatLogs[i].user ===userForInstance.user){
                chatLogs[i]= {...chatLogs[i],user:newUser}
              }
            }
            var index = onlineUsers.indexOf(userForInstance.user);
            onlineUsers.splice(index, 1);
            userForInstance = {...userForInstance, user:newUser, color:colorForUser};
            onlineUsers.push(userForInstance.user);

          }
        }
          let data = {chat:chatLogs,online:onlineUsers,user:userForInstance};
          socket.emit('initialize', data)

          let updateData = {chat:chatLogs,online:onlineUsers}
          io.emit('update', updateData)
      }

    } else{ 
      
      // Simple update onto the message list
      let timeStamp = getDate();
      msg = {...msg, timeStamp:timeStamp};
      chatLogs.push(msg)
      let updateData = {chat:chatLogs,online:onlineUsers}
      io.emit('update', updateData)
    }
  })


});

http.listen(3000, () => {
  console.log('listening on *:3000');
});


// const isColor = (strColor) => {
//   const s = new Option().style;
//   s.color = strColor;
//   return s.color !== '';
// }

function getDate(){
  let currentdate = new Date(); 
  return currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
}