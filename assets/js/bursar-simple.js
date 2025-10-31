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
  // Sidebar toggle functionality
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const dashboardContainer = document.querySelector('.dashboard-container');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      sidebarToggle.classList.toggle('active');
      dashboardContainer.classList.toggle('sidebar-open');
    });

    // Close sidebar when clicking overlay
    document.addEventListener('click', (e) => {
      if (dashboardContainer.classList.contains('sidebar-open') && 
          !sidebar.contains(e.target) && 
          !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('active');
        sidebarToggle.classList.remove('active');
        dashboardContainer.classList.remove('sidebar-open');
      }
    });
  }

  // Payment storage
  let payments = JSON.parse(localStorage.getItem('franciscan_payments') || '[]');
  
  // Helper functions
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

  // Receipt form fields
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

  const buildReceiptPreview = () => {
    const receiptPreviewEl = document.getElementById('receipt-preview');
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
    const bursarName = 'Sr. Clare Ohagwa, OSF';
    const sanitizedNotes = notes ? notes.replace(/\n/g, '<br />') : '';

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
            <span class="label">Learner</span>
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

  // Attach preview handlers
  Object.values(receiptFormFields).forEach(field => {
    if (field) {
      field.addEventListener('input', buildReceiptPreview);
      field.addEventListener('change', buildReceiptPreview);
    }
  });

  // Preview button
  const previewBtn = document.getElementById('preview-receipt');
  if (previewBtn) {
    previewBtn.addEventListener('click', buildReceiptPreview);
  }

  // Update payments table
  function updatePaymentsTable() {
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
        <td><span class="status-pill paid">Paid</span></td>
        <td>${formatPaymentMode(payment.paymentMode)}</td>
        <td>${formatDate(payment.paymentDate)}</td>
      </tr>
    `).join('');
  }
  
  // Update dashboard stats
  function updateDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayPayments = payments.filter(p => p.paymentDate === today);
    const todayTotal = todayPayments.reduce((sum, p) => sum + p.amount, 0);
    
    const todayTotalEl = document.querySelector('.banner-stat strong');
    const receiptsCountEl = document.querySelectorAll('.banner-stat strong')[1];
    
    if (todayTotalEl) todayTotalEl.textContent = formatCurrency(todayTotal);
    if (receiptsCountEl) receiptsCountEl.textContent = todayPayments.length;
  }
  
  // Record payment button
  const recordPaymentBtn = document.getElementById('record-payment-btn');
  if (recordPaymentBtn) {
    recordPaymentBtn.addEventListener('click', () => {
      // Scroll to receipt form
      document.getElementById('receipts').scrollIntoView({ behavior: 'smooth' });
      
      // Focus on first field
      setTimeout(() => {
        receiptFormFields.student?.focus();
      }, 500);
    });
  }
  
  // Generate button
  const generateBtn = document.getElementById('generate-receipt');
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
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

      // Save payment record
      const { id: receiptId } = ensureReceiptIdentity();
      const newPayment = {
        id: `PAY-${Date.now()}`,
        receiptId: receiptId,
        studentName: student,
        studentClass: studentClass,
        amount: parseFloat(amount),
        purpose: purpose,
        paymentMode: paymentMode || 'cash',
        paymentDate: paymentDate || new Date().toISOString().split('T')[0],
        term: term,
        session: session,
        notes: notes,
        createdAt: new Date().toISOString()
      };
      
      payments.unshift(newPayment); // Add to beginning
      localStorage.setItem('franciscan_payments', JSON.stringify(payments));
      
      // Update UI
      updatePaymentsTable();
      updateDashboardStats();
      
      buildReceiptPreview();
      
      // Scroll to preview
      const previewElement = document.getElementById('receipt-preview');
      if (previewElement) {
        previewElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      alert('Payment recorded and e-Receipt generated successfully!');
    });
  }

  // Download button
  const downloadBtn = document.getElementById('download-receipt');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
      const student = receiptFormFields.student?.value.trim();
      const rawAmount = receiptFormFields.amount?.value;
      const purpose = receiptFormFields.purpose?.value.trim();

      if (!student || !rawAmount || !purpose) {
        alert('Please complete the receipt form before downloading the PDF.');
        return;
      }

      // Ensure receipt is generated first
      buildReceiptPreview();
      
      const receiptElement = document.querySelector('.receipt-shell');
      if (!receiptElement) {
        alert('Please generate the receipt preview first.');
        return;
      }

      try {
        // Show loading message
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        downloadBtn.disabled = true;

        // Capture the receipt with html2canvas
        const canvas = await html2canvas(receiptElement, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 500,
          height: receiptElement.offsetHeight
        });

        // Create PDF
        const { jsPDF } = window.jspdf;
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate dimensions to fit A4 with margins
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const margin = 10; // 10mm margin on all sides
        
        const maxWidth = pageWidth - (margin * 2);
        const maxHeight = pageHeight - (margin * 2);
        
        // Calculate scaled dimensions to fit within margins
        let imgWidth = maxWidth;
        let imgHeight = (canvas.height * maxWidth) / canvas.width;
        
        // If still too tall, scale down further
        if (imgHeight > maxHeight) {
          imgHeight = maxHeight;
          imgWidth = (canvas.width * maxHeight) / canvas.height;
        }
        
        // Center the image on the page
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        
        // Add image to PDF (single page, centered)
        doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        
        const { id: receiptId } = ensureReceiptIdentity();
        doc.save(`receipt-${receiptId}.pdf`);
        
        // Restore button
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
        
        // Restore button
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download PDF';
        downloadBtn.disabled = false;
      }
    });
  }

  // Clear payments button
  const clearPaymentsBtn = document.getElementById('clear-payments');
  if (clearPaymentsBtn) {
    clearPaymentsBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all payment records? This action cannot be undone.')) {
        payments = [];
        localStorage.setItem('franciscan_payments', JSON.stringify(payments));
        updatePaymentsTable();
        updateDashboardStats();
        alert('All payment records have been cleared.');
      }
    });
  }
  
  // Logout button
  const logoutButton = document.getElementById('logout-btn');
  if (logoutButton) {
    logoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      sessionStorage.removeItem('currentUser');
      localStorage.removeItem('currentUser');
      window.location.href = 'portal.html';
    });
  }
  
  // Initialize on load
  updatePaymentsTable();
  updateDashboardStats();

});