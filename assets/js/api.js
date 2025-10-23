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
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(username, password, role) {
    const response = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role })
    });

    if (response.success) {
      this.setToken(response.token);
      return response.user;
    }
    throw new Error('Login failed');
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
    return await this.request('/dashboard/stats');
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