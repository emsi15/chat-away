<?php $title='Talk! Talk! Talk!'; 
include(__DIR__ . '/../mall/header.php'); 
?>
 
<div id='flash'>
	<div id='chat-client'>
	<h3>Talk! Talk! Talk!</h3>
	<div id="setup">
	<p>
		<label>Host: </label><input id='url' value='localhost'/>
		<label>Port: </label><input id='port' value='1337' /><br />
		<p>
		<label>Who are you? </label><br /><input type="text" placeholder="Write your name.." id='username' /><br />
		</p>
		<button id='connect'>Connect</button><span id='feedback'></span>
	</p>
	</div>
<!-- 	<div id="settings">
		<button id='disconnect'>Leave the chat</button>
	</div> -->
	<div id="chat">
		<div id="log"></div>
		<div id="users">
			<span class='users'>NOW TALKING</span>
			<span id='userList'></span>
		</div>
		<input type="text" placeholder="Write your message.." id='message' />
	</div>
	</div>
</div>
<script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
<?php $path=__DIR__; include(__DIR__ . '/../mall/footer.php'); ?>