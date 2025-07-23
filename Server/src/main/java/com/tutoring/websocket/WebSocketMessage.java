package com.tutoring.websocket;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WebSocketMessage {
    
    private String to;
    private String from;
    private String type;
    private JsonNode data;
    private String sessionId;
    
    // Default constructor for Jackson
    public WebSocketMessage() {
    }
    
    public WebSocketMessage(String to, String from, String type, JsonNode data, String sessionId) {
        this.to = to;
        this.from = from;
        this.type = type;
        this.data = data;
        this.sessionId = sessionId;
    }
    
    // Getters and setters
    public String getTo() {
        return to;
    }
    
    public void setTo(String to) {
        this.to = to;
    }
    
    public String getFrom() {
        return from;
    }
    
    public void setFrom(String from) {
        this.from = from;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public JsonNode getData() {
        return data;
    }
    
    public void setData(JsonNode data) {
        this.data = data;
    }
    
    public String getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
    
    @Override
    public String toString() {
        return "WebSocketMessage{" +
                "to='" + to + '\'' +
                ", from='" + from + '\'' +
                ", type='" + type + '\'' +
                ", sessionId='" + sessionId + '\'' +
                ", data=" + data +
                '}';
    }
}