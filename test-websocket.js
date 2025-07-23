// Simple WebSocket test script
const WebSocket = require('ws');

console.log('Testing WebSocket connection...');

let ws1, ws2;
let student_connected = false;
let tutor_connected = false;

// Test with user ID 1 (student)
ws1 = new WebSocket('ws://localhost:8080/ws?userId=1');

ws1.on('open', function open() {
    console.log('Student WebSocket connected (User ID: 1)');
    student_connected = true;
    checkAndSendCallRequest();
});

ws1.on('message', function message(data) {
    const message = JSON.parse(data.toString());
    console.log('Student received:', message);
});

ws1.on('error', function error(err) {
    console.error('Student WebSocket error:', err);
});

// Test with user ID 2 (tutor)
setTimeout(() => {
    ws2 = new WebSocket('ws://localhost:8080/ws?userId=2');

    ws2.on('open', function open() {
        console.log('Tutor WebSocket connected (User ID: 2)');
        tutor_connected = true;
        checkAndSendCallRequest();
    });

    ws2.on('message', function message(data) {
        const message = JSON.parse(data.toString());
        console.log('Tutor received:', message);

        // If it's a call request, send acceptance
        if (message.type === 'call-request') {
            console.log('Tutor accepting call...');
            const acceptMessage = {
                type: 'call-accept',
                from: 2,
                to: 1,
                sessionId: message.sessionId,
                timestamp: Date.now()
            };
            ws2.send(JSON.stringify(acceptMessage));
        }
    });

    ws2.on('error', function error(err) {
        console.error('Tutor WebSocket error:', err);
    });
}, 1000);

function checkAndSendCallRequest() {
    if (student_connected && tutor_connected) {
        console.log('Both users connected, sending call request...');

        // Wait a bit more to ensure connections are fully established
        setTimeout(() => {
            const callRequest = {
                type: 'call-request',
                from: 1,
                to: 2,
                data: { callerName: 'Test Student' },
                sessionId: 'test_session_123',
                timestamp: Date.now()
            };

            console.log('Sending call request:', callRequest);
            ws1.send(JSON.stringify(callRequest));
        }, 500);
    }
}

// Close connections after 8 seconds
setTimeout(() => {
    console.log('Closing connections...');
    if (ws1) ws1.close();
    if (ws2) ws2.close();
}, 8000);