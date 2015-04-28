## Chat Away
 
### How to use the server

- You need Node.js installed to be able to run the server.
- Download chat-server.js from /server folder in the repo.
- The server is built using the socket.io engine. Install this through the Node Package Manager (NPM).

```
npm install socket.io
```

```
node chat-server.js
```
### Known issues/backlog - Server

- Multi chat room support
- Admin rights support
- Disallow usernames with space in them (bug while sending private messages to these right now)
- Case insensitivity for usernames

### Known issues/backlog - Client
- 