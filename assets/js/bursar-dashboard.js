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

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || '{}');
  const welcomeNameEl = document.getElementById('welcome-name');
  const bursarNameEl = document.getElementById('bursar-name');
  const bursarRoleEl = document.getElementById('bursar-role');
  const receiptPreviewEl = document.getElementById('receipt-preview');

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

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

  const paymentModalButton = document.querySelector('[data-target="#payment-modal"]');
  if (paymentModalButton) {
    paymentModalButton.addEventListener('click', () => {
      alert('Payment form coming soon.');
    });
  }

  const receiptPanelButton = document.querySelector('[data-target="#receipt-panel"]');
  if (receiptPanelButton) {
    receiptPanelButton.addEventListener('click', () => {
      document.getElementById('receipt-student')?.focus();
    });
  }

  const exportPanelButton = document.querySelector('[data-target="#export-panel"]');
  if (exportPanelButton) {
    exportPanelButton.addEventListener('click', () => {
      window.scrollTo({ top: document.getElementById('reports')?.offsetTop || 0, behavior: 'smooth' });
    });
  }

  const receiptFormFields = {
    student: document.getElementById('receipt-student'),
    class: document.getElementById('receipt-class'),
    amount: document.getElementById('receipt-amount'),
    purpose: document.getElementById('receipt-purpose'),
    mode: document.getElementById('receipt-mode'),
    date: document.getElementById('receipt-date'),
    notes: document.getElementById('receipt-notes'),
  };

  const buildReceiptPreview = () => {
    const student = receiptFormFields.student?.value.trim();
    const studentClass = receiptFormFields.class?.value.trim();
    const amount = formatCurrency(receiptFormFields.amount?.value || 0);
    const purpose = receiptFormFields.purpose?.value.trim();
    const mode = receiptFormFields.mode?.value;
    const date = formatDate(receiptFormFields.date?.value);
    const notes = receiptFormFields.notes?.value.trim();

    if (!student || !amount || !purpose) {
      receiptPreviewEl.innerHTML = `
        <div class="preview-placeholder">
          <i class="fas fa-receipt"></i>
          <p>Fill the form to preview the e-receipt.</p>
        </div>
      `;
      return;
    }

    receiptPreviewEl.innerHTML = `
      <div class="receipt-shell">
        <header class="receipt-header">
          <div class="brand">
            <div class="logo-circle">
              <img src="assets/img/logo.jpg" alt="Franciscan Catholic School" />
            </div>
            <div>
              <h3>Franciscan Catholic School</h3>
              <p>Official e-Receipt</p>
            </div>
          </div>
          <div class="receipt-meta">
            <span>Receipt ID:</span>
            <strong>RCPT-${Math.floor(Math.random() * 9000) + 1000}</strong>
          </div>
        </header>
        <section class="receipt-body">
          <div class="info-row">
            <span>Received From</span>
            <strong>${student}</strong>
          </div>
          <div class="info-row">
            <span>Class</span>
            <strong>${studentClass || 'Not specified'}</strong>
          </div>
          <div class="info-row amount">
            <span>Amount</span>
            <strong>${amount}</strong>
          </div>
          <div class="info-row">
            <span>Purpose</span>
            <strong>${purpose}</strong>
          </div>
          <div class="info-row">
            <span>Payment Mode</span>
            <strong>${mode || 'Pending selection'}</strong>
          </div>
          <div class="info-row">
            <span>Date</span>
            <strong>${date}</strong>
          </div>
        </section>
        ${notes ? `<section class="receipt-notes">
          <h4>Notes</h4>
          <p>${notes}</p>
        </section>` : ''}
        <footer class="receipt-footer">
          <div>
            <span>Bursar</span>
            <strong>${currentUser.name || 'Sr. Clare Ohagwa, OSF'}</strong>
          </div>
          <div class="signature-line">
            <span>Signature</span>
          </div>
        </footer>
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
    generateBtn.addEventListener('click', () => {
      // Validate required fields
      const student = receiptFormFields.student?.value.trim();
      const amount = receiptFormFields.amount?.value.trim();
      const purpose = receiptFormFields.purpose?.value.trim();

      if (!student || !amount || !purpose) {
        alert('Please fill in all required fields: Student Name, Amount, and Payment For.');
        return;
      }

      if (isNaN(amount) || Number(amount) <= 0) {
        alert('Please enter a valid amount greater than 0.');
        return;
      }

      buildReceiptPreview();
      alert('e-Receipt generated successfully! Ready for download or sharing.');
    });
  }

  const downloadBtn = document.getElementById('download-receipt');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Get receipt data
      const student = receiptFormFields.student?.value.trim();
      const studentClass = receiptFormFields.class?.value.trim();
      const amount = formatCurrency(receiptFormFields.amount?.value || 0);
      const purpose = receiptFormFields.purpose?.value.trim();
      const mode = receiptFormFields.mode?.value;
      const date = formatDate(receiptFormFields.date?.value);
      const notes = receiptFormFields.notes?.value.trim();
      const receiptId = `RCPT-${Math.floor(Math.random() * 9000) + 1000}`;

      // Add content to PDF
      doc.setFontSize(20);
      doc.text('Franciscan Catholic School', 20, 30);
      doc.setFontSize(16);
      doc.text('Official e-Receipt', 20, 45);

      doc.setFontSize(12);
      doc.text(`Receipt ID: ${receiptId}`, 20, 65);
      doc.text(`Received From: ${student}`, 20, 80);
      doc.text(`Class: ${studentClass || 'Not specified'}`, 20, 95);
      doc.text(`Amount: ${amount}`, 20, 110);
      doc.text(`Purpose: ${purpose}`, 20, 125);
      doc.text(`Payment Mode: ${mode || 'Pending selection'}`, 20, 140);
      doc.text(`Date: ${date}`, 20, 155);

      if (notes) {
        doc.text(`Notes: ${notes}`, 20, 170);
      }

      doc.text(`Bursar: ${currentUser.name || 'Sr. Clare Ohagwa, OSF'}`, 20, 200);

      // Download the PDF
      doc.save(`receipt-${receiptId}.pdf`);
    });
  }

  const shareBtn = document.getElementById('share-receipt');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const student = receiptFormFields.student?.value.trim();
      const amount = formatCurrency(receiptFormFields.amount?.value || 0);
      const purpose = receiptFormFields.purpose?.value.trim();
      const date = formatDate(receiptFormFields.date?.value);

      const subject = encodeURIComponent('Payment Receipt - Franciscan Catholic School');
      const body = encodeURIComponent(`Dear Parent/Guardian,

Please find the payment receipt details below:

Student: ${student}
Amount: ${amount}
Purpose: ${purpose}
Date: ${date}

Thank you for your payment.

Regards,
Sr. Clare Ohagwa, OSF
Bursar
Franciscan Catholic Nursery and Primary School`);

      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    });
  }

  document.querySelectorAll('[data-report]').forEach((button) => {
    button.addEventListener('click', () => {
      const reportType = button.dataset.report;
      alert(`PDF export for ${reportType} report coming soon.`);
    });
  });

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

  // Settings functionality
  const profileSettingsBtn = document.getElementById('profile-settings-btn');
  if (profileSettingsBtn) {
    profileSettingsBtn.addEventListener('click', () => {
      alert('Profile settings coming soon.');
    });
  }

  const notificationSettingsBtn = document.getElementById('notification-settings-btn');
  if (notificationSettingsBtn) {
    notificationSettingsBtn.addEventListener('click', () => {
      alert('Notification settings coming soon.');
    });
  }

  const securitySettingsBtn = document.getElementById('security-settings-btn');
  if (securitySettingsBtn) {
    securitySettingsBtn.addEventListener('click', () => {
      alert('Security settings coming soon.');
    });
  }

  const systemSettingsBtn = document.getElementById('system-settings-btn');
  if (systemSettingsBtn) {
    systemSettingsBtn.addEventListener('click', () => {
      alert('System preferences coming soon.');
    });
  }


});
