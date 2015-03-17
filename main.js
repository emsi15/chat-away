$(document).ready(function () {
    "use strict";
    var url = document.getElementById('url'),
        port = document.getElementById('port'),
        socket,
        username = '';

    function displayInChat(msg) {
        $('#log').append(new Date().toLocaleTimeString() + ': '+msg+'<br/>');
    }

    function disableFields(urlField, userField, connectButton, disconnectButton) {
        $('#url').prop('disabled', urlField);
        $('#username').prop('disabled', userField);
        $('#connect').prop('disabled', connectButton);
        $('#disconnect').prop('disabled', disconnectButton);
    }

    function printFeedback(feedback) {
        $('#feedback').html(feedback);
    }

    function toggleVisibility() {
        $('#chat').toggle();
        $('#settings').toggle();
        $('#setup').toggle();
    }

    function updateUsers(users) {
        var userList = $('<span>');
        $.each(users, function(i, val) {
            userList.append('<span>'+val+'</span><br />');
        });
        $('#users').html(userList);
    }

    function disconnectUser() {
        if (socket) socket.disconnect();
         displayInChat('Disconnected');
         disableFields(false, false, false, true);
         toggleVisibility();
    }


    $('#connect').on('click', function(event) {
        console.log('Connecting to: ' + url.value + ' port: ' + port.value);
        username = $('#username').val();

        socket = io.connect(url.value+':'+port.value, {'forceNew':true });

        socket.on('connect', function() {
            socket.emit('new user', username);
        });

        socket.on('username taken', function() {
            socket.disconnect();
            printFeedback('Username ' + username + ' is already talking, please select another name');
        });

        socket.on('init chat', function(data) {
            toggleVisibility();
            displayInChat('You are now connected!');
            disableFields(true, true, true, false);
            updateUsers(data);
        });

        socket.on('new message', function(data){
            displayInChat(data.user + ': ' + data.message);
        });

        socket.on('me', function(data){
            displayInChat('** '+ data.user + data.message);
        });

        socket.on('private message', function(data){
            displayInChat('[PM] '+ data.user +': ' + data.message);
        });

        socket.on('user joined', function (data) {
            displayInChat(data.user + ' joined the chat');
            updateUsers(data.users);
        }); 

        socket.on('user left', function (data) {
            displayInChat(data.user + ' left the chat');
            updateUsers(data.users);
        }); 

        socket.io.on('connect_error', function(err) {
            console.log('Error connecting to server: ' + err);
            socket.disconnect();
        });
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
        socket.emit('private message', {recipient: parts[1], msg: msgPart}, function(error) {
            displayInChat(error);
        });       
    }

    function command(message) {
        if (message.match("^/me ")) {
            socket.emit('me', clean(message).substring(3));
        } else if (message.match("^/pm ")) {
            privateMessage(message);
        } else if (message === "/quit") {
            disconnectUser();
        } else {
            displayInChat('Unknown command');
        }
    }

    function clean(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    
});

