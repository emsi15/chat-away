var port = 1337;
var server = require('http').createServer();
var io = require('socket.io')(server);

var usernames = {};

io.origins('http://dbwebb.se:* http://localhost:* http://www.student.bth.se:*');

io.on('connection', function(socket){
  var userConnected = false;

  socket.on('disconnect', function(){
    if(userConnected) {
      console.log(socket.username + ' disconnected');
      delete usernames[socket.username];
      socket.broadcast.emit('user left', {user: socket.username, users: Object.keys(usernames)});
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

  socket.on('private message', function(data, callback) {
    if (data.recipient in usernames) {
      usernames[data.recipient].emit('private message', {user: socket.username, message: data.msg});
      console.log('pm sent to: ' + data.recipient + " msg: " + data.msg);
      callback({msg: '[PM -> '+data.recipient+'] ' + data.msg, style: 'pm'});
    } else {
      callback({msg: 'Error: User ' + data.recipient + ' is not in the chat', style: 'error'});
    }
  });

  socket.on('new user', function (username) {
      if (username in usernames) {
        console.log('user already exists');
        socket.emit('username taken');
      } else {
        socket.username = username;
        usernames[socket.username] = socket;
        socket.broadcast.emit('user joined', {user: socket.username, users: Object.keys(usernames)});
        console.log(socket.username + ' connected');  
        userConnected = true;
        socket.emit('init chat', Object.keys(usernames));
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
