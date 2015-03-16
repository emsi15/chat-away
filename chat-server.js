var port = 1337;
var server = require('http').createServer();
var io = require('socket.io')(server);

var usernames = [];

io.origins('http://dbwebb.se:* http://localhost:* http://www.student.bth.se:*');

io.on('connection', function(socket){
  var userConnected = false;

  socket.on('disconnect', function(){
    if(userConnected) {
      console.log(socket.username + ' disconnected');
      removeUser(socket.username);
      socket.broadcast.emit('user left', {user: socket.username, users: usernames});
    }
  });

  socket.on('new message', function(msg){
    io.emit('new message', {user: socket.username, message: msg});
    console.log(socket.username + ': ' + msg);
  });

  socket.on('me', function(msg){
    io.emit('me', {user: socket.username, message: msg});
    console.log('** ' + socket.username + msg);
  });

  socket.on('new user', function (username) {
    console.log(usernames);
    if (nameTaken(username)) {
      console.log('user already exists');
      socket.emit('username taken');
    } else {
      usernames.push(username);
      socket.username = username;
      socket.broadcast.emit('user joined', {user: socket.username, users: usernames});
      console.log(socket.username + ' connected');  
      userConnected = true;
      socket.emit('init chat', usernames);
    }
  });

});

server.listen(port, function() {
    console.log('Server listening on port: ' + port);
});

function nameTaken(name) {
    for (var i=0; i<usernames.length; i++) {
      if (usernames[i] === name) {
        return true;
      }
    }
    return false;
}

function removeUser(username) {
  var index = usernames.indexOf(username);
  if (index !== -1) {
    usernames.splice(index, 1);
  }
}
