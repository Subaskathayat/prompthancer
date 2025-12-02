// Social Media Post Generator Module
class SocialMediaPostGenerator {
    constructor(apiKey) {
        this.API_URL = 'https://openrouter.ai/api/v1/chat/completions';
        
        // Initialize DOM elements
        this.postIdeaInput = document.getElementById('post-idea');
        this.generatePostBtn = document.getElementById('generate-post-btn');
        this.outputContent = document.getElementById('output-content');
        this.copyBtn = document.getElementById('copy-post-btn');
        this.saveBtn = document.getElementById('save-post-btn');
        this.apiKeyInput = document.getElementById('social-api-key');
        
        // Initialize chip groups
        this.platformChips = {
            container: document.querySelector('.platform-chips'),
            input: document.getElementById('platform'),
            currentValue: 'twitter' // Default value
        };
        
        this.formalityChips = {
            container: document.querySelector('.formality-chips'),
            input: document.getElementById('formality'),
            currentValue: 'auto' // Default value
        };
        
        this.toneChips = {
            container: document.querySelector('.tone-chips'),
            input: document.getElementById('tone'),
            currentValue: 'auto' // Default value
        };
        
        // Initialize state flags
        this.isGenerating = false;
        this.isCopying = false;
        this.isSaving = false;
        
        // Initialize event listeners
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Platform chips
        this.setupChipGroup(this.platformChips);
        this.setupChipGroup(this.formalityChips);
        this.setupChipGroup(this.toneChips);
        
        // Handle generate post button click
        if (this.generatePostBtn) {
            this.generatePostBtn.addEventListener('click', () => this.generatePost());
        }
        
        // Handle copy button click
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
        
        // Handle save button click
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => this.savePost());
        }
        
        // Handle Enter key in post idea input
        if (this.postIdeaInput) {
            this.postIdeaInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    this.generatePost();
                }
            });
        }
    }

    setupChipGroup(chipGroup) {
        if (!chipGroup.container) return;
        
        // Set initial active state
        const initialChip = chipGroup.container.querySelector(`[data-value="${chipGroup.input.value}"]`);
        if (initialChip) {
            initialChip.classList.add('active');
            chipGroup.currentValue = chipGroup.input.value;
        }
        
        // Add click handlers to all chips
        const chips = chipGroup.container.querySelectorAll('.chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const value = chip.dataset.value;
                if (value === chipGroup.currentValue) return;
                
                // Update active state with animation
                chipGroup.container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                
                // Update current value and input
                chipGroup.currentValue = value;
                chipGroup.input.value = value;
            });
        });
    }

    animateChipSelection(chip) {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.className = 'chip-ripple';
        chip.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Add scale animation
        chip.style.transform = 'scale(0.95)';
        setTimeout(() => {
            chip.style.transform = '';
        }, 200);
    }

    async generateSocialMediaPost(idea, platform, formality, tone, apiKey) {
        const systemPrompt = `You are a professional social media content creator. Generate an engaging, platform-optimized social media post based on the following details and 0 emojis:
- Platform: ${platform}
- Tone: ${tone}
- Formality: ${formality}

Make sure the post is engaging, on-brand, and optimized for the specified platform. and no emoji at starting of the content, and contains only one emoji at the last of content, and then the hastags with one line break and maximum 2 hashtags `;

        const messages = [
            { role: 'system', content: systemPrompt },
            { 
                role: 'user', 
                content: `Generate a ${tone} social media post for ${platform} with ${formality} formality based on this idea: ${idea}`
            }
        ];

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
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
            throw new Error(error.error?.message || 'Failed to generate post');
        }

        const data = await response.json();
        return data.choices[0]?.message?.content?.trim() || '';
    }

    async generatePost() {
        const postIdea = this.postIdeaInput?.value.trim();
        const apiKey = this.apiKeyInput?.value.trim();
        
        // Validate required fields
        if (!postIdea) {
            this.showError('Please enter your post idea');
            this.postIdeaInput.focus();
            return;
        }

        if (!apiKey) {
            this.showError('Please enter your API key');
            this.apiKeyInput.focus();
            return;
        }

        // Show loading state
        this.isGenerating = true;
        this.updateButtonStates();
        
        if (this.outputContent) {
            this.outputContent.textContent = 'Generating your post...';
            this.outputContent.classList.remove('error');
        }

        try {
            const platform = this.platformChips.currentValue;
            const formality = this.formalityChips.currentValue;
            const tone = this.toneChips.currentValue;
            
            const post = await this.generateSocialMediaPost(postIdea, platform, formality, tone, apiKey);
            
            // Set the generated post
            if (this.outputContent) {
                this.outputContent.textContent = post;
                this.outputContent.classList.remove('error');
            }
            
        } catch (error) {
            console.error('Error generating post:', error);
            this.showError(`Error: ${error.message || 'Failed to generate post'}`);
        } finally {
            this.isGenerating = false;
            this.updateButtonStates();
        }
    }

    showError(message) {
        this.outputContent.textContent = message;
        this.outputContent.classList.add('error');
    }

    updateButtonStates() {
        // Update generate button
        if (this.generatePostBtn) {
            this.generatePostBtn.disabled = this.isGenerating;
            this.generatePostBtn.textContent = this.isGenerating ? 'Generating...' : 'Generate Post';
        }
        
        // Update copy button
        if (this.copyBtn) {
            this.copyBtn.disabled = this.isGenerating || !this.outputContent.textContent.trim();
        }
        
        // Update save button
        if (this.saveBtn) {
            this.saveBtn.disabled = this.isGenerating || !this.outputContent.textContent.trim();
        }
    }

    copyToClipboard() {
        if (this.isCopying || !this.outputContent.textContent.trim()) return;
        
        this.isCopying = true;
        navigator.clipboard.writeText(this.outputContent.textContent)
            .then(() => {
                const originalText = this.copyBtn.textContent;
                this.copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    this.copyBtn.textContent = originalText;
                    this.isCopying = false;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                this.isCopying = false;
            });
    }

    savePost() {
        if (this.isSaving || !this.outputContent.textContent.trim()) return;
        
        // In a real app, you would save this to a database or local storage
        // For now, we'll just show a message
        this.isSaving = true;
        const originalText = this.saveBtn.textContent;
        this.saveBtn.textContent = 'Saved!';
        setTimeout(() => {
            this.saveBtn.textContent = originalText;
            this.isSaving = false;
        }, 2000);
    }
}

// Initialize the social media post generator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the social media post generator page
    if (document.getElementById('generate-post-btn')) {
        // Initialize the social media post generator
        const socialMediaGenerator = new SocialMediaPostGenerator();
    }
});