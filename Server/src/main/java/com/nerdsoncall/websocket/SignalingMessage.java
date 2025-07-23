package com.nerdsoncall.websocket;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SignalingMessage {

    @JsonProperty("type")
    private String type;

    @JsonProperty("from")
    private Long from;

    @JsonProperty("to")
    private Long to;

    @JsonProperty("data")
    private Object data;

    @JsonProperty("sessionId")
    private String sessionId;

    @JsonProperty("timestamp")
    private Long timestamp;

    // Default constructor
    public SignalingMessage() {
    }

    // Constructor with all fields
    public SignalingMessage(String type, Long from, Long to, Object data, String sessionId, Long timestamp) {
        this.type = type;
        this.from = from;
        this.to = to;
        this.data = data;
        this.sessionId = sessionId;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getFrom() {
        return from;
    }

    public void setFrom(Long from) {
        this.from = from;
    }

    public Long getTo() {
        return to;
    }

    public void setTo(Long to) {
        this.to = to;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "SignalingMessage{" +
                "type='" + type + '\'' +
                ", from=" + from +
                ", to=" + to +
                ", data=" + data +
                ", sessionId='" + sessionId + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}