# WebSocket Implementation for Tutoring Platform

This package contains the WebSocket implementation for real-time communication in the tutoring platform.

## Components

### 1. WebSocketConfig

The main configuration class that registers WebSocket handlers with their respective endpoints:

- `/ws` - Basic signaling endpoint for general WebSocket communication
- `/ws/webrtc` - WebRTC specific signaling for video/audio communication
- `/ws/session` - Tutoring session endpoint for canvas and screen sharing

### 2. SignalingHandler

Basic WebSocket handler that manages connections and forwards messages between users.

### 3. WebRTCSignalingHandler

Specialized handler for WebRTC signaling, supporting:
- Session joining/leaving
- Offer/answer exchange
- ICE candidate exchange
- Participant management

### 4. TutoringSessionHandler

Handles tutoring session specific features:
- Canvas updates
- Screen sharing
- Session subscriptions

## Connection Parameters

When connecting to any WebSocket endpoint, the following query parameters should be provided:

- `userId` (required): The ID of the connecting user
- `sessionId` (optional): The ID of the tutoring session (required for session-specific operations)

## Message Types

### Basic Signaling Messages

```json
{
  "to": "targetUserId",
  "type": "message_type",
  "data": { /* message data */ }
}
```

### WebRTC Signaling Messages

```json
{
  "type": "offer|answer|ice-candidate|join|leave",
  "to": "targetUserId",
  "from": "senderUserId",
  "sessionId": "tutoringSessionId",
  "data": { /* signaling data */ }
}
```

### Tutoring Session Messages

```json
{
  "type": "canvas_update|screen_share|subscribe|unsubscribe",
  "sessionId": "tutoringSessionId",
  "userId": "senderUserId",
  "data": "serializedData"
}
```

## Usage Examples

### Connecting to WebSocket

```java
// Client-side example (JavaScript)
const socket = new WebSocket(`ws://localhost:8080/ws?userId=${userId}`);
```

### Subscribing to a Session

```json
{
  "type": "subscribe",
  "sessionId": "session123"
}
```

### Sending Canvas Update

```json
{
  "type": "canvas_update",
  "sessionId": "session123",
  "userId": "user456",
  "data": "serialized_canvas_data"
}
```

### WebRTC Signaling

```json
{
  "type": "offer",
  "to": "recipient789",
  "from": "sender456",
  "sessionId": "session123",
  "data": { "sdp": "..." }
}
```