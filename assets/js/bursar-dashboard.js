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

  const loadImageAsBase64 = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error loading image:', error);
      // Fallback for local files: use XMLHttpRequest
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
          const successStatus = xhr.status === 200 || xhr.status === 0;
          if (successStatus && xhr.response) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(xhr.response);
          } else {
            resolve(null);
          }
        };
        xhr.onerror = () => resolve(null);
        xhr.send();
      });
    }
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
            <p>${date}</p>
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
    downloadBtn.addEventListener('click', async () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

      const student = receiptFormFields.student?.value.trim();
      const studentClass = receiptFormFields.class?.value.trim();
      const rawAmount = receiptFormFields.amount?.value;
      const purpose = receiptFormFields.purpose?.value.trim();
      const mode = receiptFormFields.mode?.value;
      const dateValue = receiptFormFields.date?.value;
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
Payment Date: ${feeDate}

${notes ? `Message from bursar: ${notes}

` : ''}You may verify this receipt anytime at franciscannps.edu.ng/verify.

Thank you for your continued partnership in your child's education.

Warm regards,
${currentUser.name || 'Sr. Clare Ohagwa, OSF'}
Bursar, Franciscan Catholic Nursery & Primary School`);

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
