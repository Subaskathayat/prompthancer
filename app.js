// Import modules
import './prompt_enhance.js';
import './socialMediaPostGenerator.js';
import dialog from './dialog.js';

// Make dialog available globally for easy access
window.dialog = dialog;

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navItems = document.querySelectorAll('.nav-menu li');
    const panels = document.querySelectorAll('.panel');
    const generatePostBtn = document.getElementById('generate-post-btn');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const apiKeyInputs = document.querySelectorAll('input[type="password"]');
    const modelSelect = document.getElementById('model');
    
    // Disable model selection as requested
    if (modelSelect) {
        modelSelect.disabled = true;
    }

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all panels
            panels.forEach(panel => {
                panel.style.display = 'none';
            });
            
            // Show the selected panel
            const page = this.getAttribute('data-page');
            if (page === 'prompt-enhancer' || page === 'social-media') {
                document.getElementById(page).style.display = 'block';
                document.querySelector('.right-panel').style.display = 'block';
            } else {
                // For history and saved pages, show empty state
                const centerPanel = document.querySelector('.center-panel');
                centerPanel.style.display = 'flex';
                centerPanel.style.alignItems = 'center';
                centerPanel.style.justifyContent = 'center';
                centerPanel.style.height = '100%';
                document.querySelector('.right-panel').style.display = 'block';
                
                const isHistory = page === 'history';
                centerPanel.innerHTML = `
                    <div class="empty-state">
                        <img src="icons/history.svg" alt="${isHistory ? 'History' : 'Saved Items'}" class="empty-state-icon">
                        <p class="empty-state-text">${isHistory ? 'No history found' : 'No saved items yet'}</p>
                    </div>
                `;
            }
        });
    });

    // Toggle password visibility
    togglePasswordBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const input = apiKeyInputs[index];
            const icon = this.querySelector('img');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.src = 'icons/Hide.svg';
            } else {
                input.type = 'password';
                icon.src = 'icons/View.svg';
            }
        });
    });

    // Social media post generation is now handled by socialMediaPostGenerator.js
});