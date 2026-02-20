// API Client for Franciscan Catholic School
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : '/api';

window.api = {
  token: null,

  // Set authentication token
  setToken(token, remember = false) {
    this.token = token;
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('authToken', token);
  },

  // Get authentication token
  getToken() {
    if (this.token) return this.token;
    return sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  },

  // Login user
  async login(username, password, role) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.success) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Store token if provided
      if (data.token) {
        this.token = data.token;
      }

      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Change password
  async changePassword(username, currentPassword, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, currentPassword, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }

      return data;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  },

  // Update profile
  async updateProfile(username, fullName, email) {
    try {
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, fullName, email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }
};
