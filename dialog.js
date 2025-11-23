class Dialog {
    constructor() {
        this.overlay = document.getElementById('dialog-overlay');
        this.title = document.getElementById('dialog-title');
        this.content = document.getElementById('dialog-content');
        this.confirmBtn = document.getElementById('dialog-confirm');
        this.cancelBtn = document.getElementById('dialog-cancel');
        this.closeBtn = document.getElementById('dialog-close');
        
        // Bind methods
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.confirm = this.confirm.bind(this);
        
        // Set up event listeners
        this.confirmBtn.addEventListener('click', () => {
            if (this.resolve) {
                this.resolve(true);
                this.hide();
            }
        });
        
        this.cancelBtn.addEventListener('click', () => {
            if (this.reject) {
                this.reject(false);
                this.hide();
            }
        });
        
        this.closeBtn.addEventListener('click', this.hide);
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });
        
        // Hide by default
        this.hide();
    }
    
    show({ 
        title = 'Alert', 
        message = '', 
        confirmText = 'OK', 
        showCancel = false,
        cancelText = 'Cancel',
        html = false 
    } = {}) {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            
            this.title.textContent = title;
            
            if (html) {
                this.content.innerHTML = message;
            } else {
                this.content.textContent = message;
            }
            
            this.confirmBtn.textContent = confirmText;
            this.cancelBtn.textContent = cancelText;
            this.cancelBtn.style.display = showCancel ? 'inline-flex' : 'none';
            
            // Show the dialog
            document.body.style.overflow = 'hidden';
            this.overlay.classList.add('visible');
            this.confirmBtn.focus();
        });
    }
    
    hide() {
        document.body.style.overflow = '';
        this.overlay.classList.remove('visible');
        
        if (this.reject) {
            this.reject(false);
            this.reject = null;
            this.resolve = null;
        }
    }
    
    // Helper methods for common dialog types
    alert(message, title = 'Alert') {
        return this.show({ title, message });
    }
    
    confirm(message, title = 'Confirm') {
        return this.show({ 
            title, 
            message, 
            showCancel: true,
            confirmText: 'Confirm',
            cancelText: 'Cancel'
        });
    }
    
    error(message, title = 'Error') {
        return this.show({ 
            title, 
            message,
            confirmText: 'OK'
        });
    }
    
    html(html, title = '') {
        return this.show({
            title,
            message: html,
            html: true
        });
    }
}

// Create and export a singleton instance
const dialog = new Dialog();

export default dialog;
