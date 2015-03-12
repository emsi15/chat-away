var port = 1337;
var server = require('http').createServer();
var io = require('socket.io')(server);

io.origins('http://dbwebb.se:* http://localhost:* http://www.student.bth.se:*');

io.on('connection', function(socket){

  socket.on('disconnect', function(){
    console.log(socket.username + ' disconnected');
    socket.broadcast.emit('user left', socket.username);
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
    socket.username = username;
    socket.broadcast.emit('user joined', socket.username);
    console.log(socket.username + ' connected');
  });

});

server.listen(port, function() {
    console.log('Server listening on port: ' + port);
});

