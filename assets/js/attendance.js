/**
 * Attendance Management System
 * Franciscan Catholic Nursery & Primary School
 * 
 * This file handles all attendance-related functionality including:
 * - Taking daily attendance
 * - Editing attendance records
 * - Generating attendance reports
 * - Exporting attendance data
 */

// Helper Functions
function formatDate(dateString) {
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

function getCurrentTime() {
    try {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' + 
               now.getMinutes().toString().padStart(2, '0');
    } catch (error) {
        console.error('Error getting current time:', error);
        return '00:00';
    }
}

function generateDateRange(startDate, endDate) {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dates = [];
        
        let current = new Date(start);
        while (current <= end) {
            dates.push(current.toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
        }
        
        return dates;
    } catch (error) {
        console.error('Error generating date range:', error);
        return [];
    }
}

function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with ID "${id}" not found in the DOM`);
    }
    return element;
}

function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                              type === 'error' ? 'exclamation-circle' : 
                              type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        </div>
        <div class="notification-message">${message}</div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    container.appendChild(notification);
    
    // Add event listener to close button
    notification.querySelector('.notification-close').addEventListener('click', function() {
        container.removeChild(notification);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode === container) {
            container.removeChild(notification);
        }
    }, 5000);
}

// Safe localStorage access
function getStorageItem(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error retrieving data from localStorage (key: ${key}):`, error);
        return null;
    }
}

function setStorageItem(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Error saving data to localStorage (key: ${key}):`, error);
        showNotification('Storage error: Your browser storage might be full.', 'error');
        return false;
    }
}

// API Service for attendance data
const AttendanceAPI = {
    baseUrl: '/api/attendance',
    
    async getAttendance(date, className) {
        try {
            // For development/testing, use localStorage as fallback
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.warn('Using localStorage fallback for attendance data');
                return new Promise(resolve => {
                    setTimeout(() => {
                        const data = getStorageItem(`attendance_${date}_${className}`);
                        if (data) {
                            resolve(data);
                        } else {
                            // Generate sample data for development
                            const students = this.getSampleStudents(className);
                            resolve(students.map(student => ({
                                studentId: student.id,
                                studentName: student.name,
                                status: '',
                                timeIn: '',
                                notes: ''
                            })));
                        }
                    }, 300);
                });
            }
            
            // In production, make actual API call
            const response = await fetch(`${this.baseUrl}?date=${date}&class=${className}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            throw error;
        }
    },
    
    async saveAttendance(date, className, attendanceData) {
        try {
            // For development/testing, use localStorage as fallback
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.warn('Using localStorage fallback for saving attendance');
                return new Promise(resolve => {
                    setTimeout(() => {
                        const success = setStorageItem(`attendance_${date}_${className}`, attendanceData);
                        resolve({ success });
                    }, 300);
                });
            }
            
            // In production, make actual API call
            const response = await fetch(`${this.baseUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    date,
                    className,
                    attendanceData
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error saving attendance data:', error);
            throw error;
        }
    },
    
    async generateReport(params) {
        try {
            // For development/testing, use sample data
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.warn('Using sample data for reports');
                return new Promise(resolve => {
                    setTimeout(() => {
                        if (params.reportType === 'class') {
                            resolve(this.generateSampleClassReport(params));
                        } else if (params.reportType === 'student') {
                            resolve(this.generateSampleStudentReport(params));
                        } else {
                            resolve(this.generateSampleSummaryReport(params));
                        }
                    }, 1000);
                });
            }
            
            // In production, make actual API call
            const response = await fetch(`${this.baseUrl}/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify(params)
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error generating report:', error);
            throw error;
        }
    },
    
    getAuthToken() {
        return sessionStorage.getItem('authToken') || '';
    },
    
    // Sample data generators for development
    getSampleStudents(className) {
        const classMap = {
            'nursery1': { prefix: 'N1', count: 15, name: 'Nursery 1' },
            'nursery2': { prefix: 'N2', count: 18, name: 'Nursery 2' },
            'primary1': { prefix: 'P1', count: 25, name: 'Primary 1' },
            'primary2': { prefix: 'P2', count: 22, name: 'Primary 2' },
            'primary3': { prefix: 'P3', count: 20, name: 'Primary 3' },
            'primary4': { prefix: 'P4', count: 23, name: 'Primary 4' },
            'primary5': { prefix: 'P5', count: 21, name: 'Primary 5' },
            'primary6': { prefix: 'P6', count: 19, name: 'Primary 6' }
        };
        
        const classInfo = classMap[className] || { prefix: 'STD', count: 20, name: 'Unknown Class' };
        const students = [];
        
        const firstNames = ['John', 'Mary', 'David', 'Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'Daniel', 'Sophia'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
        
        for (let i = 1; i <= classInfo.count; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            
            students.push({
                id: `${classInfo.prefix}${i.toString().padStart(3, '0')}`,
                name: `${firstName} ${lastName}`
            });
        }
        
        return students;
    },
    
    generateSampleClassReport(params) {
        const { className, startDate, endDate } = params;
        const dates = generateDateRange(startDate, endDate);
        const students = this.getSampleStudents(className);
        
        // Generate attendance data
        const attendanceData = students.map(student => {
            const presentCount = Math.floor(dates.length * (0.7 + Math.random() * 0.25));
            const lateCount = Math.floor((dates.length - presentCount) * (Math.random() * 0.7));
            const absentCount = dates.length - presentCount - lateCount;
            const attendanceRate = Math.round((presentCount + lateCount) / dates.length * 100);
            
            return {
                ...student,
                presentCount,
                absentCount,
                lateCount,
                attendanceRate
            };
        });
        
        // Calculate statistics
        const perfectAttendance = attendanceData.filter(student => student.absentCount === 0).length;
        const chronicAbsence = attendanceData.filter(student => student.attendanceRate < 90).length;
        const highestAttendanceDay = formatDate(dates[Math.floor(Math.random() * dates.length)]);
        const totalRate = attendanceData.reduce((sum, student) => sum + student.attendanceRate, 0);
        const averageAttendanceRate = Math.round(totalRate / attendanceData.length);
        
        return {
            reportType: 'class',
            className,
            classDisplayName: students.length > 0 ? students[0].id.substring(0, 2) : className,
            startDate,
            endDate,
            students: attendanceData,
            stats: {
                perfectAttendance,
                chronicAbsence,
                highestAttendanceDay,
                averageAttendanceRate
            }
        };
    },
    
    generateSampleStudentReport(params) {
        const { studentId, startDate, endDate } = params;
        const dates = generateDateRange(startDate, endDate);
        
        // Generate sample student data
        const student = {
            id: studentId || 'P1001',
            name: 'John Smith',
            class: 'Primary 1',
            presentCount: 0,
            absentCount: 0,
            lateCount: 0,
            attendanceRate: 0,
            attendanceByMonth: {}
        };
        
        // Generate sample attendance records
        const attendanceRecords = [];
        
        dates.forEach(date => {
            const dayOfWeek = new Date(date).getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            if (!isWeekend) {
                const random = Math.random();
                let status;
                
                if (random < 0.85) {
                    status = 'present';
                    student.presentCount++;
                } else if (random < 0.95) {
                    status = 'late';
                    student.lateCount++;
                } else {
                    status = 'absent';
                    student.absentCount++;
                }
                
                attendanceRecords.push({
                    date,
                    status,
                    timeIn: status === 'present' ? '08:00' : status === 'late' ? '08:' + (Math.floor(Math.random() * 30) + 10) : '',
                    notes: status === 'absent' ? 'Sick leave' : ''
                });
                
                // Group by month for the calendar view
                const month = date.substring(0, 7); // YYYY-MM
                if (!student.attendanceByMonth[month]) {
                    student.attendanceByMonth[month] = [];
                }
                
                student.attendanceByMonth[month].push({
                    date,
                    status,
                    day: parseInt(date.substring(8, 10))
                });
            }
        });
        
        // Calculate attendance rate
        const totalDays = student.presentCount + student.absentCount + student.lateCount;
        student.attendanceRate = totalDays > 0 ? Math.round((student.presentCount + student.lateCount) / totalDays * 100) : 0;
        
        return {
            reportType: 'student',
            student,
            attendanceRecords,
            startDate,
            endDate
        };
    },
    
    generateSampleSummaryReport(params) {
        const { startDate, endDate } = params;
        const dates = generateDateRange(startDate, endDate);
        
        // Generate sample class data
        const classes = [
            { id: 'nursery1', name: 'Nursery 1', students: 15 },
            { id: 'nursery2', name: 'Nursery 2', students: 18 },
            { id: 'primary1', name: 'Primary 1', students: 25 },
            { id: 'primary2', name: 'Primary 2', students: 22 },
            { id: 'primary3', name: 'Primary 3', students: 20 },
            { id: 'primary4', name: 'Primary 4', students: 23 },
            { id: 'primary5', name: 'Primary 5', students: 21 },
                        { id: 'primary6', name: 'Primary 6', students: 19 }
        ];
        
        // Generate sample attendance data for each class
        classes.forEach(cls => {
            cls.presentCount = 0;
            cls.absentCount = 0;
            cls.lateCount = 0;
            cls.totalDays = dates.length * cls.students;
            
            // Generate random attendance counts
            cls.presentCount = Math.floor(cls.totalDays * (0.8 + Math.random() * 0.15));
            cls.lateCount = Math.floor((cls.totalDays - cls.presentCount) * 0.6);
            cls.absentCount = cls.totalDays - cls.presentCount - cls.lateCount;
            
            // Calculate attendance rate
            cls.attendanceRate = Math.round((cls.presentCount + cls.lateCount) / cls.totalDays * 100);
        });
        
        // Sort classes by attendance rate
        classes.sort((a, b) => b.attendanceRate - a.attendanceRate);
        
        // Calculate school-wide statistics
        const totalStudents = classes.reduce((sum, cls) => sum + cls.students, 0);
        const totalPresentCount = classes.reduce((sum, cls) => sum + cls.presentCount, 0);
        const totalAbsentCount = classes.reduce((sum, cls) => sum + cls.absentCount, 0);
        const totalLateCount = classes.reduce((sum, cls) => sum + cls.lateCount, 0);
        const totalDays = classes.reduce((sum, cls) => sum + cls.totalDays, 0);
        const schoolAttendanceRate = Math.round((totalPresentCount + totalLateCount) / totalDays * 100);
        
        return {
            reportType: 'summary',
            classes,
            stats: {
                totalStudents,
                totalPresentCount,
                totalAbsentCount,
                totalLateCount,
                totalDays,
                schoolAttendanceRate
            },
            startDate,
            endDate
        };
    }
};

// Main initialization function
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize date display
        updateDateDisplay();
        
        // Initialize sidebar toggle for mobile
        initSidebarToggle();
        
        // Initialize tabs
        initTabs();
        
        // Initialize modals
        initModals();
        
        // Initialize form submissions
        initFormSubmissions();
        
        // Initialize attendance functionality
        initAttendance();
        
        // Initialize attendance reports
        initAttendanceReports();
        
        // Set today's date as default
        setTodayAsDefault();
        
        console.log('Attendance system initialized successfully');
    } catch (error) {
        console.error('Error initializing attendance system:', error);
        showNotification('There was an error initializing the system. Please refresh the page.', 'error');
    }
});

// Update date display
function updateDateDisplay() {
    const dateElement = getElement('current-date');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

// Initialize sidebar toggle for mobile
function initSidebarToggle() {
    const sidebarToggle = getElement('sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            if (sidebar && sidebarToggle) {
                const isClickInsideSidebar = sidebar.contains(event.target);
                const isClickOnToggle = sidebarToggle.contains(event.target);
                
                if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }
}

// Initialize tabs
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the tab panes
            const tabPanes = document.querySelectorAll('.tab-pane');
            if (tabPanes.length === 0) return;
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            const targetPane = getElement(`${tabId}-tab`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Initialize modals
function initModals() {
    // Get all modals
    const modals = document.querySelectorAll('.modal');
    
    if (modals.length === 0) return;
    
    // Get all elements that open a modal
    const modalTriggers = document.querySelectorAll('[id$="-btn"]');
    
    // Get all elements that close a modal
    const closeButtons = document.querySelectorAll('.close-modal, .cancel-modal');
    
    // Add click event to all modal triggers
    modalTriggers.forEach(trigger => {
        if (trigger.id.includes('take-attendance')) {
            trigger.addEventListener('click', function() {
                const modalId = 'take-attendance-modal';
                const modal = getElement(modalId);
                
                if (modal) {
                    // Set today's date as default
                    const today = new Date().toISOString().split('T')[0];
                    const dateInput = getElement('modal-attendance-date');
                    if (dateInput) {
                        dateInput.value = today;
                    }
                    
                    modal.classList.add('active');
                }
            });
        }
    });
    
    // Add click event to all close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Close modal when clicking outside the modal content
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Initialize edit attendance modal functionality
    initEditAttendanceModal();
}

// Initialize edit attendance modal
function initEditAttendanceModal() {
    // Use event delegation for dynamically added edit buttons
    document.addEventListener('click', function(event) {
        const button = event.target.closest('.edit-attendance-btn');
        if (!button) return;
        
        const studentId = button.getAttribute('data-student-id');
        const studentName = button.getAttribute('data-student-name');
        const studentClass = button.getAttribute('data-student-class');
        const status = button.getAttribute('data-status');
        const timeIn = button.getAttribute('data-time-in');
        const notes = button.getAttribute('data-notes');
        
        // Set values in the edit modal
        const studentIdInput = getElement('edit-student-id');
        const studentNameElement = getElement('edit-student-name');
        const studentClassElement = getElement('edit-student-class');
        const attendanceDateElement = getElement('edit-attendance-date');
        
        if (studentIdInput) studentIdInput.value = studentId;
        if (studentNameElement) studentNameElement.textContent = studentName;
        if (studentClassElement) studentClassElement.textContent = studentClass;
        
        // Get the current date from the attendance date input
        const attendanceDateInput = getElement('attendance-date');
        if (attendanceDateInput && attendanceDateElement) {
            attendanceDateElement.textContent = formatDate(attendanceDateInput.value);
        }
        
        // Set the status radio button
        const statusRadio = getElement(`edit-status-${status}`);
        if (statusRadio) statusRadio.checked = true;
        
        // Set time in
        const timeInInput = getElement('edit-time-in');
        if (timeInInput) timeInInput.value = timeIn || '';
        
        // Set notes
        const notesInput = getElement('edit-notes');
        if (notesInput) notesInput.value = notes || '';
        
        // Show/hide absence reason based on status
        const absenceReasonGroup = getElement('absence-reason-group');
        if (absenceReasonGroup) {
            absenceReasonGroup.style.display = status === 'absent' ? 'block' : 'none';
        }
        
        // Show the modal
        const modal = getElement('edit-attendance-modal');
        if (modal) modal.classList.add('active');
    });
    
    // Show/hide absence reason based on status selection
    const statusRadios = document.querySelectorAll('input[name="edit-status"]');
    statusRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const absenceReasonGroup = getElement('absence-reason-group');
            if (absenceReasonGroup) {
                absenceReasonGroup.style.display = this.value === 'absent' ? 'block' : 'none';
            }
        });
    });
}

// Initialize form submissions
function initFormSubmissions() {
    // Take Attendance Form
    const takeAttendanceForm = getElement('take-attendance-form');
    if (takeAttendanceForm) {
        takeAttendanceForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const dateInput = getElement('modal-attendance-date');
            const classSelect = getElement('modal-attendance-class');
            const defaultStatusRadios = document.querySelectorAll('input[name="default-status"]');
            
            if (!dateInput || !classSelect) {
                showNotification('Form elements not found. Please refresh the page.', 'error');
                return;
            }
            
            const date = dateInput.value;
            const className = classSelect.value;
            
            // Find the checked radio button
            let defaultStatus = 'none';
            defaultStatusRadios.forEach(radio => {
                if (radio.checked) {
                    defaultStatus = radio.value;
                }
            });
            
            // Set the values in the main form
            const mainDateInput = getElement('attendance-date');
            const mainClassSelect = getElement('attendance-class');
            
            if (mainDateInput) mainDateInput.value = date;
            if (mainClassSelect) mainClassSelect.value = className;
            
            // Close the modal
            const modal = getElement('take-attendance-modal');
            if (modal) modal.classList.remove('active');
            
            // Load the attendance data
            loadAttendanceData(date, className, defaultStatus);
        });
    }
    
    // Edit Attendance Form
    const editAttendanceForm = getElement('edit-attendance-form');
    if (editAttendanceForm) {
        editAttendanceForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const studentIdInput = getElement('edit-student-id');
            const statusRadios = document.querySelectorAll('input[name="edit-status"]');
            const timeInInput = getElement('edit-time-in');
            const notesInput = getElement('edit-notes');
            const absenceReasonInput = getElement('edit-absence-reason');
            
            if (!studentIdInput || !timeInInput || !notesInput) {
                showNotification('Form elements not found. Please refresh the page.', 'error');
                return;
            }
            
            const studentId = studentIdInput.value;
            
            // Find the checked radio button
            let status = '';
            statusRadios.forEach(radio => {
                if (radio.checked) {
                    status = radio.value;
                }
            });
            
            const timeIn = timeInInput.value;
            const notes = notesInput.value;
            const absenceReason = absenceReasonInput ? absenceReasonInput.value : '';
            
            // Validate inputs
            if (!status) {
                showNotification('Please select an attendance status.', 'warning');
                return;
            }
            
            // Update the attendance record in the table
            updateAttendanceRecord(studentId, status, timeIn, notes, absenceReason);
            
            // Close the modal
            const modal = getElement('edit-attendance-modal');
            if (modal) modal.classList.remove('active');
            
            // Enable the save button
            const saveButton = getElement('save-attendance-btn');
            if (saveButton) saveButton.disabled = false;
            
            showNotification('Attendance record updated successfully.', 'success');
        });
    }
    
    // Attendance Settings Form
    const attendanceSettingsForm = getElement('attendance-settings-form');
    if (attendanceSettingsForm) {
        attendanceSettingsForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            try {
                // Get form data as FormData object
                const formData = new FormData(this);
                const settings = Object.fromEntries(formData.entries());
                
                // In a real application, you would save these settings to a server
                // For now, we'll save to localStorage as a fallback
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    setStorageItem('attendance_settings', settings);
                } else {
                    // Make API call to save settings
                    const response = await fetch('/api/attendance/settings', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${AttendanceAPI.getAuthToken()}`
                        },
                        body: JSON.stringify(settings)
                    });
                    
                    if (!response.ok) {
                        throw new Error(`API error: ${response.status} ${response.statusText}`);
                    }
                }
                
                showNotification('Attendance settings saved successfully!', 'success');
            } catch (error) {
                console.error('Error saving attendance settings:', error);
                showNotification('Failed to save settings. Please try again.', 'error');
            }
        });
    }
    
    // Reset Settings Button
    const resetSettingsBtn = getElement('reset-settings-btn');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all attendance settings to default values?')) {
                const form = getElement('attendance-settings-form');
                if (form) {
                    form.reset();
                    showNotification('Settings have been reset to default values.', 'info');
                }
            }
        });
    }
}

// Initialize attendance functionality
function initAttendance() {
    // Load Attendance Button
    const loadAttendanceBtn = getElement('load-attendance-btn');
    if (loadAttendanceBtn) {
        loadAttendanceBtn.addEventListener('click', function() {
                        const dateInput = getElement('attendance-date');
            const classSelect = getElement('attendance-class');
            
            if (!dateInput || !classSelect) {
                showNotification('Form elements not found. Please refresh the page.', 'error');
                return;
            }
            
            const date = dateInput.value;
            const className = classSelect.value;
            
            if (!date || !className) {
                showNotification('Please select both a date and a class.', 'warning');
                return;
            }
            
            loadAttendanceData(date, className);
        });
    }
    
    // Save Attendance Button
    const saveAttendanceBtn = getElement('save-attendance-btn');
    if (saveAttendanceBtn) {
        saveAttendanceBtn.addEventListener('click', function() {
            saveAttendanceData();
        });
    }
    
    // Print Attendance Button
    const printAttendanceBtn = getElement('print-attendance-btn');
    if (printAttendanceBtn) {
        printAttendanceBtn.addEventListener('click', function() {
            printAttendance();
        });
    }
    
    // Export Attendance Button
    const exportAttendanceBtn = getElement('export-attendance-btn');
    if (exportAttendanceBtn) {
        exportAttendanceBtn.addEventListener('click', function() {
            exportAttendance();
        });
    }
    
    // Select All Checkbox
    const selectAllHeader = getElement('select-all-header');
    if (selectAllHeader) {
        selectAllHeader.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.student-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // Bulk Status Change Buttons
    const statusButtons = document.querySelectorAll('.status-btn');
    statusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            const selectedCheckboxes = document.querySelectorAll('.student-checkbox:checked');
            
            if (selectedCheckboxes.length === 0) {
                showNotification('Please select at least one student.', 'warning');
                return;
            }
            
            selectedCheckboxes.forEach(checkbox => {
                const studentId = checkbox.value;
                updateAttendanceStatus(studentId, status);
            });
            
            // Enable the save button
            const saveButton = getElement('save-attendance-btn');
            if (saveButton) saveButton.disabled = false;
            
            // Update attendance summary
            updateAttendanceSummary();
            
            showNotification(`${selectedCheckboxes.length} student(s) marked as ${status}.`, 'success');
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#attendance-list tr:not(.empty-state)');
            
            let matchCount = 0;
            rows.forEach(row => {
                const studentName = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase() || '';
                const studentId = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
                
                if (studentName.includes(searchTerm) || studentId.includes(searchTerm)) {
                    row.style.display = '';
                    matchCount++;
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Show no results message if needed
            const noResultsRow = document.querySelector('.no-results-row');
            if (matchCount === 0 && searchTerm !== '') {
                if (!noResultsRow) {
                    const attendanceList = getElement('attendance-list');
                    if (attendanceList) {
                        const newRow = document.createElement('tr');
                        newRow.className = 'no-results-row';
                        newRow.innerHTML = `<td colspan="7" class="text-center">No students found matching "${searchTerm}"</td>`;
                        attendanceList.appendChild(newRow);
                    }
                }
            } else if (noResultsRow) {
                noResultsRow.remove();
            }
        });
    }
}

// Initialize attendance reports
function initAttendanceReports() {
    // Report Type Change
    const reportType = getElement('report-type');
    if (reportType) {
        reportType.addEventListener('change', function() {
            const studentFilter = document.querySelector('.student-filter');
            const classFilter = document.querySelector('.class-filter');
            
            if (this.value === 'student') {
                if (studentFilter) studentFilter.style.display = 'flex';
                if (classFilter) classFilter.style.display = 'none';
            } else if (this.value === 'class') {
                if (studentFilter) studentFilter.style.display = 'none';
                if (classFilter) classFilter.style.display = 'flex';
            } else {
                if (studentFilter) studentFilter.style.display = 'none';
                if (classFilter) classFilter.style.display = 'none';
            }
        });
    }
    
    // Class selection change - populate students dropdown
    const reportClass = getElement('report-class');
    if (reportClass) {
        reportClass.addEventListener('change', async function() {
            const studentSelect = getElement('report-student');
            if (!studentSelect) return;
            
            const className = this.value;
            if (!className) {
                studentSelect.innerHTML = '<option value="">Select Student</option>';
                return;
            }
            
            // Show loading state
            studentSelect.innerHTML = '<option value="">Loading students...</option>';
            studentSelect.disabled = true;
            
            try {
                // In a real app, fetch students from API
                // For now, use sample data
                const students = AttendanceAPI.getSampleStudents(className);
                
                // Populate dropdown
                studentSelect.innerHTML = '<option value="">Select Student</option>';
                students.forEach(student => {
                    const option = document.createElement('option');
                    option.value = student.id;
                    option.textContent = `${student.id} - ${student.name}`;
                    studentSelect.appendChild(option);
                });
            } catch (error) {
                console.error('Error loading students:', error);
                studentSelect.innerHTML = '<option value="">Error loading students</option>';
            } finally {
                studentSelect.disabled = false;
            }
        });
    }
    
    // Generate Report Button
    const generateReportBtn = getElement('generate-report-btn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function() {
            generateAttendanceReport();
        });
    }
    
    // Print Report Button
    const printReportBtn = getElement('print-report-btn');
    if (printReportBtn) {
        printReportBtn.addEventListener('click', function() {
            printReport();
        });
    }
    
    // Export Report Button
    const exportReportBtn = getElement('export-report-btn');
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', function() {
            exportReport();
        });
    }
}

// Set today's date as default
function setTodayAsDefault() {
    const today = new Date().toISOString().split('T')[0];
    
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (input) input.value = today;
    });
}

// Load attendance data
async function loadAttendanceData(date, className, defaultStatus = 'none') {
    // Validate inputs
    if (!date || !className) {
        showNotification('Date and class are required.', 'warning');
        return;
    }
    
    // Show loading state
    const attendanceList = getElement('attendance-list');
    if (!attendanceList) {
        showNotification('Attendance list element not found.', 'error');
        return;
    }
    
    attendanceList.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                <div class="empty-state-container">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading attendance data...</p>
                </div>
            </td>
        </tr>
    `;
    
    // Disable buttons during loading
    const actionButtons = document.querySelectorAll('#attendance-actions button');
    actionButtons.forEach(button => {
        if (button) button.disabled = true;
    });
    
    try {
        // Fetch attendance data from API
        const attendanceData = await AttendanceAPI.getAttendance(date, className);
        
        // Apply default status if needed
        if (defaultStatus !== 'none' && attendanceData.some(record => !record.status)) {
            attendanceData.forEach(record => {
                if (!record.status) {
                    record.status = defaultStatus;
                    if (defaultStatus === 'present') {
                        record.timeIn = '08:00';
                    }
                }
            });
        }
        
        // Populate the attendance list
        attendanceList.innerHTML = '';
        
        if (attendanceData.length === 0) {
            attendanceList.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        <div class="empty-state-container">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>No students found for this class.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        attendanceData.forEach(record => {
            const row = document.createElement('tr');
            row.setAttribute('data-student-id', record.studentId);
            
            let statusHtml = '';
            if (record.status === 'present') {
                statusHtml = `<span class="status-indicator status-present"><i class="fas fa-check-circle"></i> Present</span>`;
            } else if (record.status === 'absent') {
                statusHtml = `<span class="status-indicator status-absent"><i class="fas fa-times-circle"></i> Absent</span>`;
            } else if (record.status === 'late') {
                statusHtml = `<span class="status-indicator status-late"><i class="fas fa-clock"></i> Late</span>`;
            } else {
                statusHtml = `<span class="status-indicator">Not marked</span>`;
            }
            
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="student-checkbox" value="${record.studentId}">
                </td>
                <td>${record.studentId}</td>
                <td>${record.studentName}</td>
                <td>${statusHtml}</td>
                <td>${record.timeIn || '-'}</td>
                <td>${record.notes || '-'}</td>
                <td>
                    <button class="action-btn edit-attendance-btn" 
                        data-student-id="${record.studentId}"
                        data-student-name="${record.studentName}"
                        data-student-class="${className}"
                        data-status="${record.status}"
                        data-time-in="${record.timeIn || ''}"
                        data-notes="${record.notes || ''}">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            
            attendanceList.appendChild(row);
        });
        
        // Update attendance summary
        updateAttendanceSummary();
        
        // Enable buttons
        const saveButton = getElement('save-attendance-btn');
        const printButton = getElement('print-attendance-btn');
        const exportButton = getElement('export-attendance-btn');
        
        if (saveButton) saveButton.disabled = false;
        if (printButton) printButton.disabled = false;
        if (exportButton) exportButton.disabled = false;
        
        showNotification('Attendance data loaded successfully.', 'success');
    } catch (error) {
        console.error('Error loading attendance data:', error);
        attendanceList.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="empty-state-container">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error loading attendance data. Please try again.</p>
                    </div>
                </td>
            </tr>
        `;
        showNotification('Failed to load attendance data. Please try again.', 'error');
    }
}

// Update attendance summary
function updateAttendanceSummary() {
    const rows = document.querySelectorAll('#attendance-list tr:not(.empty-state):not(.no-results-row)');
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let notMarkedCount = 0;
    let totalCount = rows.length;
    
    rows.forEach(row => {
        const statusCell = row.querySelector('td:nth-child(4)');
        if (!statusCell) return;
        
        const statusText = statusCell.textContent.trim();
        
        if (statusText.includes('Present')) {
            presentCount++;
        } else if (statusText.includes('Absent')) {
            absentCount++;
        } else if (statusText.includes('Late')) {
            lateCount++;
        } else {
            notMarkedCount++;
        }
    });
    
    // Update the summary counts
    const presentCountElement = getElement('present-count');
    const absentCountElement = getElement('absent-count');
    const lateCountElement = getElement('late-count');
    const attendanceRateElement = getElement('attendance-rate');
    const notMarkedCountElement = getElement('not-marked-count');
    
    if (presentCountElement) presentCountElement.textContent = presentCount;
    if (absentCountElement) absentCountElement.textContent = absentCount;
    if (lateCountElement) lateCountElement.textContent = lateCount;
    if (notMarkedCountElement) notMarkedCountElement.textContent = notMarkedCount;
    
    // Calculate attendance rate
    const attendanceRate = totalCount > 0 ? Math.round((presentCount + lateCount) / totalCount * 100) : 0;
    if (attendanceRateElement) attendanceRateElement.textContent = `${attendanceRate}%`;
    
    // Update progress bar if it exists
    const progressBar = getElement('attendance-progress');
    if (progressBar) {
        progressBar.style.width = `${attendanceRate}%`;
        
        // Update progress bar color based on rate
        if (attendanceRate >= 90) {
            progressBar.className = 'progress-bar progress-bar-success';
        } else if (attendanceRate >= 75) {
            progressBar.className = 'progress-bar progress-bar-info';
        } else if (attendanceRate >= 60) {
            progressBar.className = 'progress-bar progress-bar-warning';
        } else {
            progressBar.className = 'progress-bar progress-bar-danger';
        }
    }
}

// Update attendance status
function updateAttendanceStatus(studentId, status) {
        const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
    if (!row) {
        console.warn(`Row for student ID ${studentId} not found`);
        return;
    }
    
    const statusCell = row.querySelector('td:nth-child(4)');
    const timeInCell = row.querySelector('td:nth-child(5)');
    const editButton = row.querySelector('.edit-attendance-btn');
    
    if (!statusCell || !timeInCell || !editButton) {
        console.warn(`Required cells for student ID ${studentId} not found`);
        return;
    }
    
    let statusHtml = '';
    let timeIn = '';
    
    if (status === 'present') {
        statusHtml = `<span class="status-indicator status-present"><i class="fas fa-check-circle"></i> Present</span>`;
        timeIn = getCurrentTime();
    } else if (status === 'absent') {
        statusHtml = `<span class="status-indicator status-absent"><i class="fas fa-times-circle"></i> Absent</span>`;
        timeIn = '-';
    } else if (status === 'late') {
        statusHtml = `<span class="status-indicator status-late"><i class="fas fa-clock"></i> Late</span>`;
        timeIn = getCurrentTime();
    }
    
    statusCell.innerHTML = statusHtml;
    timeInCell.textContent = timeIn === '-' ? '-' : timeIn;
    
    // Update data attributes for the edit button
    editButton.setAttribute('data-status', status);
    editButton.setAttribute('data-time-in', timeIn === '-' ? '' : timeIn);
}

// Update attendance record
function updateAttendanceRecord(studentId, status, timeIn, notes, absenceReason) {
    const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
    if (!row) {
        console.warn(`Row for student ID ${studentId} not found`);
        return;
    }
    
    const statusCell = row.querySelector('td:nth-child(4)');
    const timeInCell = row.querySelector('td:nth-child(5)');
    const notesCell = row.querySelector('td:nth-child(6)');
    const editButton = row.querySelector('.edit-attendance-btn');
    
    if (!statusCell || !timeInCell || !notesCell || !editButton) {
        console.warn(`Required cells for student ID ${studentId} not found`);
        return;
    }
    
    let statusHtml = '';
    
    if (status === 'present') {
        statusHtml = `<span class="status-indicator status-present"><i class="fas fa-check-circle"></i> Present</span>`;
    } else if (status === 'absent') {
        statusHtml = `<span class="status-indicator status-absent"><i class="fas fa-times-circle"></i> Absent</span>`;
        // Add absence reason to notes if provided
        if (absenceReason && !notes.includes(absenceReason)) {
            notes = notes ? `${notes} (${absenceReason})` : absenceReason;
        }
    } else if (status === 'late') {
        statusHtml = `<span class="status-indicator status-late"><i class="fas fa-clock"></i> Late</span>`;
    }
    
    statusCell.innerHTML = statusHtml;
    timeInCell.textContent = timeIn || '-';
    notesCell.textContent = notes || '-';
    
    // Update data attributes for the edit button
    editButton.setAttribute('data-status', status);
    editButton.setAttribute('data-time-in', timeIn || '');
    editButton.setAttribute('data-notes', notes || '');
    
    // Update attendance summary
    updateAttendanceSummary();
}

// Save attendance data
async function saveAttendanceData() {
    const dateInput = getElement('attendance-date');
    const classSelect = getElement('attendance-class');
    
    if (!dateInput || !classSelect) {
        showNotification('Form elements not found. Please refresh the page.', 'error');
        return;
    }
    
    const date = dateInput.value;
    const className = classSelect.value;
    
    if (!date || !className) {
        showNotification('Please select both a date and a class.', 'warning');
        return;
    }
    
    const rows = document.querySelectorAll('#attendance-list tr[data-student-id]');
    if (rows.length === 0) {
        showNotification('No attendance data to save.', 'warning');
        return;
    }
    
    // Show saving indicator
    const saveButton = getElement('save-attendance-btn');
    if (saveButton) {
        saveButton.disabled = true;
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    }
    
    try {
        const attendanceData = [];
        
        rows.forEach(row => {
            const studentId = row.getAttribute('data-student-id');
            const studentName = row.querySelector('td:nth-child(3)').textContent;
            const statusText = row.querySelector('td:nth-child(4)').textContent.trim();
            const timeIn = row.querySelector('td:nth-child(5)').textContent;
            const notes = row.querySelector('td:nth-child(6)').textContent;
            
            let status = '';
            if (statusText.includes('Present')) {
                status = 'present';
            } else if (statusText.includes('Absent')) {
                status = 'absent';
            } else if (statusText.includes('Late')) {
                status = 'late';
            }
            
            attendanceData.push({
                studentId,
                studentName,
                status,
                timeIn: timeIn === '-' ? '' : timeIn,
                notes: notes === '-' ? '' : notes
            });
        });
        
        // Save data via API
        const result = await AttendanceAPI.saveAttendance(date, className, attendanceData);
        
        if (result.success) {
            showNotification('Attendance data saved successfully!', 'success');
            
            // Log the activity
            logActivity(`Attendance saved for ${className} on ${formatDate(date)}`);
            
            // Disable the save button
            if (saveButton) saveButton.disabled = true;
        } else {
            throw new Error('Save operation returned false');
        }
    } catch (error) {
        console.error('Error saving attendance data:', error);
        showNotification('Failed to save attendance data. Please try again.', 'error');
    } finally {
        // Reset save button
        if (saveButton) {
            saveButton.innerHTML = '<i class="fas fa-save"></i> Save Attendance';
            saveButton.disabled = false;
        }
    }
}

// Log activity for audit trail
function logActivity(activity) {
    try {
        const now = new Date();
        const timestamp = now.toISOString();
        const user = sessionStorage.getItem('userName') || 'Unknown User';
        
        const activityLog = getStorageItem('activity_log') || [];
        activityLog.unshift({
            timestamp,
            user,
            activity,
            formattedTime: now.toLocaleString()
        });
        
        // Keep only the last 100 activities to prevent storage issues
        if (activityLog.length > 100) {
            activityLog.length = 100;
        }
        
        setStorageItem('activity_log', activityLog);
        
        // In production, also send to server
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            fetch('/api/activity-log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AttendanceAPI.getAuthToken()}`
                },
                body: JSON.stringify({
                    timestamp,
                    user,
                    activity
                })
            }).catch(error => {
                console.error('Error logging activity to server:', error);
            });
        }
    } catch (error) {
        console.error('Error logging activity:', error);
    }
}

// Print attendance
function printAttendance() {
    const dateInput = getElement('attendance-date');
    const classSelect = getElement('attendance-class');
    
    if (!dateInput || !classSelect) {
        showNotification('Form elements not found. Please refresh the page.', 'error');
        return;
    }
    
    const date = dateInput.value;
    const className = classSelect.value;
    
    if (!date || !className) {
        showNotification('Please select both a date and a class.', 'warning');
        return;
    }
    
    // Get class name display text
    const classText = classSelect.options[classSelect.selectedIndex].text;
    
    // Create a printable version of the attendance
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        showNotification('Pop-up blocked. Please allow pop-ups for this site.', 'warning');
        return;
    }
    
    // Get summary counts
    const presentCount = getElement('present-count')?.textContent || '0';
    const absentCount = getElement('absent-count')?.textContent || '0';
    const lateCount = getElement('late-count')?.textContent || '0';
    const attendanceRate = getElement('attendance-rate')?.textContent || '0%';
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Attendance Report - ${classText} - ${formatDate(date)}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                    line-height: 1.5;
                }
                h1, h2, h3 {
                    color: #3f51b5;
                }
                .school-info {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #3f51b5;
                    padding-bottom: 20px;
                }
                .school-logo {
                    max-width: 100px;
                    height: auto;
                    margin-bottom: 10px;
                }
                .report-info {
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: space-between;
                }
                .report-info-left, .report-info-right {
                    flex: 1;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .present {
                    color: #4CAF50;
                    font-weight: bold;
                }
                .absent {
                    color: #F44336;
                    font-weight: bold;
                }
                .late {
                    color: #FF9800;
                    font-weight: bold;
                }
                .summary {
                    margin-top: 30px;
                    border-top: 1px solid #ddd;
                    padding-top: 20px;
                }
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .summary-item {
                    border: 1px solid #ddd;
                    padding: 15px;
                    text-align: center;
                    border-radius: 5px;
                }
                .summary-value {
                    font-size: 24px;
                    font-weight: bold;
                    margin: 10px 0;
                }
                .signature {
                    margin-top: 50px;
                    display: flex;
                    justify-content: space-between;
                }
                .signature-line {
                    width: 200px;
                    border-top: 1px solid #000;
                    margin-top: 50px;
                    text-align: center;
                }
                .footer {
                    margin-top: 50px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }
                @media print {
                    body {
                        margin: 0;
                        padding: 15px;
                    }
                    @page {
                        size: portrait;
                        margin: 1cm;
                    }
                }
            </style>
        </head>
        <body>
            <div class="school-info">
                <img src="/assets/img/logo.jpg" alt="School Logo" class="school-logo">
                <h1>Franciscan Catholic Nursery & Primary School</h1>
                <h2>Daily Attendance Report</h2>
            </div>
            
            <div class="report-info">
                <div class="report-info-left">
                    <p><strong>Class:</strong> ${classText}</p>
                    <p><strong>Date:</strong> ${formatDate(date)}</p>
                </div>
                <div class="report-info-right">
                    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Generated By:</strong> ${sessionStorage.getItem('userName') || 'Administrator'}</p>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Status</th>
                        <th>Time In</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
    `);
    
    const rows = document.querySelectorAll('#attendance-list tr[data-student-id]');
    
    if (rows.length === 0) {
        printWindow.document.write(`
            <tr>
                <td colspan="6" style="text-align: center;">No attendance data available</td>
            </tr>
        `);
    } else {
        rows.forEach((row, index) => {
            const studentId = row.querySelector('td:nth-child(2)')?.textContent || '';
            const studentName = row.querySelector('td:nth-child(3)')?.textContent || '';
            const statusText = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
            const timeIn = row.querySelector('td:nth-child(5)')?.textContent || '';
            const notes = row.querySelector('td:nth-child(6)')?.textContent || '';
            
            let statusClass = '';
            if (statusText.includes('Present')) {
                statusClass = 'present';
            } else if (statusText.includes('Absent')) {
                statusClass = 'absent';
                        } else if (statusText.includes('Late')) {
                statusClass = 'late';
            }
            
            printWindow.document.write(`
                <tr>
                    <td>${index + 1}</td>
                    <td>${studentId}</td>
                    <td>${studentName}</td>
                    <td class="${statusClass}">${statusText}</td>
                    <td>${timeIn}</td>
                    <td>${notes}</td>
                </tr>
            `);
        });
    }
    
    printWindow.document.write(`
                </tbody>
            </table>
            
            <div class="summary">
                <h3>Attendance Summary</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <div>Total Students</div>
                        <div class="summary-value">${rows.length}</div>
                    </div>
                    <div class="summary-item">
                        <div>Present</div>
                        <div class="summary-value present">${presentCount}</div>
                    </div>
                    <div class="summary-item">
                        <div>Absent</div>
                        <div class="summary-value absent">${absentCount}</div>
                    </div>
                    <div class="summary-item">
                        <div>Late</div>
                        <div class="summary-value late">${lateCount}</div>
                    </div>
                </div>
                <p><strong>Attendance Rate:</strong> ${attendanceRate}</p>
            </div>
            
            <div class="signature">
                <div>
                    <div class="signature-line">Class Teacher</div>
                </div>
                <div>
                    <div class="signature-line">Principal</div>
                </div>
            </div>
            
            <div class="footer">
                <p>This is an official document of Franciscan Catholic Nursery & Primary School.</p>
                <p>Generated from the School Management System on ${new Date().toLocaleString()}</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Log the activity
    logActivity(`Printed attendance report for ${classText} on ${formatDate(date)}`);
    
    // Print after a short delay to ensure the content is loaded
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
    }, 500);
}

// Export attendance to CSV
function exportAttendance() {
    const dateInput = getElement('attendance-date');
    const classSelect = getElement('attendance-class');
    
    if (!dateInput || !classSelect) {
        showNotification('Form elements not found. Please refresh the page.', 'error');
        return;
    }
    
    const date = dateInput.value;
    const className = classSelect.value;
    
    if (!date || !className) {
        showNotification('Please select both a date and a class.', 'warning');
        return;
    }
    
    // Get class name display text
    const classText = classSelect.options[classSelect.selectedIndex].text;
    
    // Create CSV content
    let csvContent = 'Student ID,Student Name,Status,Time In,Notes\n';
    
    const rows = document.querySelectorAll('#attendance-list tr[data-student-id]');
    
    if (rows.length === 0) {
        showNotification('No attendance data to export.', 'warning');
        return;
    }
    
    rows.forEach(row => {
        const studentId = row.querySelector('td:nth-child(2)')?.textContent || '';
        const studentName = row.querySelector('td:nth-child(3)')?.textContent || '';
        const statusText = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
        const timeIn = row.querySelector('td:nth-child(5)')?.textContent || '';
        const notes = row.querySelector('td:nth-child(6)')?.textContent || '';
        
        // Escape any commas in the fields
        const escapedName = `"${studentName.replace(/"/g, '""')}"`;
        const escapedNotes = `"${notes.replace(/"/g, '""')}"`;
        
        csvContent += `${studentId},${escapedName},${statusText},${timeIn},${escapedNotes}\n`;
    });
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_${className}_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Log the activity
    logActivity(`Exported attendance data for ${classText} on ${formatDate(date)}`);
    
    showNotification('Attendance data exported successfully.', 'success');
}

// Generate attendance report
async function generateAttendanceReport() {
    const reportType = getElement('report-type');
    const startDateInput = getElement('report-start-date');
    const endDateInput = getElement('report-end-date');
    
    if (!reportType || !startDateInput || !endDateInput) {
        showNotification('Form elements not found. Please refresh the page.', 'error');
        return;
    }
    
    const reportTypeValue = reportType.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    if (!startDate || !endDate) {
        showNotification('Please select both start and end dates.', 'warning');
        return;
    }
    
    // Validate date range
    if (new Date(startDate) > new Date(endDate)) {
        showNotification('Start date cannot be after end date.', 'warning');
        return;
    }
    
    // Prepare parameters based on report type
    const params = {
        reportType: reportTypeValue,
        startDate,
        endDate
    };
    
    if (reportTypeValue === 'class') {
        const classSelect = getElement('report-class');
        if (!classSelect || !classSelect.value) {
            showNotification('Please select a class for the report.', 'warning');
            return;
        }
        params.className = classSelect.value;
    } else if (reportTypeValue === 'student') {
        const studentSelect = getElement('report-student');
        if (!studentSelect || !studentSelect.value) {
            showNotification('Please select a student for the report.', 'warning');
            return;
        }
        params.studentId = studentSelect.value;
    }
    
    // Show loading state
    const reportContent = getElement('report-content');
    const generateButton = getElement('generate-report-btn');
    
    if (!reportContent) {
        showNotification('Report content element not found.', 'error');
        return;
    }
    
    reportContent.innerHTML = `
        <div class="empty-state-container">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Generating report...</p>
        </div>
    `;
    
    if (generateButton) {
        generateButton.disabled = true;
        generateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    }
    
    try {
        // Generate report via API
        const reportData = await AttendanceAPI.generateReport(params);
        
        // Render the report based on type
        if (reportData.reportType === 'class') {
            renderClassReport(reportData);
        } else if (reportData.reportType === 'student') {
            renderStudentReport(reportData);
        } else if (reportData.reportType === 'summary') {
            renderSummaryReport(reportData);
        } else {
            throw new Error(`Unknown report type: ${reportData.reportType}`);
        }
        
        // Show report container
        const reportContainer = getElement('report-container');
        if (reportContainer) {
            reportContainer.style.display = 'block';
        }
        
        // Enable report action buttons
        const printReportBtn = getElement('print-report-btn');
        const exportReportBtn = getElement('export-report-btn');
        
        if (printReportBtn) printReportBtn.disabled = false;
        if (exportReportBtn) exportReportBtn.disabled = false;
        
        // Log the activity
        logActivity(`Generated ${reportTypeValue} attendance report for ${formatDate(startDate)} to ${formatDate(endDate)}`);
        
        showNotification('Report generated successfully.', 'success');
    } catch (error) {
        console.error('Error generating report:', error);
        reportContent.innerHTML = `
            <div class="empty-state-container">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error generating report. Please try again.</p>
            </div>
        `;
        showNotification('Failed to generate report. Please try again.', 'error');
    } finally {
        // Reset generate button
        if (generateButton) {
            generateButton.disabled = false;
            generateButton.innerHTML = '<i class="fas fa-chart-bar"></i> Generate Report';
        }
    }
}

// Render class attendance report
function renderClassReport(data) {
    const reportContent = getElement('report-content');
    if (!reportContent) return;
    
    reportContent.innerHTML = `
        <h3>Class Attendance Report</h3>
        <div class="report-details">
            <p><strong>Class:</strong> ${data.classDisplayName}</p>
            <p><strong>Period:</strong> ${formatDate(data.startDate)} to ${formatDate(data.endDate)}</p>
            <p><strong>Total Students:</strong> ${data.students.length}</p>
            <p><strong>Total School Days:</strong> ${data.students[0]?.presentCount + data.students[0]?.absentCount + data.students[0]?.lateCount || 0}</p>
        </div>
        
        <div class="report-summary">
            <h4 class="summary-title">Attendance Summary</h4>
            <div class="summary-stats">
                <div class="stat-item">
                    <div class="stat-label">Average Attendance Rate</div>
                    <div class="stat-value">${data.stats.averageAttendanceRate}%</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Perfect Attendance</div>
                    <div class="stat-value">${data.stats.perfectAttendance}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Chronic Absence</div>
                    <div class="stat-value">${data.stats.chronicAbsence}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Highest Attendance Day</div>
                    <div class="stat-value">${data.stats.highestAttendanceDay}</div>
                </div>
            </div>
        </div>
        
        <h4>Attendance Details</h4>
        <div class="table-container">
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Present Days</th>
                        <th>Absent Days</th>
                        <th>Late Days</th>
                        <th>Attendance Rate</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    data.students.forEach(student => {
        let rateClass = '';
        if (student.attendanceRate >= 95) {
            rateClass = 'status-present';
        } else if (student.attendanceRate >= 85) {
            rateClass = 'status-late';
        } else {
            rateClass = 'status-absent';
        }
        
        reportContent.innerHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.presentCount}</td>
                <td>${student.absentCount}</td>
                <td>${student.lateCount}</td>
                <td><span class="status-indicator ${rateClass}">${student.attendanceRate}%</span></td>
            </tr>
        `;
    });
    
    reportContent.innerHTML += `
                </tbody>
            </table>
        </div>
        
        <div class="charts-container">
            <div class="chart-wrapper">
                <h4 class="chart-title">Daily Attendance Trend</h4>
                <div class="chart-area" id="attendance-trend-chart">
                    <p class="chart-placeholder">Chart visualization would be displayed here in a real application.</p>
                </div>
            </div>
        </div>
    `;
}

// Render student attendance report
function renderStudentReport(data) {
    const reportContent = getElement('report-content');
    if (!reportContent) return;
    
    const student = data.student;
    
    reportContent.innerHTML = `
        <div class="student-report-header">
            <div class="student-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="student-details">
                <h4>${student.name}</h4>
                <p><strong>Student ID:</strong> ${student.id}</p>
                <p><strong>Class:</strong> ${student.class}</p>
            </div>
        </div>
        
        <div class="report-summary">
            <h4 class="summary-title">Attendance Summary</h4>
            <div class="summary-stats">
                <div class="stat-item">
                    <div class="stat-label">Present Days</div>
                    <div class="stat-value">${student.presentCount}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Absent Days</div>
                    <div class="stat-value">${student.absentCount}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Late Days</div>
                    <div class="stat-value">${student.lateCount}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Attendance Rate</div>
                    <div class="stat-value">${student.attendanceRate}%</div>
                </div>
            </div>
        </div>
        
        <h4>Attendance Records</h4>
        <div class="table-container">
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Time In</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    data.attendanceRecords.forEach(record => {
        let statusClass = '';
        let statusText = '';
        
        if (record.status === 'present') {
            statusClass = 'status-present';
            statusText = 'Present';
                } else if (record.status === 'absent') {
            statusClass = 'status-absent';
            statusText = 'Absent';
        } else if (record.status === 'late') {
            statusClass = 'status-late';
            statusText = 'Late';
        }
        
        reportContent.innerHTML += `
            <tr>
                <td>${formatDate(record.date)}</td>
                <td><span class="status-indicator ${statusClass}">${statusText}</span></td>
                <td>${record.timeIn || '-'}</td>
                <td>${record.notes || '-'}</td>
            </tr>
        `;
    });
    
    reportContent.innerHTML += `
                </tbody>
            </table>
        </div>
        
        <div class="attendance-history">
            <h4>Monthly Attendance Calendar</h4>
    `;
    
    // Sort months
    const sortedMonths = Object.keys(student.attendanceByMonth).sort();
    
    sortedMonths.forEach(month => {
        const monthData = student.attendanceByMonth[month];
        const monthName = new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });
        
        // Count statuses for this month
        const monthPresent = monthData.filter(d => d.status === 'present').length;
        const monthAbsent = monthData.filter(d => d.status === 'absent').length;
        const monthLate = monthData.filter(d => d.status === 'late').length;
        const monthTotal = monthPresent + monthAbsent + monthLate;
        const monthRate = monthTotal > 0 ? Math.round((monthPresent + monthLate) / monthTotal * 100) : 0;
        
        reportContent.innerHTML += `
            <div class="month-attendance">
                <div class="month-header">
                    <span class="month-title">${monthName}</span>
                    <span class="month-summary">
                        Present: ${monthPresent}, Absent: ${monthAbsent}, Late: ${monthLate} | Attendance Rate: ${monthRate}%
                    </span>
                </div>
                <div class="calendar-view">
                    <div class="calendar-day">Sun</div>
                    <div class="calendar-day">Mon</div>
                    <div class="calendar-day">Tue</div>
                    <div class="calendar-day">Wed</div>
                    <div class="calendar-day">Thu</div>
                    <div class="calendar-day">Fri</div>
                    <div class="calendar-day">Sat</div>
        `;
        
        // Get first day of month
        const firstDay = new Date(month + '-01').getDay();
        
        // Add empty cells for days before the 1st
        for (let i = 0; i < firstDay; i++) {
            reportContent.innerHTML += `<div class="calendar-day"></div>`;
        }
        
        // Get days in month
        const daysInMonth = new Date(parseInt(month.substring(0, 4)), parseInt(month.substring(5, 7)), 0).getDate();
        
        // Create a map of day to status
        const dayStatusMap = {};
        monthData.forEach(d => {
            dayStatusMap[d.day] = d.status;
        });
        
        // Add all days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(month + '-' + day.toString().padStart(2, '0'));
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            let dayClass = '';
            let statusText = '';
            
            if (isWeekend) {
                dayClass = 'day-weekend';
                statusText = 'Weekend';
            } else if (dayStatusMap[day]) {
                if (dayStatusMap[day] === 'present') {
                    dayClass = 'day-present';
                    statusText = 'Present';
                } else if (dayStatusMap[day] === 'absent') {
                    dayClass = 'day-absent';
                    statusText = 'Absent';
                } else if (dayStatusMap[day] === 'late') {
                    dayClass = 'day-late';
                    statusText = 'Late';
                }
            } else {
                // Future date or no record
                const today = new Date();
                if (date > today) {
                    dayClass = 'day-future';
                    statusText = 'Future';
                }
            }
            
            reportContent.innerHTML += `
                <div class="calendar-day ${dayClass}">
                    <span class="day-number">${day}</span>
                    <span class="day-status">${statusText}</span>
                </div>
            `;
        }
        
        reportContent.innerHTML += `
                </div>
            </div>
        `;
    });
    
    reportContent.innerHTML += `
        </div>
    `;
}

// Render summary attendance report
function renderSummaryReport(data) {
    const reportContent = getElement('report-content');
    if (!reportContent) return;
    
    reportContent.innerHTML = `
        <h3>School-wide Attendance Summary Report</h3>
        <div class="report-details">
            <p><strong>Period:</strong> ${formatDate(data.startDate)} to ${formatDate(data.endDate)}</p>
            <p><strong>Total Classes:</strong> ${data.classes.length}</p>
            <p><strong>Total Students:</strong> ${data.stats.totalStudents}</p>
            <p><strong>Total School Days:</strong> ${data.dates ? data.dates.length : 'N/A'}</p>
        </div>
        
        <div class="report-summary">
            <h4 class="summary-title">Overall Attendance Summary</h4>
            <div class="summary-stats">
                <div class="stat-item">
                    <div class="stat-label">School Attendance Rate</div>
                    <div class="stat-value">${data.stats.schoolAttendanceRate}%</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Present Days</div>
                    <div class="stat-value">${data.stats.totalPresentCount}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Absent Days</div>
                    <div class="stat-value">${data.stats.totalAbsentCount}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Late Days</div>
                    <div class="stat-value">${data.stats.totalLateCount}</div>
                </div>
            </div>
        </div>
        
        <h4>Attendance by Class</h4>
        <div class="table-container">
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Class</th>
                        <th>Students</th>
                        <th>Present Days</th>
                        <th>Absent Days</th>
                        <th>Late Days</th>
                        <th>Attendance Rate</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    data.classes.forEach(cls => {
        let rateClass = '';
        if (cls.attendanceRate >= 95) {
            rateClass = 'status-present';
        } else if (cls.attendanceRate >= 85) {
            rateClass = 'status-late';
        } else {
            rateClass = 'status-absent';
        }
        
        reportContent.innerHTML += `
            <tr>
                <td>${cls.name}</td>
                <td>${cls.students}</td>
                <td>${cls.presentCount}</td>
                <td>${cls.absentCount}</td>
                <td>${cls.lateCount}</td>
                <td><span class="status-indicator ${rateClass}">${cls.attendanceRate}%</span></td>
            </tr>
        `;
    });
    
    reportContent.innerHTML += `
                </tbody>
            </table>
        </div>
        
        <div class="charts-container">
            <div class="chart-wrapper">
                <h4 class="chart-title">Attendance Rate by Class</h4>
                <div class="chart-area" id="class-attendance-chart">
                    <p class="chart-placeholder">Chart visualization would be displayed here in a real application.</p>
                </div>
            </div>
            
            <div class="chart-wrapper">
                <h4 class="chart-title">Attendance Trend Over Time</h4>
                <div class="chart-area" id="attendance-trend-chart">
                    <p class="chart-placeholder">Chart visualization would be displayed here in a real application.</p>
                </div>
            </div>
        </div>
    `;
}

// Print report
function printReport() {
    const reportContent = getElement('report-content');
    
    if (!reportContent || !reportContent.innerHTML.trim()) {
        showNotification('Please generate a report first.', 'warning');
        return;
    }
    
    // Create a printable version of the report
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        showNotification('Pop-up blocked. Please allow pop-ups for this site.', 'warning');
        return;
    }
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Attendance Report</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    line-height: 1.6;
                    color: #333;
                }
                h1, h2, h3, h4 {
                    color: #3f51b5;
                }
                .school-header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #3f51b5;
                    padding-bottom: 20px;
                }
                .school-logo {
                    max-width: 100px;
                    height: auto;
                    margin-bottom: 10px;
                }
                .report-details {
                    margin-bottom: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .summary-stats {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .stat-item {
                    border: 1px solid #ddd;
                    padding: 15px;
                    min-width: 150px;
                }
                .stat-label {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .stat-value {
                    font-size: 1.2rem;
                }
                .status-indicator {
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 0.9rem;
                }
                .status-present {
                    background-color: #E8F5E9;
                    color: #2E7D32;
                }
                .status-absent {
                    background-color: #FFEBEE;
                    color: #C62828;
                }
                .status-late {
                    background-color: #FFF8E1;
                    color: #F57F17;
                }
                .chart-area, .chart-placeholder {
                    display: none;
                }
                .calendar-view {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 5px;
                    margin-bottom: 20px;
                }
                .calendar-day {
                    border: 1px solid #ddd;
                    padding: 5px;
                    text-align: center;
                    min-height: 40px;
                }
                .day-present {
                    background-color: #E8F5E9;
                }
                .day-absent {
                    background-color: #FFEBEE;
                }
                .day-late {
                    background-color: #FFF8E1;
                }
                .day-weekend {
                    background-color: #f2f2f2;
                    color: #999;
                }
                .footer {
                    margin-top: 50px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-top: 1px solid #ddd;
                    padding-top: 20px;
                }
                @media print {
                    body {
                        margin: 0;
                        padding: 15px;
                    }
                    @page {
                        size: portrait;
                        margin: 1cm;
                    }
                }
            </style>
        </head>
        <body>
            <div class="school-header">
                <img src="/assets/img/logo.jpg" alt="School Logo" class="school-logo">
                <h1>Franciscan Catholic Nursery & Primary School</h1>
                <h2>Attendance Report</h2>
                <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
            
            ${reportContent.innerHTML}
            
            <div class="footer">
                <p>This report is automatically generated by the School Management System.</p>
                <p>Generated by: ${sessionStorage.getItem('userName') || 'Administrator'}</p>
                <p>Date & Time: ${new Date().toLocaleString()}</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Log the activity
    logActivity('Printed attendance report');
    
    // Print after a short delay to ensure the content is loaded
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
    }, 500);
}

// Export report to CSV
function exportReport() {
    const reportContent = getElement('report-content');
    
    if (!reportContent || !reportContent.innerHTML.trim()) {
        showNotification('Please generate a report first.', 'warning');
        return;
    }
    
    // Determine report type
    let reportType = 'attendance';
    let fileName = 'Attendance_Report';
    
    if (reportContent.querySelector('.student-report-header')) {
        reportType = 'student';
        const studentName = reportContent.querySelector('.student-details h4')?.textContent || 'Student';
                fileName = `Student_Attendance_${studentName.replace(/\s+/g, '_')}`;
    } else if (reportContent.querySelector('h3')?.textContent.includes('Class')) {
        reportType = 'class';
        const className = reportContent.querySelector('.report-details p:first-child')?.textContent.split(':')[1].trim() || 'Class';
        fileName = `Class_Attendance_${className.replace(/\s+/g, '_')}`;
    } else if (reportContent.querySelector('h3')?.textContent.includes('School-wide')) {
        reportType = 'summary';
        fileName = 'School_Attendance_Summary';
    }
    
    // Add date range to filename
    const startDate = getElement('report-start-date')?.value || '';
    const endDate = getElement('report-end-date')?.value || '';
    
    if (startDate && endDate) {
        fileName += `_${startDate}_to_${endDate}`;
    }
    
    // Create CSV content based on report type
    let csvContent = '';
    
    if (reportType === 'student') {
        // Student attendance report
        csvContent = 'Date,Status,Time In,Notes\n';
        
        const rows = reportContent.querySelectorAll('.report-table tbody tr');
        rows.forEach(row => {
            const date = row.querySelector('td:nth-child(1)')?.textContent || '';
            const status = row.querySelector('td:nth-child(2) .status-indicator')?.textContent || '';
            const timeIn = row.querySelector('td:nth-child(3)')?.textContent || '';
            const notes = row.querySelector('td:nth-child(4)')?.textContent || '';
            
            // Escape any commas in the fields
            const escapedNotes = `"${notes.replace(/"/g, '""')}"`;
            
            csvContent += `${date},${status},${timeIn},${escapedNotes}\n`;
        });
    } else if (reportType === 'class') {
        // Class attendance report
        csvContent = 'Student ID,Student Name,Present Days,Absent Days,Late Days,Attendance Rate\n';
        
        const rows = reportContent.querySelectorAll('.report-table tbody tr');
        rows.forEach(row => {
            const studentId = row.querySelector('td:nth-child(1)')?.textContent || '';
            const studentName = row.querySelector('td:nth-child(2)')?.textContent || '';
            const presentDays = row.querySelector('td:nth-child(3)')?.textContent || '';
            const absentDays = row.querySelector('td:nth-child(4)')?.textContent || '';
            const lateDays = row.querySelector('td:nth-child(5)')?.textContent || '';
            const attendanceRate = row.querySelector('td:nth-child(6) .status-indicator')?.textContent || '';
            
            // Escape any commas in the fields
            const escapedName = `"${studentName.replace(/"/g, '""')}"`;
            
            csvContent += `${studentId},${escapedName},${presentDays},${absentDays},${lateDays},${attendanceRate}\n`;
        });
    } else if (reportType === 'summary') {
        // Summary attendance report
        csvContent = 'Class,Students,Present Days,Absent Days,Late Days,Attendance Rate\n';
        
        const rows = reportContent.querySelectorAll('.report-table tbody tr');
        rows.forEach(row => {
            const className = row.querySelector('td:nth-child(1)')?.textContent || '';
            const students = row.querySelector('td:nth-child(2)')?.textContent || '';
            const presentDays = row.querySelector('td:nth-child(3)')?.textContent || '';
            const absentDays = row.querySelector('td:nth-child(4)')?.textContent || '';
            const lateDays = row.querySelector('td:nth-child(5)')?.textContent || '';
            const attendanceRate = row.querySelector('td:nth-child(6) .status-indicator')?.textContent || '';
            
            // Escape any commas in the fields
            const escapedClass = `"${className.replace(/"/g, '""')}"`;
            
            csvContent += `${escapedClass},${students},${presentDays},${absentDays},${lateDays},${attendanceRate}\n`;
        });
    }
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Log the activity
    logActivity(`Exported ${reportType} attendance report to CSV`);
    
    showNotification('Report exported successfully.', 'success');
}

// Generate date range
function generateDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];
    
    let current = new Date(start);
    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    
    return dates;
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Get current time
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

// Show notification
function showNotification(message, type = 'info') {
    // Check if notifications container exists, if not create it
    let notificationsContainer = document.querySelector('.notifications-container');
    
    if (!notificationsContainer) {
        notificationsContainer = document.createElement('div');
        notificationsContainer.className = 'notifications-container';
        document.body.appendChild(notificationsContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Add icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-times-circle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    notification.innerHTML = `
        ${icon}
        <span class="notification-message">${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to container
    notificationsContainer.appendChild(notification);
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.add('notification-hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('notification-show');
    }, 10);
}

// Helper function to get element by ID
function getElement(id) {
    return document.getElementById(id);
}

// Helper function to get item from storage
function getStorageItem(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error getting item ${key} from storage:`, error);
        return null;
    }
}

// Helper function to set item in storage
function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error setting item ${key} in storage:`, error);
        return false;
    }
}

// AttendanceAPI - Mock API for demo purposes
// In a real application, this would make actual API calls to a server
const AttendanceAPI = {
    // Get authentication token
    getAuthToken() {
        return sessionStorage.getItem('authToken') || '';
    },
    
    // Get attendance data
    async getAttendance(date, className) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check if we have stored data
        const storedData = getStorageItem(`attendance_${date}_${className}`);
        if (storedData) {
            return storedData;
        }
        
        // Generate sample data
        const students = this.getSampleStudents(className);
        return students.map(student => ({
            studentId: student.id,
            studentName: student.name,
            status: '',
            timeIn: '',
            notes: ''
        }));
    },
    
    // Save attendance data
    async saveAttendance(date, className, attendanceData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store in localStorage for demo
        setStorageItem(`attendance_${date}_${className}`, attendanceData);
        
        return { success: true, message: 'Attendance saved successfully' };
    },
    
    // Generate attendance report
    async generateReport(params) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (params.reportType === 'class') {
            return this.generateClassReport(params);
        } else if (params.reportType === 'student') {
            return this.generateStudentReport(params);
        } else if (params.reportType === 'summary') {
            return this.generateSummaryReport(params);
        }
        
        throw new Error(`Unknown report type: ${params.reportType}`);
    },
    
    // Generate class report
    generateClassReport(params) {
        const { className, startDate, endDate } = params;
        
        // Get class display name
        const classMap = {
            'nursery1': 'Nursery 1',
            'nursery2': 'Nursery 2',
            'primary1': 'Primary 1',
            'primary2': 'Primary 2',
            'primary3': 'Primary 3',
            'primary4': 'Primary 4',
            'primary5': 'Primary 5',
            'primary6': 'Primary 6'
        };
        
        const classDisplayName = classMap[className] || className;
        
        // Generate date range
        const dates = generateDateRange(startDate, endDate);
        
        // Generate sample students
        const students = this.getSampleStudents(className);
        
        // Generate sample attendance data for each student
        students.forEach(student => {
            student.presentCount = 0;
            student.absentCount = 0;
            student.lateCount = 0;
            
            // Generate random attendance for each day
            dates.forEach(date => {
                const dayOfWeek = new Date(date).getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                
                if (!isWeekend) {
                    const random = Math.random();
                    
                    if (random < 0.85) {
                        student.presentCount++;
                    } else if (random < 0.95) {
                        student.lateCount++;
                    } else {
                        student.absentCount++;
                    }
                }
            });
            
            // Calculate attendance rate
            const totalDays = student.presentCount + student.absentCount + student.lateCount;
            student.attendanceRate = totalDays > 0 ? Math.round((student.presentCount + student.lateCount) / totalDays * 100) : 0;
        });
        
        // Sort students by attendance rate (descending)
        students.sort((a, b) => b.attendanceRate - a.attendanceRate);
        
        // Calculate statistics
        const perfectAttendance = students.filter(s => s.attendanceRate === 100).length;
        const chronicAbsence = students.filter(s => s.attendanceRate < 80).length;
        
        // Calculate average attendance rate
        const totalRate = students.reduce((sum, student) => sum + student.attendanceRate, 0);
        const averageAttendanceRate = students.length > 0 ? Math.round(totalRate / students.length) : 0;
        
        // Find highest attendance day (would be more complex in real app)
        const highestAttendanceDay = formatDate(dates[Math.floor(Math.random() * dates.length)]);
        
        return {
            reportType: 'class',
            className,
            classDisplayName,
            startDate,
            endDate,
            dates,
            students,
            stats: {
                averageAttendanceRate,
                perfectAttendance,
                chronicAbsence,
                highestAttendanceDay
            }
        };
    },
    
    // Generate student report
    generateStudentReport(params) {
        const { studentId, startDate, endDate } = params;
        
        // Generate date range
        const dates = generateDateRange(startDate, endDate);
        
        // Generate sample student data
        const student = {
            id: studentId,
            name: this.getRandomStudentName(),
            class: this.getRandomClassName(),
            presentCount: 0,
            absentCount: 0,
            lateCount: 0,
            attendanceRate: 0,
            attendanceByMonth: {}
        };
        
        // Generate sample attendance records
        const attendanceRecords = [];
        
        dates.forEach(date => {
            const dayOfWeek = new Date(date).getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            if (!isWeekend) {
                const random = Math.random();
                let status;
                
                if (random < 0.85) {
                    status = 'present';
                    student.presentCount++;
                } else if (random < 0.95) {
                    status = 'late';
                    student.lateCount++;
                } else {
                    status = 'absent';
                    student.absentCount++;
                }
                
                attendanceRecords.push({
                    date,
                    status,
                    timeIn: status === 'present' ? '08:00' : status === 'late' ? '08:' + (Math.floor(Math.random() * 30) + 10) : '',
                    notes: status === 'absent' ? this.getRandomAbsenceReason() : ''
                });
                
                                // Group by month for the calendar view
                const month = date.substring(0, 7); // YYYY-MM
                if (!student.attendanceByMonth[month]) {
                    student.attendanceByMonth[month] = [];
                }
                
                student.attendanceByMonth[month].push({
                    date,
                    status,
                    day: parseInt(date.substring(8, 10))
                });
            }
        });
        
        // Calculate attendance rate
        const totalDays = student.presentCount + student.absentCount + student.lateCount;
        student.attendanceRate = totalDays > 0 ? Math.round((student.presentCount + student.lateCount) / totalDays * 100) : 0;
        
        return {
            reportType: 'student',
            student,
            attendanceRecords,
            startDate,
            endDate
        };
    },
    
    // Generate summary report
    generateSummaryReport(params) {
        const { startDate, endDate } = params;
        
        // Generate date range
        const dates = generateDateRange(startDate, endDate);
        
        // Generate sample class data
        const classes = [
            { id: 'nursery1', name: 'Nursery 1', students: 15 },
            { id: 'nursery2', name: 'Nursery 2', students: 18 },
            { id: 'primary1', name: 'Primary 1', students: 25 },
            { id: 'primary2', name: 'Primary 2', students: 22 },
            { id: 'primary3', name: 'Primary 3', students: 20 },
            { id: 'primary4', name: 'Primary 4', students: 23 },
            { id: 'primary5', name: 'Primary 5', students: 21 },
            { id: 'primary6', name: 'Primary 6', students: 19 }
        ];
        
        // Generate sample attendance data for each class
        classes.forEach(cls => {
            cls.presentCount = 0;
            cls.absentCount = 0;
            cls.lateCount = 0;
            cls.totalDays = dates.length * cls.students;
            
            // Generate random attendance counts
            cls.presentCount = Math.floor(cls.totalDays * (0.8 + Math.random() * 0.15));
            cls.lateCount = Math.floor((cls.totalDays - cls.presentCount) * 0.6);
            cls.absentCount = cls.totalDays - cls.presentCount - cls.lateCount;
            
            // Calculate attendance rate
            cls.attendanceRate = Math.round((cls.presentCount + cls.lateCount) / cls.totalDays * 100);
        });
        
        // Sort classes by attendance rate
        classes.sort((a, b) => b.attendanceRate - a.attendanceRate);
        
        // Calculate school-wide statistics
        const totalStudents = classes.reduce((sum, cls) => sum + cls.students, 0);
        const totalPresentCount = classes.reduce((sum, cls) => sum + cls.presentCount, 0);
        const totalAbsentCount = classes.reduce((sum, cls) => sum + cls.absentCount, 0);
        const totalLateCount = classes.reduce((sum, cls) => sum + cls.lateCount, 0);
        const totalDays = classes.reduce((sum, cls) => sum + cls.totalDays, 0);
        const schoolAttendanceRate = Math.round((totalPresentCount + totalLateCount) / totalDays * 100);
        
        return {
            reportType: 'summary',
            classes,
            dates,
            startDate,
            endDate,
            stats: {
                totalStudents,
                totalPresentCount,
                totalAbsentCount,
                totalLateCount,
                totalDays,
                schoolAttendanceRate
            }
        };
    },
    
    // Get sample students
    getSampleStudents(className) {
        const classMap = {
            'nursery1': { prefix: 'N1', count: 15, name: 'Nursery 1' },
            'nursery2': { prefix: 'N2', count: 18, name: 'Nursery 2' },
            'primary1': { prefix: 'P1', count: 25, name: 'Primary 1' },
            'primary2': { prefix: 'P2', count: 22, name: 'Primary 2' },
            'primary3': { prefix: 'P3', count: 20, name: 'Primary 3' },
            'primary4': { prefix: 'P4', count: 23, name: 'Primary 4' },
            'primary5': { prefix: 'P5', count: 21, name: 'Primary 5' },
            'primary6': { prefix: 'P6', count: 19, name: 'Primary 6' }
        };
        
        const classInfo = classMap[className] || { prefix: 'STD', count: 20, name: 'Unknown Class' };
        const students = [];
        
        for (let i = 1; i <= classInfo.count; i++) {
            students.push({
                id: `${classInfo.prefix}${i.toString().padStart(3, '0')}`,
                name: this.getRandomStudentName()
            });
        }
        
        return students;
    },
    
    // Get random student name
    getRandomStudentName() {
        const firstNames = ['John', 'Mary', 'David', 'Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'Daniel', 'Sophia', 'Matthew', 'Ava', 'Joseph', 'Isabella', 'Andrew', 'Mia', 'William', 'Charlotte', 'Alexander', 'Amelia', 'Joshua', 'Harper', 'Christopher', 'Evelyn', 'Nicholas', 'Abigail', 'Ryan', 'Emily', 'Tyler', 'Elizabeth'];
        
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King'];
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        return `${firstName} ${lastName}`;
    },
    
    // Get random class name
    getRandomClassName() {
        const classes = ['Nursery 1', 'Nursery 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'];
        return classes[Math.floor(Math.random() * classes.length)];
    },
    
    // Get random absence reason
    getRandomAbsenceReason() {
        const reasons = ['Sick leave', 'Family emergency', 'Medical appointment', 'Religious holiday', 'Transportation issues', 'Weather conditions', 'Personal reasons'];
        return reasons[Math.floor(Math.random() * reasons.length)];
    }
};

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date display
    updateDateDisplay();
    
    // Initialize sidebar toggle for mobile
    initSidebarToggle();
    
    // Initialize tabs
    initTabs();
    
    // Initialize modals
    initModals();
    
    // Initialize form submissions
    initFormSubmissions();
    
    // Initialize attendance functionality
    initAttendance();
    
    // Initialize attendance reports
    initAttendanceReports();
    
    // Set today's date as default
    setTodayAsDefault();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to the Attendance Management System', 'info');
    }, 1000);
});




