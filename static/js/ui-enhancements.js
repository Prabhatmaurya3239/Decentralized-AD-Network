/* ============================================================
   AdChain Web3 UI Enhancements & Micro-interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive File Dropzone Visual Enhancement
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    const parentForm = input.closest('form');
    const dropzone = input.closest('.dropzone-box');
    
    if (dropzone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('border-cyan');
          dropzone.style.borderColor = 'var(--accent-cyan)';
          dropzone.style.background = 'rgba(0, 240, 255, 0.08)';
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.style.borderColor = '';
          dropzone.style.background = '';
        }, false);
      });

      dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
          input.files = files;
          updateFileName(input, dropzone);
        }
      });

      input.addEventListener('change', () => {
        updateFileName(input, dropzone);
      });
    }
  });

  function updateFileName(input, container) {
    const nameDisplay = container.querySelector('.file-name-display');
    if (nameDisplay && input.files.length > 0) {
      nameDisplay.textContent = `Selected: ${input.files[0].name} (${(input.files[0].size / (1024 * 1024)).toFixed(2)} MB)`;
      nameDisplay.classList.remove('d-none');
    }
  }

  // 2. Click to Copy Helper with Toast Feedback
  window.showToast = function(message, type = 'info') {
    let toastContainer = document.getElementById('adchainToastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'adchainToastContainer';
      toastContainer.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: rgba(13, 18, 31, 0.95);
      backdrop-filter: blur(16px);
      border: 1px solid ${type === 'success' ? 'rgba(16, 185, 129, 0.5)' : type === 'danger' ? 'rgba(244, 63, 94, 0.5)' : 'rgba(0, 240, 255, 0.5)'};
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 240, 255, 0.2)'};
      color: #fff;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: auto;
    `;

    const iconHtml = type === 'success' 
      ? '<i class="bi bi-check-circle-fill text-success"></i>' 
      : type === 'danger'
      ? '<i class="bi bi-exclamation-triangle-fill text-danger"></i>'
      : '<i class="bi bi-info-circle-fill text-info"></i>';

    toast.innerHTML = `${iconHtml} <span>${message}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(10px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // Copy wallet address click handler
  document.querySelectorAll('.copy-wallet-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const textToCopy = this.getAttribute('data-copy-text');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          window.showToast('Wallet address copied to clipboard!', 'success');
        });
      }
    });
  });
});
