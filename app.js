// Import modules
import './prompt_enhance.js';
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
                // For history and saved pages, we'll implement this later
                document.querySelector('.center-panel').style.display = 'block';
                document.querySelector('.right-panel').style.display = 'block';
                const outputContent = document.getElementById('output-content');
                if (outputContent) {
                    outputContent.innerHTML = `<p class="placeholder-text">${
                        page === 'history' ? 'Your history will appear here...' : 'Your saved items will appear here...'
                    }</p>`;
                }
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

    // Generate social media post
    if (generatePostBtn) {
        generatePostBtn.addEventListener('click', generatePost);
    }
    
    // Function to generate social media post
    async function generatePost() {
        const postIdea = document.getElementById('post-idea')?.value.trim();
        const outputContent = document.getElementById('output-content');
        
        if (!postIdea) {
            await dialog.alert('Please enter your post idea', 'Missing Information');
            return;
        }
        
        try {
            // In a real app, you would make an API call here
            // For now, we'll just show a placeholder
            if (outputContent) {
                outputContent.innerHTML = 'Social media post generation will be implemented here.';
                outputContent.contentEditable = 'true';
                outputContent.focus();
            }
        } catch (error) {
            console.error('Error generating post:', error);
            await dialog.error('Failed to generate post. Please try again.', 'Error');
        }
    }
});