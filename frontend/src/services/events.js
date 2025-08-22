// src/services/events.js
export const registerForEvent = async (eventId, payload) => {
  // Mock API call - replace with actual API call later
  console.log(`Registering for event ${eventId} with:`, payload);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: `mock-token-${Math.random().toString(36).substring(2, 10)}-${eventId}`,
        success: true,
        timestamp: new Date().toISOString()
      });
    }, 1500); // Simulate network delay
  });
};