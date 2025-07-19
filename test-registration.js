// Simple test script to test registration endpoint
const axios = require('axios');

const API_URL = 'http://localhost:8080';

async function testStudentRegistration() {
    try {
        console.log('Testing student registration...');
        const response = await axios.post(`${API_URL}/auth/register`, {
            email: 'student@test.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            role: 'STUDENT',
            phoneNumber: '1234567890'
        });
        
        console.log('Student registration successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Student registration failed:', error.response?.data || error.message);
        return null;
    }
}

async function testTutorRegistration() {
    try {
        console.log('Testing tutor registration...');
        const response = await axios.post(`${API_URL}/auth/register`, {
            email: 'tutor@test.com',
            password: 'password123',
            firstName: 'Jane',
            lastName: 'Smith',
            role: 'TUTOR',
            phoneNumber: '1234567890',
            bio: 'Experienced math tutor with 5 years of experience',
            subjects: ['MATHEMATICS', 'PHYSICS'],
            hourlyRate: 25.0
        });
        
        console.log('Tutor registration successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Tutor registration failed:', error.response?.data || error.message);
        return null;
    }
}

async function testLogin(email, password) {
    try {
        console.log(`Testing login for ${email}...`);
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: email,
            password: password
        });
        
        console.log('Login successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        return null;
    }
}

async function runTests() {
    console.log('Starting registration and login tests...\n');
    
    // Test student registration
    const studentResult = await testStudentRegistration();
    console.log('\n---\n');
    
    // Test tutor registration
    const tutorResult = await testTutorRegistration();
    console.log('\n---\n');
    
    // Test login if registration was successful
    if (studentResult) {
        await testLogin('student@test.com', 'password123');
        console.log('\n---\n');
    }
    
    if (tutorResult) {
        await testLogin('tutor@test.com', 'password123');
    }
    
    console.log('\nTests completed!');
}

// Run the tests
runTests();