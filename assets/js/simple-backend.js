// Simple localStorage-based backend for immediate use
class SimpleBackend {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem('franciscan_users')) {
      const users = {
        bursar: [
          {
            id: 'BUR001',
            username: 'bursar',
            password: 'bursar123',
            name: 'Sr. Clare Ohagwa, OSF',
            role: 'bursar',
            email: 'bursar@franciscancnps.org'
          }
        ]
      };
      localStorage.setItem('franciscan_users', JSON.stringify(users));
    }

    if (!localStorage.getItem('franciscan_payments')) {
      localStorage.setItem('franciscan_payments', JSON.stringify([]));
    }
  }

  login(username, password, role) {
    const users = JSON.parse(localStorage.getItem('franciscan_users') || '{}');
    const userList = users[role] || [];
    const user = userList.find(u => u.username === username && u.password === password);
    
    if (user) {
      const token = 'simple_token_' + Date.now();
      localStorage.setItem('authToken', token);
      return { success: true, user, token };
    }
    throw new Error('Invalid credentials');
  }

  getPayments() {
    const payments = JSON.parse(localStorage.getItem('franciscan_payments') || '[]');
    return { success: true, payments };
  }

  addPayment(paymentData) {
    const payments = JSON.parse(localStorage.getItem('franciscan_payments') || '[]');
    const newPayment = {
      id: `PAY-${Date.now()}`,
      receiptId: `RCPT-${Date.now()}`,
      ...paymentData,
      status: 'paid',
      createdAt: new Date().toISOString()
    };
    payments.push(newPayment);
    localStorage.setItem('franciscan_payments', JSON.stringify(payments));
    return { success: true, payment: newPayment };
  }

  getDashboardStats() {
    const payments = JSON.parse(localStorage.getItem('franciscan_payments') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const todayPayments = payments.filter(p => p.paymentDate === today);
    
    return {
      success: true,
      stats: {
        todayTotal: todayPayments.reduce((sum, p) => sum + p.amount, 0),
        todayCount: todayPayments.length,
        totalPayments: payments.length,
        pendingCount: 0
      }
    };
  }
}

// Replace the API client with simple backend
window.api = {
  login: async (username, password, role) => {
    const backend = new SimpleBackend();
    return backend.login(username, password, role).user;
  },
  
  getPayments: async () => {
    const backend = new SimpleBackend();
    return backend.getPayments();
  },
  
  addPayment: async (paymentData) => {
    const backend = new SimpleBackend();
    return backend.addPayment(paymentData);
  },
  
  getDashboardStats: async () => {
    const backend = new SimpleBackend();
    return backend.getDashboardStats();
  },
  
  setToken: (token, remember) => {
    // Simple token storage
  },
  
  clearToken: () => {
    localStorage.removeItem('authToken');
  }
};