// Photo Upload Functionality
document.addEventListener('DOMContentLoaded', function() {
    const photoUpload = document.getElementById('photoUpload');
    const selectedFiles = document.getElementById('selectedFiles');
    const fileList = document.getElementById('fileList');
    const startUpload = document.getElementById('startUpload');
    const cancelUpload = document.getElementById('cancelUpload');
    const uploadStatus = document.getElementById('uploadStatus');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    let selectedPhotos = [];

    // Handle file selection
    photoUpload.addEventListener('change', function(e) {
        selectedPhotos = Array.from(e.target.files);
        
        if (selectedPhotos.length > 0) {
            displaySelectedFiles();
            selectedFiles.style.display = 'block';
        }
    });

    // Display selected files
    function displaySelectedFiles() {
        fileList.innerHTML = '';
        
        selectedPhotos.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            // Create image preview
            const reader = new FileReader();
            reader.onload = function(e) {
                fileItem.innerHTML = `
                    <div class="file-preview">
                        <img src="${e.target.result}" alt="Preview" class="preview-image">
                        <div class="file-info">
                            <span class="file-name">${file.name}</span>
                            <span class="file-size">${formatFileSize(file.size)}</span>
                            <button class="remove-file" onclick="removeFile(${index})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
            
            fileList.appendChild(fileItem);
        });
    }

    // Remove file from selection
    window.removeFile = function(index) {
        selectedPhotos.splice(index, 1);
        
        if (selectedPhotos.length === 0) {
            selectedFiles.style.display = 'none';
            photoUpload.value = '';
        } else {
            displaySelectedFiles();
        }
    };

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Start upload process
    startUpload.addEventListener('click', function() {
        if (selectedPhotos.length === 0) {
            alert('Please select photos to upload.');
            return;
        }

        // Show upload progress
        selectedFiles.style.display = 'none';
        uploadStatus.style.display = 'block';
        
        // Simulate upload process (replace with actual upload logic)
        simulateUpload();
    });

    // Cancel upload
    cancelUpload.addEventListener('click', function() {
        selectedPhotos = [];
        selectedFiles.style.display = 'none';
        photoUpload.value = '';
    });

    // Simulate upload process
    function simulateUpload() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Show success message
                progressText.textContent = 'Upload Complete!';
                progressFill.style.width = '100%';
                
                setTimeout(() => {
                    uploadStatus.style.display = 'none';
                    showSuccessMessage();
                    resetUploadForm();
                }, 1500);
            } else {
                progressFill.style.width = progress + '%';
                progressText.textContent = `Uploading... ${Math.round(progress)}%`;
            }
        }, 200);
    }

    // Show success message
    function showSuccessMessage() {
        const successModal = document.createElement('div');
        successModal.className = 'upload-success-modal';
        successModal.innerHTML = `
            <div class="success-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Photos Uploaded Successfully!</h3>
                <p>Thank you for sharing your memories with our school community. Your photos will be reviewed and added to our gallery soon.</p>
                <button class="success-btn" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-check"></i> OK
                </button>
            </div>
        `;
        
        document.body.appendChild(successModal);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (successModal.parentElement) {
                successModal.remove();
            }
        }, 5000);
    }

    // Reset upload form
    function resetUploadForm() {
        selectedPhotos = [];
        photoUpload.value = '';
        progressFill.style.width = '0%';
        progressText.textContent = 'Uploading...';
    }

    // Drag and drop functionality
    const submitPhotosSection = document.querySelector('.submit-photos-section');
    
    submitPhotosSection.addEventListener('dragover', function(e) {
        e.preventDefault();
        submitPhotosSection.classList.add('drag-over');
    });

    submitPhotosSection.addEventListener('dragleave', function(e) {
        e.preventDefault();
        submitPhotosSection.classList.remove('drag-over');
    });

    submitPhotosSection.addEventListener('drop', function(e) {
        e.preventDefault();
        submitPhotosSection.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type.startsWith('image/')
        );
        
        if (files.length > 0) {
            selectedPhotos = files;
            displaySelectedFiles();
            selectedFiles.style.display = 'block';
        }
    });
});

// Add required CSS styles
const uploadStyles = `
<style>
.upload-status {
    margin-top: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}

.progress-bar {
    width: 100%;
    height: 20px;
    background: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(45deg, #8B4513, #D4AF37);
    width: 0%;
    transition: width 0.3s ease;
}

.progress-text {
    font-weight: 500;
    color: #8B4513;
}

.selected-files {
    margin-top: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}

.selected-files h3 {
    margin: 0 0 15px 0;
    color: #8B4513;
}

.file-item {
    margin-bottom: 15px;
}

.file-preview {
    display: flex;
    align-items: center;
    background: white;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
}

.preview-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 15px;
}

.file-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.file-name {
    font-weight: 500;
    margin-bottom: 5px;
}

.file-size {
    color: #666;
    font-size: 14px;
}

.remove-file {
    background: #dc3545;
    color: white;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
}

.remove-file:hover {
    background: #c82333;
}

.upload-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.upload-btn, .cancel-btn {
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
}

.upload-btn {
    background: #28a745;
    color: white;
}

.upload-btn:hover {
    background: #218838;
}

.cancel-btn {
    background: #6c757d;
    color: white;
}

.cancel-btn:hover {
    background: #5a6268;
}

.upload-success-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.success-content {
    background: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    max-width: 400px;
    margin: 20px;
}

.success-icon {
    font-size: 60px;
    color: #28a745;
    margin-bottom: 20px;
}

.success-content h3 {
    color: #8B4513;
    margin: 0 0 15px 0;
}

.success-content p {
    margin: 0 0 20px 0;
    line-height: 1.5;
}

.success-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 500;
}

.success-btn:hover {
    background: #218838;
}

.submit-photos-section.drag-over {
    background: rgba(212, 175, 55, 0.1);
    border: 2px dashed #D4AF37;
}

@media (max-width: 768px) {
    .file-preview {
        flex-direction: column;
        text-align: center;
    }
    
    .preview-image {
        margin: 0 0 10px 0;
    }
    
    .upload-actions {
        flex-direction: column;
    }
}
</style>
`;

// Inject styles into the page
document.head.insertAdjacentHTML('beforeend', uploadStyles);
