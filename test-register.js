// Test script pour vérifier l'inscription
const { register } = require('./server/action/auth/register.ts');

async function testRegister() {
  try {
    const testUser = {
      email: 'test@example.com',
      password: 'TestPassword123'
    };
    
    console.log('Testing registration with:', testUser);
    const result = await register(testUser);
    console.log('Registration successful:', result);
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
}

testRegister();