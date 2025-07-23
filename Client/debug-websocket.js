// Simple WebSocket test to debug the call-request issue
const WebSocket = require('ws');

// Test WebSocket connection
const ws = new WebSocket('ws://localhost:8080/ws?userId=999');

ws.on('open', function open() {
    console.log('Test WebSocket connected');
    
    // Send a test call-request message
    const testMessage = {
        type: 'call-request',
        from: 1,
        to: 2,
        data: { callerName: 'Test Caller' },
        sessionId: 'test_session_123',
        timestamp: Date.now()
    };
    
    console.log('Sending test call-request:', testMessage);
    ws.send(JSON.stringify(testMessage));
});

ws.on('message', function message(data) {
    console.log('Received:', data.toString());
});

ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
});

ws.on('close', function close() {
    console.log('WebSocket closed');
});