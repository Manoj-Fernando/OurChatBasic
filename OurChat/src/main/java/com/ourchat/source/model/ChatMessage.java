/**
 * 
 */
package com.ourchat.source.model;

import lombok.Data;

/**
 * @author Manoj Fernando A
 *
 */

@Data
public class ChatMessage {
	private String type;
	private String content;
	private String sender;

	
}