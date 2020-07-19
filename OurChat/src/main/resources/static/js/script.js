'use strict';

document.querySelector('#welcomeForm').addEventListener('submit', connect, true)
document.querySelector('#dialogueForm').addEventListener('submit', sendMessage, true)

var stompClient = null;
var name = null;

function connect(event) {
	name = document.querySelector('#name').value.trim();

	if (name) {
		document.querySelector('#welcome-page').classList.add('hidden');
		document.querySelector('#dialogue-page').classList.remove('hidden');

		var socket = new SockJS('/websocketApp');//metion the endpoint
		stompClient = Stomp.over(socket);//embed the endpoint in stomp client

		stompClient.connect({}, connectionSuccess);//connect with the end point in WebSocketChatConfig...after connection success call the function
	}
	event.preventDefault();
}

function connectionSuccess() {
	stompClient.subscribe('/topic/chat', onMessageReceived);//there is no service call here...automatically runs on specific schedule to fetch the messages from queue

	stompClient.send("/app/chat.newUser", {}, JSON.stringify({//server call to send message to queue with type new user
		sender : name,
		type : 'newUser'
	}))

}

function sendMessage(event) {
	var messageContent = document.querySelector('#chatMessage').value.trim();

	if (messageContent && stompClient) {
		var chatMessage = {
			sender : name,
			content : document.querySelector('#chatMessage').value,
			type : 'CHAT'
		};

		stompClient.send("/app/chat.sendMessage", {}, JSON//server call to send message to queue with type Chat
				.stringify(chatMessage));
		document.querySelector('#chatMessage').value = '';
	}
	event.preventDefault();
}

/*This function is called each time it fetches messages from queue..... from the subscribe function above*/
function onMessageReceived(payload) {
	var message = JSON.parse(payload.body);

	var messageElement = document.createElement('li');

	if (message.type === 'newUser') {
		messageElement.classList.add('event-data');
		message.content = message.sender + 'has joined the chat';
	} else if (message.type === 'Leave') {
		messageElement.classList.add('event-data');
		message.content = message.sender + 'has left the chat';
	} else {
		messageElement.classList.add('message-data');

		var element = document.createElement('i');
		var text = document.createTextNode(message.sender[0]);
		element.appendChild(text);

		messageElement.appendChild(element);

		var usernameElement = document.createElement('span');
		var usernameText = document.createTextNode(message.sender);
		usernameElement.appendChild(usernameText);
		messageElement.appendChild(usernameElement);
	}

	var textElement = document.createElement('p');
	var messageText = document.createTextNode(message.content);
	textElement.appendChild(messageText);

	messageElement.appendChild(textElement);

	document.querySelector('#messageList').appendChild(messageElement);
	document.querySelector('#messageList').scrollTop = document
			.querySelector('#messageList').scrollHeight;

}