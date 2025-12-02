// Prompt Enhancer Module
class PromptEnhancer {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.API_URL = 'https://openrouter.ai/api/v1/chat/completions';
        
        // Initialize DOM elements
        this.promptInput = document.getElementById('prompt-input');
        this.enhanceBtn = document.getElementById('enhance-btn');
        this.outputContent = document.getElementById('output-content');
        this.copyBtn = document.getElementById('copy-btn');
        this.saveBtn = document.getElementById('save-btn');
        this.reEnhanceBtn = document.getElementById('re-enhance-btn');
        this.apiKeyInput = document.getElementById('api-key');
        this.lengthSelect = document.getElementById('length');
        this.inputCharCount = document.getElementById('input-char-count');
        this.outputCharCount = document.getElementById('output-char-count');
        
        // Initialize character counts
        this.apiKey = apiKey;
        
        // Initialize state flags
        this.isCopying = false;
        this.isSaving = false;
        
        // Initialize event listeners
        this.initializeEventListeners();
        
        // Set initial button states
        this.updateButtonStates();
    }

    async enhancePrompt(prompt, length = 'auto') {
        if (!this.apiKey) {
            throw new Error('API key is required');
        }

        if (!prompt) {
            throw new Error('Prompt cannot be empty');
        }

        const lengthInstruction = this.getLengthInstruction(length);
        
        const systemPrompt = `You are an expert prompt engineer. Enhance the following raw text into a professionally engineered ready to use AI prompt. 
Make it clear, structured, powerful, and optimized for high-quality outputs. 
${lengthInstruction}

Important: Only return the enhanced prompt, no additional text like your enhanced prompt; Optimize the AI prompt by, explanations, or markdown formatting.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { 
                role: 'user', 
                content: `Enhance this text into a high-quality AI prompt: ${prompt}`
            }
        ];

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'Promptbrary'
                },
                body: JSON.stringify({
                    model: 'openai/gpt-3.5-turbo',
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Failed to enhance prompt');
            }

            const data = await response.json();
            return data.choices[0]?.message?.content?.trim() || '';
        } catch (error) {
            console.error('Error enhancing prompt:', error);
            throw error;
        }
    }

    getLengthInstruction(length) {
        switch (length) {
            case 'short':
                return 'Keep the enhanced prompt concise, around 180 characters.';
            case 'medium':
                return 'The enhanced prompt should be moderately detailed, around 380-450 characters.';
            case 'long':
                return 'The enhanced prompt should be very detailed and comprehensive, around 600-700 characters.';
            default:
                return 'The length of the enhanced prompt should be appropriate for the input.';
        }
    }
    
    initializeEventListeners() {
        // Handle enhance button click
        if (this.enhanceBtn) {
            this.enhanceBtn.addEventListener('click', () => this.enhancePromptHandler());
        }
        
        // Handle input events for character count
        if (this.promptInput) {
            this.promptInput.addEventListener('input', () => this.updateCharCounts());
            
            // Handle Ctrl+Enter in prompt input
            this.promptInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    this.enhancePromptHandler();
                }
            });
        }
        
        // Handle output content changes
        if (this.outputContent) {
            this.outputContent.addEventListener('input', () => this.updateCharCounts());
        }
        
        // Handle copy button click
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
        
        // Handle save button click
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => this.savePrompt());
        }
        
        // Handle re-enhance button click
        if (this.reEnhanceBtn) {
            this.reEnhanceBtn.addEventListener('click', () => this.reEnhancePrompt());
        }
    }
    
    async enhancePromptHandler() {
        const prompt = this.promptInput.value.trim();
        const length = this.lengthSelect ? this.lengthSelect.value : 'auto';
        const apiKey = this.apiKeyInput ? this.apiKeyInput.value : this.apiKey;
        
        if (!prompt) {
            await dialog.alert('Please enter a prompt to enhance', 'Missing Prompt');
            return;
        }
        
        if (!apiKey) {
            await dialog.alert('Please enter your API key', 'API Key Required');
            return;
        }
        
        // Clear any existing content and show loading state
        this.outputContent.innerHTML = '';
        this.outputContent.contentEditable = 'false';
        
        // Show loading state
        const originalText = this.enhanceBtn.innerHTML;
        this.enhanceBtn.disabled = true;
        this.enhanceBtn.innerHTML = '<span>Enhancing...</span><div class="spinner"></div>';
        
        try {
            this.apiKey = apiKey; // Update API key if it was provided via input
            const enhancedPrompt = await this.enhancePrompt(prompt, length);
            
            // Set the enhanced prompt and make it editable
            this.outputContent.innerHTML = enhancedPrompt.replace(/\n/g, '<br>');
            this.outputContent.contentEditable = 'true';
            this.outputContent.focus();
            
            // Save to history and update character count
            this.saveToHistory(prompt, enhancedPrompt, length);
            this.updateCharCounts();
            
        } catch (error) {
            console.error('Error enhancing prompt:', error);
            await dialog.error(`Error: ${error.message || 'Failed to enhance prompt'}`, 'Error');
        } finally {
            // Reset button
            this.enhanceBtn.disabled = false;
            this.enhanceBtn.innerHTML = originalText;
        }
    }
    
    showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'error' : ''}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Trigger reflow
        void toast.offsetWidth;
        
        // Show toast
        toast.classList.add('show');
        
        // Remove toast after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    async copyToClipboard() {
        // Prevent multiple clicks
        if (this.isCopying) return;
        this.isCopying = true;

        const textToCopy = this.outputContent.innerText;
        if (textToCopy && !this.outputContent.querySelector('.placeholder-text')) {
            try {
                await navigator.clipboard.writeText(textToCopy);
                // Show feedback
                this.copyBtn.classList.add('btn-copied');
                this.showToast('Copied to clipboard!');
                
                // Reset button state after delay
                setTimeout(() => {
                    this.copyBtn.classList.remove('btn-copied');
                    this.isCopying = false;
                }, 2000);
            } catch (error) {
                console.error('Failed to copy text:', error);
                this.showToast('Failed to copy text', true);
                this.isCopying = false;
            }
        } else {
            this.isCopying = false;
        }
    }
    
    async savePrompt() {
        // Prevent multiple clicks
        if (this.isSaving) return;
        this.isSaving = true;

        const enhancedPrompt = this.outputContent.innerText;
        if (enhancedPrompt && !this.outputContent.querySelector('.placeholder-text')) {
            try {
                // Add to saved items in localStorage
                const savedItems = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
                savedItems.push({
                    id: Date.now(),
                    prompt: enhancedPrompt,
                    date: new Date().toISOString()
                });
                localStorage.setItem('savedPrompts', JSON.stringify(savedItems));
                
                // Show feedback
                this.saveBtn.classList.add('btn-saved');
                this.showToast('Prompt saved successfully!');
                
                // Reset button state after delay
                setTimeout(() => {
                    this.saveBtn.classList.remove('btn-saved');
                    this.isSaving = false;
                }, 2000);
            } catch (error) {
                console.error('Failed to save prompt:', error);
                this.showToast('Failed to save prompt', true);
                this.isSaving = false;
            }
        } else {
            this.isSaving = false;
        }
    }
    
    reEnhancePrompt() {
        const enhancedPrompt = this.outputContent.innerText;
        if (enhancedPrompt && !this.outputContent.querySelector('.placeholder-text')) {
            this.promptInput.value = enhancedPrompt;
            this.enhancePromptHandler();
        }
    }
    
    updateButtonStates() {
        const hasContent = this.outputContent && this.outputContent.innerText.trim().length > 0;
        
        if (this.copyBtn) {
            this.copyBtn.disabled = !hasContent;
            this.copyBtn.style.opacity = hasContent ? '1' : '0.5';
            this.copyBtn.style.cursor = hasContent ? 'pointer' : 'not-allowed';
        }
        
        if (this.saveBtn) {
            this.saveBtn.disabled = !hasContent;
            this.saveBtn.style.opacity = hasContent ? '1' : '0.5';
            this.saveBtn.style.cursor = hasContent ? 'pointer' : 'not-allowed';
        }
        
        if (this.reEnhanceBtn) {
            this.reEnhanceBtn.disabled = !hasContent;
            this.reEnhanceBtn.style.opacity = hasContent ? '1' : '0.5';
            this.reEnhanceBtn.style.cursor = hasContent ? 'pointer' : 'not-allowed';
        }
    }
    
    updateCharCounts() {
        // Update input character count
        if (this.promptInput && this.inputCharCount) {
            const count = this.promptInput.value.length;
            this.inputCharCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
            
            // Add a class if over the limit (2000 characters)
            if (count > 2000) {
                this.inputCharCount.classList.add('limit-reached');
            } else {
                this.inputCharCount.classList.remove('limit-reached');
            }
        }
        
        // Update output character count
        if (this.outputContent && this.outputCharCount) {
            // Get text content
            const text = this.outputContent.innerText.trim();
            const count = text.length;
            this.outputCharCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
            
            // Add a class if over the limit (2000 characters)
            if (count > 2000) {
                this.outputCharCount.classList.add('limit-reached');
            } else {
                this.outputCharCount.classList.remove('limit-reached');
            }
            
            // Update button states based on character count
            this.updateButtonStates();
        }
    }
    
    saveToHistory(original, enhanced, length) {
        const history = JSON.parse(localStorage.getItem('promptHistory') || '[]');
        history.unshift({
            id: Date.now(),
            original,
            enhanced,
            model: 'gpt-3.5-turbo',
            length,
            date: new Date().toISOString()
        });
        localStorage.setItem('promptHistory', JSON.stringify(history));
        
        // Update character counts after saving to history
        this.updateCharCounts();
    }
}

// Initialize the prompt enhancer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // You can pass an initial API key here or get it from user input
    const promptEnhancer = new PromptEnhancer('');
    
    // Make it available globally if needed
    window.promptEnhancer = promptEnhancer;
});

export default PromptEnhancer;