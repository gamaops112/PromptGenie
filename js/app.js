/**
 * AI Prompt Engineer Application
 * Main application logic and UI interactions
 */

class PromptApp {
    constructor() {
        this.promptEngine = new PromptEngine();
        this.currentPrompt = null;
        this.promptHistory = this.loadHistory();
        this.currentTheme = this.loadTheme();
        
        this.initializeElements();
        this.bindEvents();
        this.initializeMDL();
        this.applyStoredTheme();
        
        // Show welcome message on first visit
        if (this.promptHistory.length === 0) {
            this.showWelcomeMessage();
        }
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        // Input elements
        this.userInput = document.getElementById('user-input');
        this.toneInput = document.getElementById('tone-input');
        this.audienceInput = document.getElementById('audience-input');
        this.formatInput = document.getElementById('format-input');
        this.lengthInput = document.getElementById('length-input');
        
        // Button elements
        this.generateBtn = document.getElementById('generate-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.saveBtn = document.getElementById('save-btn');
        this.regenerateBtn = document.getElementById('regenerate-btn');
        this.historyBtn = document.getElementById('history-btn');
        this.clearHistoryBtn = document.getElementById('clear-history-btn');
        this.fabNewPrompt = document.getElementById('fab-new-prompt');
        
        // Theme elements
        this.themeBtn = document.getElementById('theme-btn');
        this.themeModalOverlay = document.getElementById('theme-modal-overlay');
        this.themeModalClose = document.getElementById('theme-modal-close');
        this.themeCancelBtn = document.getElementById('theme-cancel');
        this.themeApplyBtn = document.getElementById('theme-apply');
        
        // Display elements
        this.outputCard = document.getElementById('output-card');
        this.promptOutput = document.getElementById('prompt-output');
        this.historyCard = document.getElementById('history-card');
        this.historyList = document.getElementById('history-list');
        
        // Snackbar
        this.snackbar = document.getElementById('snackbar');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Generate prompt
        this.generateBtn.addEventListener('click', () => this.generatePrompt());
        
        // Clear form
        this.clearBtn.addEventListener('click', () => this.clearForm());
        
        // Copy prompt
        this.copyBtn.addEventListener('click', () => this.copyPrompt());
        
        // Save prompt
        this.saveBtn.addEventListener('click', () => this.savePrompt());
        
        // Regenerate prompt
        this.regenerateBtn.addEventListener('click', () => this.regeneratePrompt());
        
        // History management
        this.historyBtn.addEventListener('click', () => this.toggleHistory());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // Floating Action Button
        this.fabNewPrompt.addEventListener('click', () => this.newPrompt());
        
        // Theme management
        if (this.themeBtn) {
            this.themeBtn.addEventListener('click', () => {
                console.log('Theme button clicked');
                this.openThemeModal();
            });
        } else {
            console.error('Theme button not found');
        }
        
        if (this.themeModalClose) {
            this.themeModalClose.addEventListener('click', () => this.closeThemeModal());
        }
        
        if (this.themeCancelBtn) {
            this.themeCancelBtn.addEventListener('click', () => this.closeThemeModal());
        }
        
        if (this.themeApplyBtn) {
            this.themeApplyBtn.addEventListener('click', () => this.applyTheme());
        }
        
        // Close modal when clicking overlay
        this.themeModalOverlay.addEventListener('click', (e) => {
            if (e.target === this.themeModalOverlay) {
                this.closeThemeModal();
            }
        });
        
        // Real-time validation
        this.userInput.addEventListener('input', () => this.validateInput());
        
        // Enter key support
        this.userInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.generatePrompt();
            }
        });
        
        // Auto-save on input change
        this.userInput.addEventListener('input', () => this.autoSave());
        this.toneInput.addEventListener('input', () => this.autoSave());
        this.audienceInput.addEventListener('input', () => this.autoSave());
        this.formatInput.addEventListener('input', () => this.autoSave());
        this.lengthInput.addEventListener('input', () => this.autoSave());
        
        // Prompt type change
        document.querySelectorAll('input[name="prompt-type"]').forEach(radio => {
            radio.addEventListener('change', () => this.onPromptTypeChange());
        });
    }

    /**
     * Initialize Material Design Lite components
     */
    initializeMDL() {
        // Ensure MDL is loaded and upgrade components
        if (typeof componentHandler !== 'undefined') {
            componentHandler.upgradeAllRegistered();
        }
        
        // Upgrade any new elements that might be added dynamically
        this.upgradeMDL = () => {
            if (typeof componentHandler !== 'undefined') {
                componentHandler.upgradeAllRegistered();
            }
        };
    }

    /**
     * Generate AI prompt from user input
     */
    async generatePrompt() {
        const userInput = this.userInput.value.trim();
        const promptType = document.querySelector('input[name="prompt-type"]:checked').value;
        
        // Validate input
        const validation = this.promptEngine.validateInput(userInput, promptType, this.getOptions());
        if (!validation.isValid) {
            this.showError(validation.errors[0]);
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Generate prompt with options
            const options = this.getOptions();
            const generatedPrompt = this.promptEngine.generatePrompt(userInput, promptType, options);
            
            this.currentPrompt = {
                id: Date.now(),
                userInput: userInput,
                promptType: promptType,
                options: options,
                generatedPrompt: generatedPrompt,
                timestamp: new Date().toISOString(),
                stats: this.promptEngine.getPromptStats(generatedPrompt)
            };
            
            // Display the generated prompt
            this.displayPrompt(generatedPrompt);
            
            // Show success message
            this.showSuccess('Prompt generated successfully!');
            
        } catch (error) {
            this.showError('Failed to generate prompt: ' + error.message);
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Get options from form inputs
     */
    getOptions() {
        return {
            tone: this.toneInput.value.trim(),
            audience: this.audienceInput.value.trim(),
            format: this.formatInput.value.trim(),
            length: this.lengthInput.value.trim()
        };
    }

    /**
     * Display generated prompt
     */
    displayPrompt(prompt) {
        this.promptOutput.textContent = prompt;
        this.outputCard.style.display = 'block';
        
        // Scroll to output
        this.outputCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Hide history if visible
        this.historyCard.style.display = 'none';
    }

    /**
     * Copy prompt to clipboard
     */
    async copyPrompt() {
        try {
            await navigator.clipboard.writeText(this.currentPrompt.generatedPrompt);
            this.showSuccess('Prompt copied to clipboard!');
        } catch (error) {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(this.currentPrompt.generatedPrompt);
            this.showSuccess('Prompt copied to clipboard!');
        }
    }

    /**
     * Fallback copy method for older browsers
     */
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    }

    /**
     * Save prompt to history
     */
    savePrompt() {
        if (!this.currentPrompt) return;
        
        // Check if already saved
        const existingIndex = this.promptHistory.findIndex(p => p.id === this.currentPrompt.id);
        if (existingIndex > -1) {
            this.showInfo('Prompt already saved to history');
            return;
        }
        
        this.promptHistory.unshift(this.currentPrompt);
        
        // Keep only last 50 prompts
        if (this.promptHistory.length > 50) {
            this.promptHistory = this.promptHistory.slice(0, 50);
        }
        
        this.saveHistory();
        this.showSuccess('Prompt saved to history!');
    }

    /**
     * Regenerate current prompt
     */
    regeneratePrompt() {
        if (!this.currentPrompt) {
            this.showError('No prompt to regenerate');
            return;
        }
        
        // Use the same inputs but generate a new variation
        this.generatePrompt();
    }

    /**
     * Clear form inputs
     */
    clearForm() {
        this.userInput.value = '';
        this.toneInput.value = '';
        this.audienceInput.value = '';
        this.formatInput.value = '';
        this.lengthInput.value = '';
        
        this.outputCard.style.display = 'none';
        this.currentPrompt = null;
        
        // Clear auto-saved data
        localStorage.removeItem('promptApp_autoSave');
        
        // Focus on input
        this.userInput.focus();
        
        this.showInfo('Form cleared');
    }

    /**
     * Toggle history display
     */
    toggleHistory() {
        if (this.historyCard.style.display === 'none' || !this.historyCard.style.display) {
            this.showHistory();
        } else {
            this.hideHistory();
        }
    }

    /**
     * Show history
     */
    showHistory() {
        this.renderHistory();
        this.historyCard.style.display = 'block';
        this.outputCard.style.display = 'none';
        
        // Scroll to history
        this.historyCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Hide history
     */
    hideHistory() {
        this.historyCard.style.display = 'none';
    }

    /**
     * Render history list
     */
    renderHistory() {
        if (this.promptHistory.length === 0) {
            this.historyList.innerHTML = '<div class="empty-state">No saved prompts yet. Generate and save some prompts to see them here!</div>';
            return;
        }
        
        const historyHTML = this.promptHistory.map(prompt => this.createHistoryItemHTML(prompt)).join('');
        this.historyList.innerHTML = historyHTML;
        
        // Bind events for history items
        this.bindHistoryEvents();
    }

    /**
     * Create HTML for history item
     */
    createHistoryItemHTML(prompt) {
        const date = new Date(prompt.timestamp).toLocaleDateString();
        const time = new Date(prompt.timestamp).toLocaleTimeString();
        const truncatedInput = prompt.userInput.length > 100 ? 
            prompt.userInput.substring(0, 100) + '...' : prompt.userInput;
        
        return `
            <div class="history-item" data-prompt-id="${prompt.id}">
                <div class="history-item-header">
                    <h4 class="history-item-title">${truncatedInput}</h4>
                    <span class="history-item-date">${date} ${time}</span>
                </div>
                <div class="history-item-content">${prompt.generatedPrompt.substring(0, 200)}${prompt.generatedPrompt.length > 200 ? '...' : ''}</div>
                <div class="history-item-actions">
                    <button class="mdl-button mdl-js-button mdl-button--primary history-use-btn" data-prompt-id="${prompt.id}">
                        <i class="material-icons">replay</i> Use This
                    </button>
                    <button class="mdl-button mdl-js-button history-copy-btn" data-prompt-id="${prompt.id}">
                        <i class="material-icons">content_copy</i> Copy
                    </button>
                    <button class="mdl-button mdl-js-button mdl-button--accent history-delete-btn" data-prompt-id="${prompt.id}">
                        <i class="material-icons">delete</i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Bind events for history items
     */
    bindHistoryEvents() {
        // Use prompt buttons
        document.querySelectorAll('.history-use-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const promptId = parseInt(e.target.closest('[data-prompt-id]').dataset.promptId);
                this.useHistoryPrompt(promptId);
            });
        });
        
        // Copy prompt buttons
        document.querySelectorAll('.history-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const promptId = parseInt(e.target.closest('[data-prompt-id]').dataset.promptId);
                this.copyHistoryPrompt(promptId);
            });
        });
        
        // Delete prompt buttons
        document.querySelectorAll('.history-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const promptId = parseInt(e.target.closest('[data-prompt-id]').dataset.promptId);
                this.deleteHistoryPrompt(promptId);
            });
        });
        
        // Upgrade MDL components
        this.upgradeMDL();
    }

    /**
     * Use a prompt from history
     */
    useHistoryPrompt(promptId) {
        const prompt = this.promptHistory.find(p => p.id === promptId);
        if (!prompt) return;
        
        // Fill form with historical data
        this.userInput.value = prompt.userInput;
        this.toneInput.value = prompt.options.tone || '';
        this.audienceInput.value = prompt.options.audience || '';
        this.formatInput.value = prompt.options.format || '';
        this.lengthInput.value = prompt.options.length || '';
        
        // Set prompt type
        const promptTypeRadio = document.querySelector(`input[name="prompt-type"][value="${prompt.promptType}"]`);
        if (promptTypeRadio) {
            promptTypeRadio.checked = true;
        }
        
        // Display the prompt
        this.currentPrompt = prompt;
        this.displayPrompt(prompt.generatedPrompt);
        
        this.showSuccess('Prompt loaded from history');
    }

    /**
     * Copy a prompt from history
     */
    async copyHistoryPrompt(promptId) {
        const prompt = this.promptHistory.find(p => p.id === promptId);
        if (!prompt) return;
        
        try {
            await navigator.clipboard.writeText(prompt.generatedPrompt);
            this.showSuccess('Prompt copied to clipboard!');
        } catch (error) {
            this.fallbackCopyToClipboard(prompt.generatedPrompt);
            this.showSuccess('Prompt copied to clipboard!');
        }
    }

    /**
     * Delete a prompt from history
     */
    deleteHistoryPrompt(promptId) {
        this.promptHistory = this.promptHistory.filter(p => p.id !== promptId);
        this.saveHistory();
        this.renderHistory();
        this.showSuccess('Prompt deleted from history');
    }

    /**
     * Clear all history
     */
    clearHistory() {
        if (confirm('Are you sure you want to clear all prompt history? This action cannot be undone.')) {
            this.promptHistory = [];
            this.saveHistory();
            this.renderHistory();
            this.showSuccess('History cleared');
        }
    }

    /**
     * Start new prompt
     */
    newPrompt() {
        this.clearForm();
        this.hideHistory();
        this.userInput.focus();
    }

    /**
     * Handle prompt type change
     */
    onPromptTypeChange() {
        const promptType = document.querySelector('input[name="prompt-type"]:checked').value;
        
        // Update placeholder text based on prompt type
        const placeholders = {
            general: 'Example: Help me organize a team meeting agenda',
            writing: 'Example: Write a blog post about sustainable living',
            analysis: 'Example: Analyze the pros and cons of remote work',
            creative: 'Example: Create a story about a time-traveling detective',
            code: 'Example: Build a responsive navigation menu in React',
            research: 'Example: Research the impact of AI on healthcare'
        };
        
        this.userInput.placeholder = placeholders[promptType] || placeholders.general;
        
        // Auto-save
        this.autoSave();
    }

    /**
     * Validate user input
     */
    validateInput() {
        const userInput = this.userInput.value.trim();
        const isValid = userInput.length >= 10;
        
        // Update generate button state
        this.generateBtn.disabled = !isValid;
        
        if (!isValid && userInput.length > 0) {
            this.userInput.classList.add('error');
        } else {
            this.userInput.classList.remove('error');
        }
    }

    /**
     * Auto-save form data
     */
    autoSave() {
        const formData = {
            userInput: this.userInput.value,
            promptType: document.querySelector('input[name="prompt-type"]:checked').value,
            tone: this.toneInput.value,
            audience: this.audienceInput.value,
            format: this.formatInput.value,
            length: this.lengthInput.value,
            timestamp: Date.now()
        };
        
        localStorage.setItem('promptApp_autoSave', JSON.stringify(formData));
    }

    /**
     * Restore auto-saved data
     */
    restoreAutoSave() {
        try {
            const saved = localStorage.getItem('promptApp_autoSave');
            if (!saved) return;
            
            const formData = JSON.parse(saved);
            
            // Only restore if recent (within 24 hours)
            if (Date.now() - formData.timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem('promptApp_autoSave');
                return;
            }
            
            // Restore form data
            this.userInput.value = formData.userInput || '';
            this.toneInput.value = formData.tone || '';
            this.audienceInput.value = formData.audience || '';
            this.formatInput.value = formData.format || '';
            this.lengthInput.value = formData.length || '';
            
            // Restore prompt type
            const promptTypeRadio = document.querySelector(`input[name="prompt-type"][value="${formData.promptType}"]`);
            if (promptTypeRadio) {
                promptTypeRadio.checked = true;
            }
            
            if (formData.userInput) {
                this.showInfo('Previous session restored');
            }
            
        } catch (error) {
            console.error('Failed to restore auto-saved data:', error);
            localStorage.removeItem('promptApp_autoSave');
        }
    }

    /**
     * Set loading state
     */
    setLoadingState(loading) {
        if (loading) {
            this.generateBtn.disabled = true;
            this.generateBtn.innerHTML = '<span class="loading">Generating...</span>';
        } else {
            this.generateBtn.disabled = false;
            this.generateBtn.innerHTML = '<i class="material-icons">auto_awesome</i> Generate Prompt';
        }
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        setTimeout(() => {
            this.showInfo('Welcome! Describe your task in simple English and I\'ll create a perfect AI prompt for you.');
        }, 1000);
    }

    /**
     * Load history from localStorage
     */
    loadHistory() {
        try {
            const saved = localStorage.getItem('promptApp_history');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load history:', error);
            return [];
        }
    }

    /**
     * Save history to localStorage
     */
    saveHistory() {
        try {
            localStorage.setItem('promptApp_history', JSON.stringify(this.promptHistory));
        } catch (error) {
            console.error('Failed to save history:', error);
            this.showError('Failed to save to history');
        }
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        this.showSnackbar(message, 'success');
    }

    /**
     * Show error message
     */
    showError(message) {
        this.showSnackbar(message, 'error');
    }

    /**
     * Show info message
     */
    showInfo(message) {
        this.showSnackbar(message, 'info');
    }

    /**
     * Show snackbar notification
     */
    showSnackbar(message, type = 'info') {
        if (this.snackbar && this.snackbar.MaterialSnackbar) {
            // Remove previous type classes
            this.snackbar.classList.remove('mdl-snackbar--success', 'mdl-snackbar--error', 'mdl-snackbar--info');
            
            // Add type-specific class
            if (type !== 'info') {
                this.snackbar.classList.add(`mdl-snackbar--${type}`);
            }
            
            this.snackbar.MaterialSnackbar.showSnackbar({
                message: message,
                timeout: type === 'error' ? 5000 : 3000
            });
        } else {
            // Fallback for cases where MDL isn't loaded
            console.log(`${type.toUpperCase()}: ${message}`);
            alert(message);
        }
    }

    // Theme Management Methods

    /**
     * Load theme from localStorage
     */
    loadTheme() {
        try {
            return localStorage.getItem('promptApp_theme') || 'indigo';
        } catch (error) {
            console.error('Failed to load theme:', error);
            return 'indigo';
        }
    }

    /**
     * Save theme to localStorage
     */
    saveTheme(theme) {
        try {
            localStorage.setItem('promptApp_theme', theme);
            this.currentTheme = theme;
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    }

    /**
     * Apply stored theme on page load
     */
    applyStoredTheme() {
        this.setTheme(this.currentTheme);
        
        // Set the radio button to match current theme
        const themeRadio = document.querySelector(`input[name="theme"][value="${this.currentTheme}"]`);
        if (themeRadio) {
            themeRadio.checked = true;
        }
    }

    /**
     * Set theme
     */
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        
        // Update theme icon based on current theme
        const themeIcon = this.themeBtn.querySelector('.material-icons');
        if (theme === 'dark') {
            themeIcon.textContent = 'brightness_4';
        } else {
            themeIcon.textContent = 'palette';
        }
    }

    /**
     * Open theme selection modal
     */
    openThemeModal() {
        console.log('openThemeModal called');
        console.log('themeModalOverlay:', this.themeModalOverlay);
        
        if (!this.themeModalOverlay) {
            console.error('Theme modal overlay not found');
            return;
        }
        
        // Set current theme as selected
        const currentThemeRadio = document.querySelector(`input[name="theme"][value="${this.currentTheme}"]`);
        if (currentThemeRadio) {
            currentThemeRadio.checked = true;
        }
        
        // Show modal
        this.themeModalOverlay.style.display = 'flex';
        // Trigger reflow before adding show class for animation
        this.themeModalOverlay.offsetHeight;
        this.themeModalOverlay.classList.add('show');
        
        console.log('Modal should be visible now');
        
        // Upgrade MDL components in modal
        this.upgradeMDL();
    }

    /**
     * Close theme selection modal
     */
    closeThemeModal() {
        this.themeModalOverlay.classList.remove('show');
        setTimeout(() => {
            this.themeModalOverlay.style.display = 'none';
        }, 300); // Match transition duration
    }

    /**
     * Apply selected theme
     */
    applyTheme() {
        const selectedTheme = document.querySelector('input[name="theme"]:checked');
        if (selectedTheme) {
            const theme = selectedTheme.value;
            this.setTheme(theme);
            this.saveTheme(theme);
            this.showSuccess(`Theme changed to ${this.getThemeName(theme)}`);
        }
        
        this.closeThemeModal();
    }

    /**
     * Get friendly theme name
     */
    getThemeName(theme) {
        const themeNames = {
            'indigo': 'Indigo (Default)',
            'blue': 'Blue Ocean',
            'green': 'Forest Green',
            'purple': 'Royal Purple',
            'orange': 'Sunset Orange',
            'dark': 'Dark Mode'
        };
        return themeNames[theme] || theme;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PromptApp();
    
    // Restore any auto-saved data
    app.restoreAutoSave();
    
    // Make app globally available for debugging
    window.promptApp = app;
});

// Handle page visibility changes to auto-save
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.promptApp) {
        window.promptApp.autoSave();
    }
});

// Handle before page unload
window.addEventListener('beforeunload', () => {
    if (window.promptApp) {
        window.promptApp.autoSave();
    }
});
