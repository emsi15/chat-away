$(document).ready(function () {
    "use strict";
    var url = document.getElementById('url'),
        port = document.getElementById('port'),
        socket,
        username = '';

    function displayInChatInChat(msg) {
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

        socket.on('display chat', function() {
            toggleVisibility();
            displayInChat('You are now connected!');
            disableFields(true, true, true, false);
        });

        socket.on('new message', function(data){
            displayInChat(data.user + ': ' + data.message);
        });

        socket.on('me', function(data){
            displayInChat('** '+ data.user + data.message);
        });

        socket.on('user joined', function (data) {
            displayInChat(data + ' joined the chat');
        }); 

        socket.on('user left', function (data) {
            displayInChat(data + ' left the chat');
        }); 

        socket.io.on('connect_error', function(err) {
            console.log('Error connecting to server: ' + err);
            socket.disconnect();
        });
    });

    $(document).keypress(function(e) {
        //Send message on enter
        if(e.which == 13) {
            processMessage(); 
        }
    });

     $('#disconnect').on('click', function(event) {
         if (socket) socket.disconnect();
         displayInChat('Disconnected');
         disableFields(false, false, false, true);
         toggleVisibility();
     });

    function processMessage() {
        var message = $('#message').val();
        //Do not do anything with empty messages
        if (message) {
            //Check for function command starting with /, otherwise emit message.
            if(message.match("^/")) {
                commandControl(message);    
            } else {
                socket.emit('new message', clean(message));                
            }
            $('#message').val('');              
        }
    }

    function commandControl(message) {
        if (message.match("^/me ")) {
            socket.emit('me', clean(message).substring(3));
        } else {
            displayInChat('Unknown command');
        }
    }

    function clean(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    
});

