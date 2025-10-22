// Set current date immediately
const currentDateEl = document.getElementById('current-date');
if (currentDateEl) {
  currentDateEl.textContent = new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || '{}');
  
  if (!currentUser.role || currentUser.role !== 'bursar') {
    window.location.href = 'portal.html';
    return;
  }
  
  const welcomeNameEl = document.getElementById('welcome-name');
  const bursarNameEl = document.getElementById('bursar-name');
  const bursarRoleEl = document.getElementById('bursar-role');
  const receiptPreviewEl = document.getElementById('receipt-preview');
  
  // Load real data from backend
  let payments = [];
  let dashboardStats = {};
  
  try {
    const [paymentsResponse, statsResponse] = await Promise.all([
      window.api.getPayments(),
      window.api.getDashboardStats()
    ]);
    
    payments = paymentsResponse.payments || [];
    dashboardStats = statsResponse.stats || {};
    
    // Update dashboard stats
    updateDashboardStats(dashboardStats);
    updatePaymentsTable(payments);
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    // If token is invalid, redirect to login
    if (error.message.includes('token') || error.message.includes('401') || error.message.includes('403')) {
      window.api.clearToken();
      sessionStorage.removeItem('currentUser');
      localStorage.removeItem('currentUser');
      window.location.href = 'portal.html';
      return;
    }
  }

  // Helper functions
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  const formatPaymentMode = (modeValue) => {
    const paymentLabels = {
      transfer: 'Bank Transfer',
      pos: 'POS',
      cash: 'Cash',
      online: 'Online Payment',
    };
    if (!modeValue) return 'Pending selection';
    return paymentLabels[modeValue] || modeValue;
  };
  
  function updateDashboardStats(stats) {
    const todayTotalEl = document.querySelector('.banner-stat strong');
    const receiptsCountEl = document.querySelectorAll('.banner-stat strong')[1];
    const outstandingCountEl = document.querySelectorAll('.banner-stat strong')[2];
    
    if (todayTotalEl) todayTotalEl.textContent = formatCurrency(stats.todayTotal || 0);
    if (receiptsCountEl) receiptsCountEl.textContent = stats.todayCount || 0;
    if (outstandingCountEl) outstandingCountEl.textContent = stats.pendingCount || 0;
  }
  
  function updatePaymentsTable(payments) {
    const tableBody = document.querySelector('.payments-table tbody');
    if (!tableBody) return;
    
    if (payments.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No payments recorded yet</td></tr>';
      return;
    }
    
    tableBody.innerHTML = payments.slice(0, 10).map(payment => `
      <tr>
        <td><span class="badge">${payment.receiptId}</span></td>
        <td>${payment.studentName}</td>
        <td>${payment.studentClass || 'N/A'}</td>
        <td>${formatCurrency(payment.amount)}</td>
        <td><span class="status-pill ${payment.status}">${payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span></td>
        <td>${formatPaymentMode(payment.paymentMode)}</td>
        <td>${formatDate(payment.paymentDate)}</td>
      </tr>
    `).join('');
  }

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('en-NG', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  // Populate bursar info
  if (currentUser.role === 'bursar') {
    if (welcomeNameEl) welcomeNameEl.textContent = currentUser.name.split(' ')[1] || currentUser.name;
    if (bursarNameEl) bursarNameEl.textContent = currentUser.name;
    if (bursarRoleEl) bursarRoleEl.textContent = 'Bursar';
  }

  // Sidebar toggle for mobile
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const dashboardContainer = document.querySelector('.dashboard-container');

  if (sidebarToggle && sidebar && dashboardContainer) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      dashboardContainer.classList.toggle('sidebar-open');
      sidebarToggle.classList.toggle('active');
    });
  }

  const closeSidebar = () => {
    if (!sidebar || !dashboardContainer) return;
    sidebar.classList.remove('active');
    dashboardContainer.classList.remove('sidebar-open');
    if (sidebarToggle) sidebarToggle.classList.remove('active');
  };

  // Click outside to close on mobile
  document.addEventListener('click', (e) => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;
    if (!sidebar || !dashboardContainer) return;
    if (!sidebar.classList.contains('active')) return;

    const clickedInsideSidebar = sidebar.contains(e.target);
    const clickedToggle = sidebarToggle && (e.target === sidebarToggle || sidebarToggle.contains(e.target));
    if (!clickedInsideSidebar && !clickedToggle) {
      closeSidebar();
    }
  });

  // Close when clicking overlay
  if (dashboardContainer) {
    dashboardContainer.addEventListener('click', (e) => {
      const isMobile = window.innerWidth <= 768;
      if (!isMobile) return;
      if (!sidebar || !sidebar.classList.contains('active')) return;
      if (e.target === dashboardContainer) {
        closeSidebar();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });

  const handleLogout = () => {
    window.api.clearToken();
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');
    window.location.href = 'portal.html';
  };

  const logoutButton = document.getElementById('logout-btn');
  if (logoutButton) {
    logoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      handleLogout();
    });
  }

  // Clear payments functionality
  const clearPaymentsBtn = document.getElementById('clear-payments');
  if (clearPaymentsBtn) {
    clearPaymentsBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to clear all payment records? This action cannot be undone.')) {
        try {
          // Clear from backend
          await window.api.clearPayments();
          
          // Refresh the table and stats
          updatePaymentsTable([]);
          updateDashboardStats({ todayTotal: 0, todayCount: 0, pendingCount: 0 });
          
          alert('All payment records have been cleared.');
        } catch (error) {
          console.error('Error clearing payments:', error);
          alert('Error clearing payments: ' + error.message);
        }
      }
    });
  }

  const receiptPanelButton = document.querySelector('[data-target="#receipt-panel"]');
  if (receiptPanelButton) {
    receiptPanelButton.addEventListener('click', () => {
      document.getElementById('receipt-student')?.focus();
    });
  }

  const receiptFormFields = {
    student: document.getElementById('receipt-student'),
    class: document.getElementById('receipt-class'),
    amount: document.getElementById('receipt-amount'),
    purpose: document.getElementById('receipt-purpose'),
    mode: document.getElementById('receipt-mode'),
    date: document.getElementById('receipt-date'),
    term: document.getElementById('receipt-term'),
    session: document.getElementById('receipt-session'),
    notes: document.getElementById('receipt-notes'),
  };

  const receiptState = {
    id: '',
    issuedAt: null,
  };

  const generateReceiptId = () => {
    const randomTail = Math.floor(Math.random() * 900 + 100);
    const timeStamp = Date.now().toString().slice(-6);
    return `FCS-${timeStamp}-${randomTail}`;
  };

  const resetReceiptIdentity = () => {
    receiptState.id = '';
    receiptState.issuedAt = null;
  };

  const ensureReceiptIdentity = () => {
    if (!receiptState.id) {
      receiptState.id = generateReceiptId();
      receiptState.issuedAt = new Date();
    }
    return receiptState;
  };

  const formatTime = (dateInput) => {
    const dateObj = dateInput instanceof Date ? dateInput : new Date(dateInput || Date.now());
    return dateObj.toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPaymentMode = (modeValue) => {
    const paymentLabels = {
      transfer: 'Bank Transfer',
      pos: 'POS',
      cash: 'Cash',
      online: 'Online Payment',
    };
    if (!modeValue) return 'Pending selection';
    return paymentLabels[modeValue] || modeValue;
  };

  const buildReceiptPreview = () => {
    const student = receiptFormFields.student?.value.trim();
    const studentClass = receiptFormFields.class?.value.trim();
    const rawAmount = receiptFormFields.amount?.value;
    const amount = formatCurrency(rawAmount || 0);
    const purpose = receiptFormFields.purpose?.value.trim();
    const mode = receiptFormFields.mode?.value;
    const dateValue = receiptFormFields.date?.value;
    const date = formatDate(dateValue);
    const term = receiptFormFields.term?.value;
    const session = receiptFormFields.session?.value;
    const notes = receiptFormFields.notes?.value.trim();

    if (!student || !rawAmount || !purpose) {
      resetReceiptIdentity();
      receiptPreviewEl.innerHTML = `
        <div class="preview-placeholder">
          <i class="fas fa-receipt"></i>
          <p>Fill the form to preview the e-receipt.</p>
        </div>
      `;
      return;
    }

    const { id: receiptId, issuedAt } = ensureReceiptIdentity();
    const issuedDate = formatDate(issuedAt);
    const issuedTime = formatTime(issuedAt);
    const readableMode = formatPaymentMode(mode);
    const bursarName = currentUser.name || 'Sr. Clare Ohagwa, OSF';
    const sanitizedNotes = notes ? notes.replace(/\n/g, '<br />') : '';

    receiptPreviewEl.dataset.receiptId = receiptId;
    receiptPreviewEl.dataset.receiptIssued = `${issuedDate} ${issuedTime}`;

    receiptPreviewEl.innerHTML = `
      <div class="receipt-shell">
        <header class="receipt-header">
          <div class="receipt-brand">
            <div class="brand-logo">
              <img src="assets/img/logo.jpg" alt="Franciscan Catholic School logo" />
            </div>
            <div>
              <h3>Franciscan Catholic Nursery & Primary School</h3>
              <p>Per Virtutem Ad Astra</p>
            </div>
          </div>
          <div class="receipt-meta">
            <span class="meta-pill">Official Receipt</span>
            <div class="meta-row">
              <span>Receipt No.</span>
              <strong>${receiptId}</strong>
            </div>
            <div class="meta-row">
              <span>Issued</span>
              <strong>${issuedDate} · ${issuedTime}</strong>
            </div>
          </div>
        </header>

        <section class="receipt-contact">
          <p class="contact-address">
            Franciscan Catholic Nursery & Primary School<br />
            First Unity Estate, Off Cooperative Villa, Badore, Ajah, Lagos, Nigeria
          </p>
          <div class="contact-tags">
            <span><i class="fas fa-envelope"></i> info@franciscancnps.org</span>
            <span><i class="fas fa-phone"></i> +234 913 653 8240 · +234 907 768 5251</span>
          </div>
        </section>

        <section class="receipt-body">
          <div class="info-row">
            <span>Received From</span>
            <strong>${student}</strong>
          </div>
          <div class="info-row">
            <span>Class</span>
            <strong>${studentClass || 'Class not recorded yet'}</strong>
          </div>
          <div class="info-row amount">
            <span>Amount</span>
            <strong>${amount}</strong>
          </div>
          <div class="info-row">
            <span>Payment For</span>
            <strong>${purpose}</strong>
          </div>
          <div class="info-row">
            <span>Payment Mode</span>
            <strong>${readableMode}</strong>
          </div>
          <div class="info-row">
            <span>Payment Date</span>
            <strong>${date}</strong>
          </div>
          ${term ? `<div class="info-row">
            <span>Term</span>
            <strong>${term.charAt(0).toUpperCase() + term.slice(1)} Term</strong>
          </div>` : ''}
          ${session ? `<div class="info-row">
            <span>Session</span>
            <strong>${session}</strong>
          </div>` : ''}
        </section>

        <section class="receipt-summary">
          <div class="summary-card amount">
            <span class="label">Amount Paid</span>
            <strong>${amount}</strong>
            <p>Payment for ${purpose}</p>
          </div>
          <div class="summary-card">
            <span class="label">Student</span>
            <strong>${student}</strong>
            <p>${studentClass || 'Class not recorded yet'}</p>
          </div>
          <div class="summary-card">
            <span class="label">Payment Mode</span>
            <strong>${readableMode}</strong>
            <p>${date}${term && session ? ` • ${term.charAt(0).toUpperCase() + term.slice(1)} Term ${session}` : ''}</p>
          </div>
        </section>

        ${notes ? `
          <section class="receipt-notes">
            <h4>Personal Message</h4>
            <p>${sanitizedNotes}</p>
          </section>
        ` : ''}

        <footer class="receipt-footer">
          <div class="signature-block">
            <span class="signature-label">Authorised by</span>
            <span class="signature-name">${bursarName}</span>
            <div class="signature-line"></div>
          </div>
          <div class="qr-block">
            <div class="qr-placeholder"><i class="fas fa-qrcode"></i></div>
            <span>Verify Online</span>
          </div>
        </footer>

        <div class="receipt-bottom">
          Thank you for supporting our mission of formative education.
        </div>
      </div>
    `;
  };

  const attachPreviewHandler = (element) => {
    if (!element) return;
    element.addEventListener('input', buildReceiptPreview);
    element.addEventListener('change', buildReceiptPreview);
  };

  Object.values(receiptFormFields).forEach(attachPreviewHandler);

  const previewBtn = document.getElementById('preview-receipt');
  if (previewBtn) {
    previewBtn.addEventListener('click', buildReceiptPreview);
  }

  const generateBtn = document.getElementById('generate-receipt');
  if (generateBtn) {
    generateBtn.addEventListener('click', async () => {
      // Validate required fields
      const student = receiptFormFields.student?.value.trim();
      const amount = receiptFormFields.amount?.value.trim();
      const purpose = receiptFormFields.purpose?.value.trim();
      const studentClass = receiptFormFields.class?.value.trim();
      const paymentMode = receiptFormFields.mode?.value;
      const paymentDate = receiptFormFields.date?.value;
      const term = receiptFormFields.term?.value;
      const session = receiptFormFields.session?.value;
      const notes = receiptFormFields.notes?.value.trim();

      if (!student || !amount || !purpose) {
        alert('Please fill in all required fields: Student Name, Amount, and Payment For.');
        return;
      }

      if (isNaN(amount) || Number(amount) <= 0) {
        alert('Please enter a valid amount greater than 0.');
        return;
      }

      try {
        // Save payment to backend
        const paymentData = {
          studentName: student,
          studentClass: studentClass,
          amount: parseFloat(amount),
          purpose: purpose,
          paymentMode: paymentMode || 'cash',
          paymentDate: paymentDate || new Date().toISOString().split('T')[0],
          term: term,
          session: session,
          notes: notes
        };
        
        const response = await window.api.addPayment(paymentData);
        
        if (response.success) {
          buildReceiptPreview();
          alert('Payment recorded and e-Receipt generated successfully!');
          
          // Refresh the payments table
          const paymentsResponse = await window.api.getPayments();
          updatePaymentsTable(paymentsResponse.payments || []);
          
          // Refresh dashboard stats
          const statsResponse = await window.api.getDashboardStats();
          updateDashboardStats(statsResponse.stats || {});
          
          // Clear the form
          Object.values(receiptFormFields).forEach(field => {
            if (field) field.value = '';
          });
          
        } else {
          alert('Failed to record payment. Please try again.');
        }
        
      } catch (error) {
        console.error('Error recording payment:', error);
        alert('Error recording payment: ' + error.message);
      }
    });
  }

  const downloadBtn = document.getElementById('download-receipt');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

      const student = receiptFormFields.student?.value.trim();
      const studentClass = receiptFormFields.class?.value.trim();
      const rawAmount = receiptFormFields.amount?.value;
      const purpose = receiptFormFields.purpose?.value.trim();
      const mode = receiptFormFields.mode?.value;
      const dateValue = receiptFormFields.date?.value;
      const term = receiptFormFields.term?.value;
      const session = receiptFormFields.session?.value;
      const notes = receiptFormFields.notes?.value.trim();

      if (!student || !rawAmount || !purpose) {
        alert('Please complete the receipt form before downloading the PDF.');
        return;
      }

      const amount = formatCurrency(rawAmount || 0);
      const readableMode = formatPaymentMode(mode);
      const feeDate = formatDate(dateValue);
      const { id: receiptId, issuedAt } = ensureReceiptIdentity();
      const issuedDate = formatDate(issuedAt);
      const issuedTime = formatTime(issuedAt);
      const bursarName = currentUser.name || 'Sr. Clare Ohagwa, OSF';

      doc.addImage('assets/img/logo.jpg', 'JPEG', 40, 30, 50, 50);
            
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Franciscan Catholic Nursery & Primary School', 40, 60);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('First Unity Estate, Off Cooperative Villa, Badore, Ajah, Lagos, Nigeria', 40, 80);
      doc.text('Email: bursar@franciscancnps.org · Phone: +234 913 653 8240 / +234 907 768 5251', 40, 96);
      

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('OFFICIAL PAYMENT RECEIPT', 40, 150);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Receipt No.: ${receiptId}`, 40, 180);
      doc.text(`Issued: ${issuedDate} ${issuedTime}`, 40, 198);

      const sectionTop = 220;
      doc.setFillColor(249, 245, 239);
      doc.roundedRect(36, sectionTop, 520, 140, 12, 12, 'F');
      doc.setDrawColor(184, 142, 94);
      doc.roundedRect(36, sectionTop, 520, 140, 12, 12);

      doc.setFont('helvetica', 'bold');
      doc.text('Amount Paid', 50, sectionTop + 25);
      doc.setFontSize(20);
      doc.text(amount, 50, sectionTop + 52);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Payment for ${purpose}`, 50, sectionTop + 74);

      doc.setFont('helvetica', 'bold');
      doc.text('Student', 320, sectionTop + 25);
      doc.setFont('helvetica', 'normal');
      doc.text(student, 320, sectionTop + 44);
      doc.text(studentClass || 'Class not recorded yet', 320, sectionTop + 62);

      doc.setFont('helvetica', 'bold');
      doc.text('Payment Details', 50, sectionTop + 110);
      doc.setFont('helvetica', 'normal');
      doc.text(`Mode: ${readableMode}`, 50, sectionTop + 128);
      doc.text(`Payment Date: ${feeDate}`, 50, sectionTop + 146);
      
      if (term && session) {
        doc.text(`Term: ${term.charAt(0).toUpperCase() + term.slice(1)} Term`, 320, sectionTop + 128);
        doc.text(`Session: ${session}`, 320, sectionTop + 146);
      }

      let notesYOffset = sectionTop + 180;
      if (notes) {
        doc.setFont('helvetica', 'bold');
        doc.text('Personal Message', 40, notesYOffset);
        doc.setFont('helvetica', 'normal');
        const wrapped = doc.splitTextToSize(notes, 520);
        doc.text(wrapped, 40, notesYOffset + 20);
        notesYOffset += wrapped.length * 14 + 40;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Authorised by:', 40, notesYOffset);
      doc.setFont('helvetica', 'normal');
      doc.text(bursarName, 40, notesYOffset + 20);
      doc.line(40, notesYOffset + 24, 220, notesYOffset + 24);
      

      doc.save(`receipt-${receiptId}.pdf`);
    });
  }

  const shareBtn = document.getElementById('share-receipt');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const student = receiptFormFields.student?.value.trim();
      const rawAmount = receiptFormFields.amount?.value;
      const purpose = receiptFormFields.purpose?.value.trim();
      const dateValue = receiptFormFields.date?.value;
      const term = receiptFormFields.term?.value;
      const session = receiptFormFields.session?.value;
      const notes = receiptFormFields.notes?.value.trim();

      if (!student || !rawAmount || !purpose) {
        alert('Please complete the receipt form before sharing via email.');
        return;
      }

      const amount = formatCurrency(rawAmount || 0);
      const feeDate = formatDate(dateValue);
      const { id: receiptId } = ensureReceiptIdentity();

      const subject = encodeURIComponent(`Payment Receipt ${receiptId} - Franciscan Catholic School`);
      const body = encodeURIComponent(`Dear Parent/Guardian,

Please find the payment receipt details below:

Receipt No.: ${receiptId}
Student: ${student}
Amount: ${amount}
Payment For: ${purpose}
Payment Date: ${feeDate}${term && session ? `
Term: ${term.charAt(0).toUpperCase() + term.slice(1)} Term
Session: ${session}` : ''}

${notes ? `Message from bursar: ${notes}

` : ''}You may verify this receipt anytime at franciscannps.edu.ng/verify.

Thank you for your continued partnership in your child's education.

Warm regards,
${currentUser.name || 'Sr. Clare Ohagwa, OSF'}
Bursar, Franciscan Catholic Nursery & Primary School`);

      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    });
  }

  // Sidebar navigation handling
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        // Update active class
        document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
        link.parentElement.classList.add('active');
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768 && typeof closeSidebar === 'function') {
          closeSidebar();
        }
      }
    });
  });

});