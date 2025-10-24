// API Configuration and Helper Functions
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : 'https://franciscan-school.onrender.com/api';

class APIClient {
  constructor() {
    this.token = this.getStoredToken();
  }

  getStoredToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  setToken(token, remember = false) {
    this.token = token;
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      // If it's a network error and we're trying to reach the backend,
      // it might be unavailable (development mode)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.warn('Backend API unavailable, using local mode');
      }
      throw error;
    }
  }

  // Authentication
  async login(username, password, role) {
    // Local authentication for demo/development
    const localUsers = {
      'superadmin': {
        password: 'FranciscanAdmin2025!',
        role: 'admin',
        name: 'Super Administrator',
        id: 'admin001'
      },
      'bursar': {
        password: 'bursar123',
        role: 'bursar',
        name: 'School Bursar',
        id: 'bursar001'
      }
    };

    // Check local users first
    const user = localUsers[username.toLowerCase()];
    if (user && user.password === password) {
      const token = 'demo-token-' + Date.now();
      this.setToken(token);
      return {
        id: user.id,
        username: username,
        name: user.name,
        role: user.role
      };
    }

    // If no local user found, try backend API
    try {
      const response = await this.request('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password, role })
      });

      if (response.success) {
        this.setToken(response.token);
        return response.user;
      }
    } catch (error) {
      // Backend not available, fall through to error
    }
    
    throw new Error('Invalid credentials');
  }

  // Payments
  async getPayments() {
    return await this.request('/payments');
  }

  async addPayment(paymentData) {
    return await this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }

  async clearPayments() {
    return await this.request('/payments', {
      method: 'DELETE'
    });
  }

  // Dashboard Stats
  async getDashboardStats() {
    try {
      return await this.request('/dashboard/stats');
    } catch (error) {
      // Return mock data if backend unavailable
      return {
        totalStudents: 0,
        totalTeachers: 0,
        totalPayments: 0,
        pendingPayments: 0
      };
    }
  }

  // Receipts
  async generateReceipt(paymentId) {
    return await this.request('/receipts', {
      method: 'POST',
      body: JSON.stringify({ paymentId })
    });
  }
}

// Global API instance
window.api = new APIClient();