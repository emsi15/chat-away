<?php $title='Talk! Talk! Talk!'; include(__DIR__ . '/../mall/header.php'); ?>
 
<div id='flash'>
	<h1>Talk! Talk! Talk!</h1>
	<div id="setup">
	<p>
		<label>Host: </label><input id='url' value='localhost'/>
		<label>Port: </label><input id='port' value='1337' /><br />
		<p>
		<label>Who are you? </label><br /><input type="text" value='Chatter' id='username' /><br />
		</p>
		<button id='connect'>Connect</button><span id='feedback'></span>
	</p>
	</div>
	<div id="settings">
		<button disabled id='disconnect'>Disconnect</button>
	</div>
	<div id="chat">
		<div id="log"></div>
		<div id="users"></div>
		<input type="text" placeholder="Write your message.." id='message' />
	</div>
</div>
<script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
<?php $path=__DIR__; include(__DIR__ . '/../mall/footer.php'); ?>