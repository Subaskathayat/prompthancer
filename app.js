document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navItems = document.querySelectorAll('.nav-menu li');
    const panels = document.querySelectorAll('.panel');
    const promptInput = document.getElementById('prompt-input');
    const enhanceBtn = document.getElementById('enhance-btn');
    const generatePostBtn = document.getElementById('generate-post-btn');
    const copyBtn = document.getElementById('copy-btn');
    const saveBtn = document.getElementById('save-btn');
    const reEnhanceBtn = document.getElementById('re-enhance-btn');
    const outputContent = document.getElementById('output-content');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const apiKeyInputs = document.querySelectorAll('input[type="password"]');

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
                outputContent.innerHTML = `<p class="placeholder-text">${page === 'history' ? 'Your history will appear here...' : 'Your saved items will appear here...'}</p>`;
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
                icon.src = 'icons/Hide.svg'; // You'll need to add this icon
            } else {
                input.type = 'password';
                icon.src = 'icons/View.svg';
            }
        });
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', function() {
        const textToCopy = outputContent.innerText;
        if (textToCopy && !outputContent.querySelector('.placeholder-text')) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show feedback
                const originalText = this.innerHTML;
                this.innerHTML = '<img src="icons/check_icon.svg" alt="Copied!">';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            });
        }
    });

    // Save prompt
    saveBtn.addEventListener('click', function() {
        const enhancedPrompt = outputContent.innerText;
        if (enhancedPrompt && !outputContent.querySelector('.placeholder-text')) {
            // In a real app, you would save this to a database
            // For now, we'll just show a message
            const originalText = this.innerHTML;
            this.innerHTML = '<img src="icons/check_icon.svg" alt="Saved!">';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
            
            // Add to saved items in localStorage
            const savedItems = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
            savedItems.push({
                id: Date.now(),
                prompt: enhancedPrompt,
                date: new Date().toISOString()
            });
            localStorage.setItem('savedPrompts', JSON.stringify(savedItems));
        }
    });

    // Re-enhance prompt
    reEnhanceBtn.addEventListener('click', function() {
        const enhancedPrompt = outputContent.innerText;
        if (enhancedPrompt && !outputContent.querySelector('.placeholder-text')) {
            promptInput.value = enhancedPrompt;
            // Optionally, automatically trigger enhancement
            // enhancePrompt();
        }
    });

    // Enhance prompt
    enhanceBtn.addEventListener('click', enhancePrompt);
    
    // Generate social media post
    generatePostBtn.addEventListener('click', generatePost);

    // Handle Enter key in textareas
    promptInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            enhancePrompt();
        }
    });

    // Function to enhance prompt
    function enhancePrompt() {
        const prompt = promptInput.value.trim();
        const length = document.getElementById('length').value;
        const model = document.getElementById('model').value;
        const apiKey = document.getElementById('api-key').value;
        
        if (!prompt) {
            alert('Please enter a prompt to enhance');
            return;
        }
        
        if (!apiKey) {
            alert('Please enter your API key');
            return;
        }
        
        // Show loading state
        const originalText = enhanceBtn.innerHTML;
        enhanceBtn.disabled = true;
        enhanceBtn.innerHTML = '<span>Enhancing...</span><div class="spinner"></div>';
        
        // In a real app, you would make an API call here
        // For now, we'll simulate a delay and return a mock response
        setTimeout(() => {
            const mockEnhancedPrompt = `[Enhanced with ${model} - ${length} length]\n\n${prompt}\n\nAdditional context: This is an enhanced version of your prompt that includes more detail, clarity, and structure to get better results from the AI model.`;
            
            outputContent.innerHTML = mockEnhancedPrompt.replace(/\n/g, '<br>');
            
            // Reset button
            enhanceBtn.disabled = false;
            enhanceBtn.innerHTML = originalText;
            
            // Save to history
            const history = JSON.parse(localStorage.getItem('promptHistory') || '[]');
            history.unshift({
                id: Date.now(),
                original: prompt,
                enhanced: mockEnhancedPrompt,
                model,
                length,
                date: new Date().toISOString()
            });
            localStorage.setItem('promptHistory', JSON.stringify(history));
            
        }, 1500);
    }
    
    // Function to generate social media post
    function generatePost() {
        const postIdea = document.getElementById('post-idea').value.trim();
        const contentType = document.getElementById('content-type').value;
        const formality = document.getElementById('formality').value;
        const tone = document.getElementById('tone').value;
        const apiKey = document.getElementById('social-api-key').value;
        
        if (!postIdea) {
            alert('Please enter your post idea');
            return;
        }
        
        if (!apiKey) {
            alert('Please enter your API key');
            return;
        }
        
        // Show loading state
        const originalText = generatePostBtn.innerHTML;
        generatePostBtn.disabled = true;
        generatePostBtn.innerHTML = '<span>Generating...</span><div class="spinner"></div>';
        
        // In a real app, you would make an API call here
        // For now, we'll simulate a delay and return a mock response
        setTimeout(() => {
            const mockPost = `[${contentType.charAt(0).toUpperCase() + contentType.slice(1)} ${formality !== 'auto' ? `- ${formality} ` : ''}${tone !== 'auto' ? `- ${tone}` : ''}]\n\n${postIdea}\n\nHere's a well-crafted social media post that will engage your audience and encourage interaction. Don't forget to add relevant hashtags and a call-to-action!`;
            
            outputContent.innerHTML = mockPost.replace(/\n/g, '<br>');
            
            // Reset button
            generatePostBtn.disabled = false;
            generatePostBtn.innerHTML = originalText;
            
        }, 1500);
    }
    
    // Initialize the page
    function init() {
        // Show the first panel by default
        document.querySelector('.nav-menu li').click();
    }
    
    init();
});
