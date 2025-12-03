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
    const rightPanelHeader = document.getElementById('right-panel-header');
    
    // Map of page names to their corresponding header text
    const headerTextMap = {
        'prompt-enhancer': 'Your Enhanced Prompt',
        'social-media': 'Your Social Media Post',
        'history': 'Your History',
        'saved': 'Your Saved Items'
    };
    
    // Disable model selection as requested
    if (modelSelect) {
        modelSelect.disabled = true;
    }

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-page');
            
            // Update active state
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Show target panel and hide others
            panels.forEach(panel => {
                if (panel.id === target) {
                    // Show the selected center panel
                    panel.style.display = 'flex';
                    
                    // Update right panel header based on the selected section
                    if (rightPanelHeader && headerTextMap[target]) {
                        rightPanelHeader.textContent = headerTextMap[target];
                    }
                } else if (panel.classList.contains('center-panel')) {
                    // Hide other center panels
                    panel.style.display = 'none';
                } else if (panel.classList.contains('right-panel')) {
                    // Keep right panel visible
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'none';
                }
            });
            
            // Ensure right panel is visible
            const rightPanel = document.querySelector('.right-panel');
            if (rightPanel) {
                rightPanel.style.display = 'block';
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
                icon.src = '/assets/icons/Hide.svg';
            } else {
                input.type = 'password';
                icon.src = '/assets/icons/View.svg';
            }
        });
    });

    // Social media post generation is now handled by socialMediaPostGenerator.js
});