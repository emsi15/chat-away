$(document).ready(function () {
    "use strict";
    var socket,
        host = '127.0.0.1:1337',
        username = '';

    function displayInChat(msg, style) {
        var log = $('#log');
        log.append('<span class='+style+'>['+ new Date().toLocaleTimeString() + '] '+msg+'</span><br/>');
        log.scrollTop(log.prop('scrollHeight'));
    }

    function disableFields(urlField, userField, connectButton) {
        $('#url').prop('disabled', urlField);
        $('#username').prop('disabled', userField);
        $('#connect').prop('disabled', connectButton);
    }

    function printFeedback(feedback) {
        $('#feedback').html(feedback).addClass('feedback');
    }

    function toggleVisibility(logoClass) {
        $('#chat').toggle();
        $('#setup').toggle();
        $('#logo').removeClass().addClass(logoClass);
    }

    function updateUsers(users) {
        var userList = $('<span>');
        $.each(users, function(i, val) {
            userList.append('<br /><span>'+val+'</span>');
        });
        $('#userList').html(userList);
    }

    function disconnectUser() {
        if (socket) socket.disconnect();
         displayInChat('Disconnected', 'info');
         disableFields(false, false, false);
         toggleVisibility('logo');
    }


    $('#connect').on('click', function(event) {
        username = clean($('#username').val()).trim();

        if (!username) {
            printFeedback('Please select a name before joining the chat');
        } else {

        socket = io.connect(host, {'forceNew':true });

        socket.on('connect', function() {
            socket.emit('new user', username);
        });

        socket.on('username taken', function() {
            socket.disconnect();
            printFeedback('User ' + username + ' is already chatting, please select another name');
        });

        socket.on('init chat', function(data) {
            toggleVisibility('logo-left');
            displayInChat('Welcome to Chat Away, type /help for available commands.', 'info');
            disableFields(true, true, true);
            updateUsers(data);
        });

        socket.on('new message', function(data){
            displayInChat(data.user + ': ' + data.message, 'msg');
        });

        socket.on('me', function(data){
            displayInChat('** '+ data.user + data.message, 'me');
        });

        socket.on('private message', function(data){
            displayInChat('[PM] '+ data.user +': ' + data.message, 'pm');
        });

        socket.on('user joined', function (data) {
            displayInChat(data.user + ' joined the chat', 'info');
            updateUsers(data.users);
        }); 

        socket.on('user left', function (data) {
            displayInChat(data.user + ' left the chat', 'info');
            updateUsers(data.users);
        }); 

        socket.io.on('connect_error', function(err) {
            console.log('Error connecting to server: ' + err);
            socket.disconnect();
        });
    }
    });

    $(document).keypress(function(e) {
        if(e.which == 13) {
            processMessage(); 
        }
    });

     $('#disconnect').on('click', function(event) {
         disconnectUser();
     });

    function processMessage() {
        var message = $('#message').val();
        //Do not do anything with empty messages
        if (message) {
            //Check for function command starting with /, otherwise send ordinary message.
            if(message.match("^/")) {
                command(message);    
            } else {
                socket.emit('new message', clean(message));                
            }
            $('#message').val('');              
        }
    }

    function privateMessage(msg) {
        var parts = clean(msg).split(/[\s]+/);
        var msgPart = Helper.indexJoin(parts, 2);
        socket.emit('private message', {recipient: parts[1], msg: msgPart}, function(callback) {
            displayInChat(callback.msg, callback.style);
        });       
    }

    function command(message) {
        if (message.match("^/me ")) {
            socket.emit('me', clean(message).substring(3));
        } else if (message.match("^/pm ")) {
            privateMessage(message);
        } else if (message === "/quit") {
            disconnectUser();
        } else if (message === "/help") {
            displayInChat('List of available commands:', 'info');
            displayInChat('*   /pm username message : Sends a private message to specified user', 'info');
            displayInChat('*   /me message : IRC-style me-message broadcasted to all users', 'info');
            displayInChat('*   /quit : Disconnect from chat', 'info')
        } else {
            displayInChat('Unknown command', 'error');
        }
    }

    function clean(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    
});

