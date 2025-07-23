// Script to create test users for video call testing
const axios = require('axios');

const API_BASE = 'http://localhost:8080';

async function createTestUsers() {
    console.log('Creating test users for video call testing...');
    
    try {
        // Create a student
        console.log('Creating student...');
        const studentResponse = await axios.post(`${API_BASE}/auth/register`, {
            firstName: 'Test',
            lastName: 'Student',
            email: 'teststudent@example.com',
            password: 'password123',
            role: 'STUDENT'
        });
        console.log('✅ Student created:', {
            id: studentResponse.data.user.id,
            email: studentResponse.data.user.email,
            role: studentResponse.data.user.role
        });
        
        // Create a tutor
        console.log('Creating tutor...');
        const tutorResponse = await axios.post(`${API_BASE}/auth/register`, {
            firstName: 'Test',
            lastName: 'Tutor',
            email: 'testtutor@example.com',
            password: 'password123',
            role: 'TUTOR',
            subjects: ['MATHEMATICS', 'PHYSICS'],
            hourlyRate: 25.0,
            bio: 'Test tutor for video call testing'
        });
        console.log('✅ Tutor created:', {
            id: tutorResponse.data.user.id,
            email: tutorResponse.data.user.email,
            role: tutorResponse.data.user.role
        });
        
        console.log('\n🎉 Test users created successfully!');
        console.log('\nTo test video calls:');
        console.log('1. Login as student: teststudent@example.com / password123');
        console.log('2. Login as tutor: testtutor@example.com / password123');
        console.log('3. Student goes to /browse-tutors and clicks Connect');
        console.log('4. Tutor goes to /student-requests to receive the call');
        
    } catch (error) {
        if (error.response) {
            console.error('❌ Error creating users:', error.response.data);
        } else {
            console.error('❌ Network error:', error.message);
        }
    }
}

createTestUsers();