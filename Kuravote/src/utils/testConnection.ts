// Test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/test/');
    const data = await response.json();
    console.log('✅ Backend connection successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    throw error;
  }
};
