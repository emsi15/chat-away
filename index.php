<!doctype html>
<html lang='en' class='no-js'>
<head>
<meta charset='utf-8' />
<title><?=isset($title) ? $title : 'Talk!'?></title>
<link rel="stylesheet/less" type="text/css" href="style.less">
<script type="text/javascript">                                    
less = { env: 'development' };                                                                 
</script>
<script src="../../less.min.js"></script>
<script src="../../modernizr.js"></script>
</head>
	<div class='container'>
	<a href='../chat-away'><img id='logo' class='logo' src='img/logoblack.png' /></a>
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
<script src="../../jquery-2.1.3.js"></script>
<script src="../../jquery-ui.js"></script>
<script src="../../helper.js"></script>
<script src="main.js"></script>
</body>
</html>