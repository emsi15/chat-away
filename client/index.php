<!doctype html>
<html lang='en' class='no-js'>
<head>
<meta charset='utf-8' />
<title>Chat Away - a socket.io chat server/client</title>
<link rel="stylesheet/less" type="text/css" href="style.less">
<script type="text/javascript">                                    
less = { env: 'development' };                                                                 
</script>
<script src="js/less.min.js"></script>
</head>
	<div class='container'>
	<a href='../client'><img id='logo' class='logo' src='../img/logoblack.png' /></a>
	<div id="setup">
		<div class="input-group">      
	    	<input id='username' type="text" required>
	    	<span class="highlight"></span>
	   	 	<span class="bar"></span>
	    	<label>Who are you?</label>
	  	</div>
  		<div id='feedback'></div> <br />
		<button class='button' id='connect'>JOIN CHAT</button>
	</div>
	<div id="chat">
		<div id="log"></div>
		<div id="users">
			<span class='user-title'>NOW CHATTING</span>
			<span id='userList'></span>
		</div>
		<input type="text" placeholder="Write your message.." id='message' autofocus='autofocus' />
	</div>
	</div>
<script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
<script src="js/jquery-2.1.3.js"></script>
<script src="js/jquery-ui.js"></script>
<script src="main.js"></script>
</body>
</html>