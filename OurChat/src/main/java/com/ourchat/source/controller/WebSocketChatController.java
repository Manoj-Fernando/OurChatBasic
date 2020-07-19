/**
 * 
 */
package com.ourchat.source.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.ourchat.source.model.ChatMessage;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Manoj Fernando A
 *
 */

@Controller
@Slf4j
public class WebSocketChatController {

	@MessageMapping("/chat.sendMessage")
	@SendTo("/topic/chat")
	public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
		log.info("*** DEV-LOGS *** Inside Controller with /chat.sendMessage mapping");
		return chatMessage;
	}

	@MessageMapping("/chat.newUser")
	@SendTo("/topic/chat")
	public ChatMessage newUser(@Payload ChatMessage chatMessage,
			SimpMessageHeaderAccessor headerAccessor) {
		log.info("*** DEV-LOGS *** Inside Controller with /chat.newUser mapping");
		headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
		return chatMessage;
	}

}
