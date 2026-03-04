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
  },

  // Teachers API
  async getTeachers() {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers`, {
        headers: { 'Authorization': `Bearer ${this.getToken() || 'dummy-token'}` }
      });
      
      if (!response.ok) {
        console.warn('API failed, using localStorage');
        return JSON.parse(localStorage.getItem('teachers') || '[]');
      }
      
      const data = await response.json();
      return data.teachers || [];
    } catch (error) {
      console.warn('API error, using localStorage:', error);
      return JSON.parse(localStorage.getItem('teachers') || '[]');
    }
  },

  async addTeacher(teacher) {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken() || 'dummy-token'}`
        },
        body: JSON.stringify({
          teacher_id: teacher.username,
          full_name: `${teacher.firstName} ${teacher.lastName}`,
          email: teacher.email,
          phone: teacher.phone,
          subject: teacher.specialization,
          qualification: teacher.qualification,
          password: teacher.password
        })
      });
      
      if (!response.ok) {
        console.warn('API failed, saving to localStorage');
        const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
        const newTeacher = {
          id: teachers.length + 1,
          teacher_id: teacher.username,
          full_name: `${teacher.firstName} ${teacher.lastName}`,
          email: teacher.email,
          phone: teacher.phone,
          subject: teacher.specialization,
          qualification: teacher.qualification,
          created_at: new Date().toISOString()
        };
        teachers.push(newTeacher);
        localStorage.setItem('teachers', JSON.stringify(teachers));
        return newTeacher;
      }
      
      const data = await response.json();
      return data.teacher;
    } catch (error) {
      console.warn('API error, saving to localStorage:', error);
      const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
      const newTeacher = {
        id: teachers.length + 1,
        teacher_id: teacher.username,
        full_name: `${teacher.firstName} ${teacher.lastName}`,
        email: teacher.email,
        phone: teacher.phone,
        subject: teacher.specialization,
        qualification: teacher.qualification,
        created_at: new Date().toISOString()
      };
      teachers.push(newTeacher);
      localStorage.setItem('teachers', JSON.stringify(teachers));
      return newTeacher;
    }
  },

  async updateTeacher(id, updates) {
    const response = await fetch(`${API_BASE_URL}/teachers`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      },
      body: JSON.stringify({ id, ...updates })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.teacher;
  },

  async deleteTeacher(id) {
    const response = await fetch(`${API_BASE_URL}/teachers`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      },
      body: JSON.stringify({ id })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }
};
