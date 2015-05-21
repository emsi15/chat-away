## Chat Away
 
### How to use the server

- You need Node.js installed to be able to run the server.
- Download or clone the git repository.
- The server is built using the socket.io engine. Install this through the Node Package Manager (NPM):

```
npm install socket.io (when located inside the server directory)
```

To run the server, browse to the server directory and type:


```
node chat-server.js
```

Ready to go!


**NOTE!**  
Minor adjustments to chat-server.js may be needed to better suit your hosting.  Default port is 1337 and allowed origins for connecting to the server is also specified. This can be changed in chat-server.js at:

```
Line 1: var port = 1337;
```

```
Line 7: io.origins('http://dbwebb.se:* http://localhost:* http://www.student.bth.se:*');****
```
### Connect the client
It is easy to get going with the client once the server is up and running. Default server host in the client is 127.0.0.1:1337 (localhost) and if you are running the server locally this will work fine out of the box. If you need to change the host you can do so in client/main.js:

```
Line 4: host = '127.0.0.1:1337'
```

Now, just pick a username and start chatting! 

Do you want to build your own client to chat with?  
Check the [Server API](#api) to learn more about the events that can be sent and received by the server.

### Upcoming features
Here is a few features that are currently being developed and hopefully will be released in the near future.

- Multi chat room support for both server and client
- Theme selection/customization for better looking integration on existing websites.
- Admin privileges 

### Known issues

Currently known issues can be found in [Issues](https://github.com/emsi15/chat-away/issues "Issues").
Feel free to submit an issue if you find something that seems strange.

<a id="api"></a>
### Server API 

The server listens to events sent by the client. You should be familiar with how socket.io events work if you want to build your own implementation. Here is a detailed walkthrough of the events supported by the server: 

**socket.on('new user', function (username){}):**  
Checks if the connecting 'username' is allowed to join the server.  
If the username exists the server return:  
```
socket.emit('username taken');
```  
If not, two events are being returned to the client. 
The first one contains the new user together with a list of all currently connected users:
```
socket.broadcast.emit('user joined', {user: socket.username, users: Object.keys(usernames)});
```
Followed by an event to initialize the chat for the newly connected user:  
```
socket.emit('init chat', Object.keys(usernames));
```


**socket.on('new message', function (msg){}):**  
Broadcasting a new message to all connected users by returning:   
```
io.emit('new message', {user: socket.username, message: msg});
```


**socket.on('me', function (msg){}):**  
Broadcasting a /me style message to all connected users by returning:  
```
io.emit('me', {user: socket.username, message: msg});
```

**socket.on('private message', function (data, callback){}):**  
Checks if recipient is available on the server. If available a private message is sent to the user through:  
```
usernames[recipient].emit('private message', {user: socket.username, message: msg});
```  
If user does not exist, an error callback is being sent back that the client may handle:  
```
callback({msg: 'Error: User ' + recipient + ' is not in the chat', style: 'error'});
```

**socket.on('switch username', function (newName, callback){}):**  
Checks if username already exists in the chat. If so, an error callback is being returned by the server:  
```
callback({msg: 'Username ' + newName +' already exists!', style: 'error'});
```  
If username is available, the old and new username is being sent back to the client together with a refreshed list of all available users on the server:
```
io.emit('switched username', {oldName: oldName, newName: socket.username, users: Object.keys(usernames)});
```

**socket.on('disconnect', function (){}):**  
Removes the user from list of connected users and broadcasts an event to the remaining users with who just quit and all that are still left in the chat:
```
socket.broadcast.emit('user left', {user: socket.username, users: Object.keys(usernames)});
```