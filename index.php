<?php $title='Chatter - Beta'; include(__DIR__ . '/../mall/header.php'); ?>
 
<div id='flash'>
	<h2>Chatter</h2>
	<div id="setup">
	<p>
		<label>Server: </label><input id='url' value='localhost:1337'/><br />
		<label>Username: </label><input type="text" value='Chatter' id='username' /><br />
		<button id='connect'>Connect</button>
	</p>
	</div>
	<div id="settings">
		<button disabled id='disconnect'>Disconnect</button>
	</div>
	<div id="chat">
	<div id="log"></div>
		<input type="text" placeholder="Write your message.." id='message' />
	</div>
</div>
<script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
<?php $path=__DIR__; include(__DIR__ . '/../mall/footer.php'); ?>