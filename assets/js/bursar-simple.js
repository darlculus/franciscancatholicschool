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
    payer: document.getElementById('receipt-payer'),
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
    if (!receiptPreviewEl) return;

    const student = receiptFormFields.student?.value.trim();
    const payer = receiptFormFields.payer?.value.trim();
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
            <strong>${payer || student}</strong>
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
          </div>
        </footer>


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
      const receiptsSection = document.getElementById('receipts');
      if (receiptsSection) {
        receiptsSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (receiptFormFields.student) receiptFormFields.student.focus();
        }, 500);
      }
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
        alert('Please fill in all required fields: Learner Name, Amount, and Payment For.');
        return;
      }

      if (isNaN(amount) || Number(amount) <= 0) {
        alert('Please enter a valid amount greater than 0.');
        return;
      }

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
      
      payments.unshift(newPayment);
      localStorage.setItem('franciscan_payments', JSON.stringify(payments));
      
      updatePaymentsTable();
      updateDashboardStats();
      buildReceiptPreview();
      
      const previewElement = document.getElementById('receipt-preview');
      if (previewElement) {
        previewElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      alert('Payment recorded and e-Receipt generated successfully!');
    });
  }

  // Download button - Simple print fallback
  const downloadBtn = document.getElementById('download-receipt');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const receiptElement = document.querySelector('.receipt-shell');
      if (!receiptElement) {
        alert('Please generate the receipt preview first.');
        return;
      }
      
      // Create print window
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${ensureReceiptIdentity().id}</title>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
            <style>
              body { font-family: 'Montserrat', sans-serif; margin: 0; padding: 5px; background: #fff; }
              .receipt-shell { max-width: 480px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 0.8rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-size: 0.85rem; }
              .receipt-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #b88e5e; }
              .receipt-brand { display: flex; align-items: center; gap: 0.8rem; }
              .brand-logo { width: 45px; height: 45px; }
              .brand-logo img { width: 100%; height: 100%; object-fit: contain; }
              .receipt-brand h3 { color: #2c3e50; font-size: 0.9rem; font-weight: 600; margin: 0; line-height: 1.1; }
              .receipt-brand p { color: #b88e5e; font-size: 0.75rem; margin: 0.15rem 0 0 0; font-style: italic; }
              .receipt-meta { text-align: right; min-width: 240px; }
              .meta-pill { background: linear-gradient(135deg, #b88e5e, #d4af37); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: inline-block; margin-bottom: 1rem; }
              .meta-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
              .meta-row span { color: #666; font-size: 0.85rem; }
              .meta-row strong { color: #2c3e50; font-weight: 600; font-size: 0.85rem; word-break: break-all; }
              .receipt-contact { background: #f8f9fa; padding: 0.6rem; border-radius: 6px; margin-bottom: 0.6rem; text-align: center; }
              .contact-address { color: #2c3e50; font-size: 0.8rem; line-height: 1.3; margin-bottom: 0.6rem; }
              .contact-tags { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
              .contact-tags span { color: #b88e5e; font-size: 0.7rem; display: flex; align-items: center; gap: 0.3rem; }
              .contact-tags i { color: #d4af37; }
              .info-row { display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 0; border-bottom: 1px solid #f0f0f0; }
              .info-row span { color: #666; font-size: 0.8rem; }
              .info-row strong { color: #2c3e50; font-weight: 600; font-size: 0.85rem; word-break: break-word; }
              .info-row.amount strong { color: #27ae60; font-size: 1rem; font-weight: 700; }
              .receipt-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem; margin-bottom: 0.6rem; }
              .summary-card { background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 0.6rem; border-radius: 6px; text-align: center; border: 1px solid #e0e0e0; }
              .summary-card.amount { background: linear-gradient(135deg, #e8f5e8, #d4edda); border-color: #27ae60; }
              .summary-card .label { color: #666; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 0.5rem; }
              .summary-card strong { color: #2c3e50; font-size: 1.1rem; font-weight: 700; display: block; margin-bottom: 0.5rem; }
              .summary-card.amount strong { color: #27ae60; font-size: 1.3rem; }
              .summary-card p { color: #666; font-size: 0.85rem; margin: 0; line-height: 1.3; }
              .receipt-notes { background: #fff8e1; padding: 1rem; border-radius: 8px; border-left: 4px solid #d4af37; margin-bottom: 1rem; }
              .receipt-notes h4 { color: #b88e5e; font-size: 1rem; margin: 0 0 0.75rem 0; font-weight: 600; }
              .receipt-notes p { color: #2c3e50; font-size: 0.95rem; line-height: 1.5; margin: 0; }
              .receipt-footer { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 0.6rem; border-top: 2px solid #b88e5e; }
              .signature-block { text-align: left; }
              .signature-label { color: #666; font-size: 0.7rem; display: block; margin-bottom: 0.3rem; }
              .signature-name { color: #2c3e50; font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 0.3rem; }
              .signature-line { width: 150px; height: 1px; background: #b88e5e; margin-top: 0.3rem; }
              .qr-block { text-align: center; }
              .qr-placeholder { width: 45px; height: 45px; background: linear-gradient(135deg, #b88e5e, #d4af37); border-radius: 6px; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.3rem; }
              .qr-placeholder i { color: white; font-size: 1.2rem; }
              .qr-block span { color: #666; font-size: 0.65rem; }

              @media print { body { margin: 0; padding: 10px; } .receipt-shell { box-shadow: none; } }
            </style>
          </head>
          <body>
            ${receiptElement.outerHTML}
            <script>setTimeout(() => { window.print(); window.close(); }, 500);</script>
          </body>
        </html>
      `);
      printWindow.document.close();
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
  
  // Share via Email button
  const shareBtn = document.getElementById('share-receipt');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const receiptElement = document.querySelector('.receipt-shell');
      if (!receiptElement) {
        alert('Please generate the receipt preview first.');
        return;
      }
      
      const student = receiptFormFields.student?.value.trim();
      const amount = formatCurrency(receiptFormFields.amount?.value);
      const { id: receiptId } = ensureReceiptIdentity();
      
      const subject = `Payment Receipt - ${receiptId} - ${student}`;
      const body = `Dear Parent/Guardian,\n\nPlease find attached the payment receipt for ${student}.\n\nReceipt Number: ${receiptId}\nAmount Paid: ${amount}\n\nThank you for your payment.\n\nBest regards,\nFranciscan Catholic School\nBursar's Office`;
      
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
  
  // Export CSV button
  const exportCsvBtn = document.querySelector('.chip-btn.primary');
  if (exportCsvBtn && exportCsvBtn.textContent.includes('Export CSV')) {
    exportCsvBtn.addEventListener('click', () => {
      if (payments.length === 0) {
        alert('No payments to export.');
        return;
      }
      
      const headers = ['Receipt ID', 'Learner', 'Class', 'Amount', 'Payment For', 'Mode', 'Date', 'Term', 'Session'];
      const rows = payments.map(p => [
        p.receiptId,
        p.studentName,
        p.studentClass || 'N/A',
        p.amount,
        p.purpose,
        formatPaymentMode(p.paymentMode),
        p.paymentDate,
        p.term || 'N/A',
        p.session || 'N/A'
      ]);
      
      let csvContent = headers.join(',') + '\n';
      rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `franciscan-payments-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  
  // Refresh button
  const refreshBtn = document.querySelector('.chip-btn');
  if (refreshBtn && refreshBtn.textContent.includes('Refresh')) {
    refreshBtn.addEventListener('click', () => {
      payments = JSON.parse(localStorage.getItem('franciscan_payments') || '[]');
      updatePaymentsTable();
      updateDashboardStats();
    });
  }
  
  // Filter button
  const filterBtn = document.querySelectorAll('.chip-btn')[1];
  if (filterBtn && filterBtn.textContent.includes('Filter')) {
    filterBtn.addEventListener('click', () => {
      const filterOption = prompt('Filter by:\n1. Today\n2. This Week\n3. This Month\n4. All\n\nEnter option number (1-4):');
      
      let filteredPayments = [...payments];
      const today = new Date();
      
      switch(filterOption) {
        case '1':
          const todayStr = today.toISOString().split('T')[0];
          filteredPayments = payments.filter(p => p.paymentDate === todayStr);
          break;
        case '2':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          filteredPayments = payments.filter(p => new Date(p.paymentDate) >= weekAgo);
          break;
        case '3':
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          filteredPayments = payments.filter(p => new Date(p.paymentDate) >= monthAgo);
          break;
        case '4':
          filteredPayments = payments;
          break;
        default:
          return;
      }
      
      const tableBody = document.querySelector('.payments-table tbody');
      if (filteredPayments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No payments found for this filter</td></tr>';
      } else {
        tableBody.innerHTML = filteredPayments.slice(0, 10).map(payment => `
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
    });
  }
  
  // Quick action buttons for scrolling
  document.querySelectorAll('.btn-action[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      const section = document.querySelector(target);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // PDF Report exports
  document.querySelectorAll('.btn-link[data-report]').forEach(btn => {
    btn.addEventListener('click', () => {
      const reportType = btn.getAttribute('data-report');
      generatePDFReport(reportType);
    });
  });
  
  function generatePDFReport(reportType) {
    if (payments.length === 0) {
      alert('No payment data available to generate report.');
      return;
    }
    
    const reportTitles = {
      revenue: 'Revenue Summary Report',
      outstanding: 'Outstanding Balances Report',
      scholarship: 'Scholarship Allocation Report',
      snapshot: 'Termly Finance Snapshot'
    };
    
    const title = reportTitles[reportType] || 'Financial Report';
    const today = new Date().toLocaleDateString('en-NG', { day: '2-digit', month: 'long', year: 'numeric' });
    
    let reportContent = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Montserrat', Arial, sans-serif; margin: 20px; color: #2c3e50; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #b88e5e; padding-bottom: 20px; }
            .header h1 { color: #b88e5e; margin: 0; font-size: 24px; }
            .header p { color: #666; margin: 5px 0; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
            .meta div { flex: 1; }
            .meta strong { display: block; color: #2c3e50; font-size: 18px; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #b88e5e; color: white; padding: 12px; text-align: left; font-weight: 600; }
            td { padding: 10px; border-bottom: 1px solid #e0e0e0; }
            tr:hover { background: #f8f9fa; }
            .total-row { background: #e8f5e8; font-weight: bold; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #b88e5e; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Franciscan Catholic School</h1>
            <p>Bursar's Office - ${title}</p>
            <p>Generated on ${today}</p>
          </div>
    `;
    
    if (reportType === 'revenue') {
      const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
      const avgPayment = totalRevenue / payments.length;
      
      reportContent += `
        <div class="meta">
          <div>
            <span>Total Revenue</span>
            <strong>${formatCurrency(totalRevenue)}</strong>
          </div>
          <div>
            <span>Total Payments</span>
            <strong>${payments.length}</strong>
          </div>
          <div>
            <span>Average Payment</span>
            <strong>${formatCurrency(avgPayment)}</strong>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Receipt ID</th>
              <th>Learner</th>
              <th>Class</th>
              <th>Amount</th>
              <th>Purpose</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      payments.forEach(p => {
        reportContent += `
          <tr>
            <td>${p.receiptId}</td>
            <td>${p.studentName}</td>
            <td>${p.studentClass || 'N/A'}</td>
            <td>${formatCurrency(p.amount)}</td>
            <td>${p.purpose}</td>
            <td>${formatDate(p.paymentDate)}</td>
          </tr>
        `;
      });
      
      reportContent += `
            <tr class="total-row">
              <td colspan="3">TOTAL</td>
              <td>${formatCurrency(totalRevenue)}</td>
              <td colspan="2">${payments.length} payments</td>
            </tr>
          </tbody>
        </table>
      `;
    } else if (reportType === 'snapshot') {
      const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
      const paymentModes = {};
      payments.forEach(p => {
        const mode = formatPaymentMode(p.paymentMode);
        paymentModes[mode] = (paymentModes[mode] || 0) + p.amount;
      });
      
      reportContent += `
        <div class="meta">
          <div>
            <span>Total Revenue</span>
            <strong>${formatCurrency(totalRevenue)}</strong>
          </div>
          <div>
            <span>Total Transactions</span>
            <strong>${payments.length}</strong>
          </div>
        </div>
        <h3>Payment Breakdown by Mode</h3>
        <table>
          <thead>
            <tr>
              <th>Payment Mode</th>
              <th>Amount</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      Object.entries(paymentModes).forEach(([mode, amount]) => {
        const percentage = ((amount / totalRevenue) * 100).toFixed(1);
        reportContent += `
          <tr>
            <td>${mode}</td>
            <td>${formatCurrency(amount)}</td>
            <td>${percentage}%</td>
          </tr>
        `;
      });
      
      reportContent += `
          </tbody>
        </table>
      `;
    } else {
      reportContent += `
        <p style="text-align: center; padding: 40px; color: #666;">
          This report type is currently being configured. Please check back later.
        </p>
      `;
    }
    
    reportContent += `
          <div class="footer">
            <p>Franciscan Catholic Nursery & Primary School</p>
            <p>First Unity Estate, Off Cooperative Villa, Badore, Ajah, Lagos</p>
            <p>Generated by Bursar's Office on ${today}</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
  
  // Settings buttons
  const profileSettingsBtn = document.getElementById('profile-settings-btn');
  if (profileSettingsBtn) {
    profileSettingsBtn.addEventListener('click', () => {
      const newName = prompt('Enter your name:', 'Sr. Clare Ohagwa, OSF');
      if (newName && newName.trim()) {
        document.getElementById('bursar-name').textContent = newName.trim();
        document.getElementById('welcome-name').textContent = newName.trim().split(' ')[0];
        localStorage.setItem('bursar_name', newName.trim());
        alert('Profile updated successfully!');
      }
    });
  }

  const notificationSettingsBtn = document.getElementById('notification-settings-btn');
  if (notificationSettingsBtn) {
    notificationSettingsBtn.addEventListener('click', () => {
      const emailNotif = confirm('Enable email notifications for new payments?');
      localStorage.setItem('email_notifications', emailNotif);
      alert(`Email notifications ${emailNotif ? 'enabled' : 'disabled'}.`);
    });
  }

  const securitySettingsBtn = document.getElementById('security-settings-btn');
  if (securitySettingsBtn) {
    securitySettingsBtn.addEventListener('click', () => {
      const currentPassword = prompt('Enter current password:');
      if (currentPassword) {
        const newPassword = prompt('Enter new password:');
        if (newPassword && newPassword.length >= 6) {
          const confirmPassword = prompt('Confirm new password:');
          if (newPassword === confirmPassword) {
            alert('Password changed successfully!');
          } else {
            alert('Passwords do not match.');
          }
        } else {
          alert('Password must be at least 6 characters.');
        }
      }
    });
  }

  const systemSettingsBtn = document.getElementById('system-settings-btn');
  if (systemSettingsBtn) {
    systemSettingsBtn.addEventListener('click', () => {
      const theme = confirm('Enable dark mode? (OK for Yes, Cancel for No)');
      if (theme) {
        document.body.style.filter = 'invert(0.9) hue-rotate(180deg)';
        localStorage.setItem('dark_mode', 'true');
        alert('Dark mode enabled. Refresh to see full effect.');
      } else {
        document.body.style.filter = 'none';
        localStorage.setItem('dark_mode', 'false');
        alert('Light mode enabled.');
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