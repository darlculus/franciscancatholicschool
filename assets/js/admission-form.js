// Admission Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Add print button functionality
    const printButton = document.createElement('button');
    printButton.innerHTML = '<i class="fas fa-print"></i> Print Form';
    printButton.className = 'print-btn';
    printButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2c5aa0;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    document.body.appendChild(printButton);
    
    // Hide print button when printing
    window.addEventListener('beforeprint', function() {
        printButton.style.display = 'none';
    });
    
    window.addEventListener('afterprint', function() {
        printButton.style.display = 'block';
    });
    
    // Add download as PDF functionality (requires browser's print to PDF)
    const downloadButton = document.createElement('button');
    downloadButton.innerHTML = '<i class="fas fa-download"></i> Save as PDF';
    downloadButton.className = 'download-btn';
    downloadButton.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        background: #28a745;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    
    downloadButton.addEventListener('click', function() {
        // This will open the print dialog where users can choose "Save as PDF"
        window.print();
    });
    
    document.body.appendChild(downloadButton);
    
    // Hide download button when printing
    window.addEventListener('beforeprint', function() {
        downloadButton.style.display = 'none';
    });
    
    window.addEventListener('afterprint', function() {
        downloadButton.style.display = 'block';
    });
});