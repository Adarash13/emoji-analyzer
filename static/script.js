// Emoji Analyzer Application
class EmojiAnalyzer {
    constructor() {
        console.log("🎬 Initializing EmojiAnalyzer...");
        this.initializeElements();
        this.bindEvents();
        this.sampleTexts = [
            "I'm absolutely thrilled! Just received the best news of my life! 😄🎉 My team won the championship and I got the MVP award! This is beyond amazing! 🏆✨ #blessed",
            "Having a really tough day today... 😔💔 Miss my family so much and everything feels overwhelming. The rain outside just makes it worse. ☔️ Just want to crawl into bed and sleep forever.",
            "I can't believe this happened! Absolutely furious right now! 😡🤬 The package was supposed to arrive yesterday, now they say it's lost! And customer service is useless! 💢 This is unacceptable!",
            "What a rollercoaster of emotions today! 😅 Got amazing feedback at work 🎯 but then my car broke down 🚗💨, then my friends surprised me with dinner! 🍽️❤️ So many feelings at once! 🎭"
        ];
        
        console.log("✅ EmojiAnalyzer initialized successfully!");
    }

    initializeElements() {
        console.log("🔧 Initializing DOM elements...");
        
        this.textInput = document.getElementById('textInput');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.historyBtn = document.getElementById('historyBtn');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        
        console.log("📋 Elements found:", {
            textInput: !!this.textInput,
            analyzeBtn: !!this.analyzeBtn,
            clearBtn: !!this.clearBtn,
            historyBtn: !!this.historyBtn,
            resultsContainer: !!this.resultsContainer,
            loadingSpinner: !!this.loadingSpinner
        });
    }

    bindEvents() {
        console.log("🔗 Binding event listeners...");
        
        // Analyze button
        if (this.analyzeBtn) {
            console.log("✅ Analyze button found, adding click listener");
            this.analyzeBtn.addEventListener('click', (e) => {
                console.log("🎯 Analyze button clicked!");
                e.preventDefault();
                this.analyzeText();
            });
        } else {
            console.error("❌ Analyze button NOT found!");
        }
        
        // Clear button
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearText();
            });
        }
        
        // History button
        if (this.historyBtn) {
            this.historyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/history';
            });
        }
        
        // Text input auto-resize
        if (this.textInput) {
            this.textInput.addEventListener('input', () => {
                this.textInput.style.height = 'auto';
                this.textInput.style.height = (this.textInput.scrollHeight) + 'px';
            });
            
            // Auto-focus
            this.textInput.focus();
        }
        
        // Add Enter key support (Ctrl+Enter)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                console.log("⌨️ Ctrl+Enter pressed, analyzing...");
                this.analyzeText();
            }
        });
    }

    showLoading(show) {
        console.log(`🔄 Loading: ${show}`);
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = show ? 'flex' : 'none';
        }
        
        if (this.analyzeBtn) {
            this.analyzeBtn.disabled = show;
            if (show) {
                this.analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
            } else {
                this.analyzeBtn.innerHTML = '<i class="fas fa-brain"></i> Analyze Emotions';
            }
        }
    }

    async analyzeText() {
        console.log("🔍 Starting analysis...");
        
        if (!this.textInput) {
            console.error("❌ Text input not found!");
            this.showError("Text input element not found");
            return;
        }
        
        const text = this.textInput.value.trim();
        console.log("📝 Text to analyze:", text.substring(0, 50) + "...");
        
        if (!text) {
            console.warn("⚠️ No text entered");
            this.showNotification("Please enter some text to analyze!", "warning");
            this.textInput.focus();
            return;
        }
        
        if (text.length < 3) {
            console.warn("⚠️ Text too short");
            this.showNotification("Please enter more text (at least 3 characters)", "warning");
            return;
        }
        
        // Show loading
        this.showLoading(true);
        
        try {
            console.log("🌐 Sending request to /analyze endpoint...");
            
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });
            
            console.log("📥 Response received, status:", response.status);
            
            const data = await response.json();
            console.log("📊 Response data:", data);
            
            if (!response.ok) {
                throw new Error(data.error || data.message || `Server error: ${response.status}`);
            }
            
            if (!data.success) {
                throw new Error(data.message || 'Analysis failed');
            }
            
            console.log("✅ Analysis successful!");
            this.displayResults(data);
            
        } catch (error) {
            console.error("❌ Analysis error:", error);
            this.showError(error.message || 'Failed to analyze text. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(data) {
        console.log("🎨 Displaying results...");
        
        if (!this.resultsContainer) {
            console.error("❌ Results container not found!");
            return;
        }
        
        const emotionScores = data.emotion_scores || {};
        const topEmotion = data.top_emotion || { label: 'neutral', confidence: 0 };
        
        // Create simple results display
        let resultsHTML = `
            <div class="results-container fade-in">
                <div class="top-emotion-card" style="
                    background: linear-gradient(135deg, ${this.getEmotionColor(topEmotion.label)}20, ${this.getEmotionColor(topEmotion.label)}10);
                    padding: 1.5rem;
                    border-radius: 15px;
                    margin-bottom: 2rem;
                    border-left: 5px solid ${this.getEmotionColor(topEmotion.label)};
                ">
                    <div style="display: flex; align-items: center; gap: 1.5rem;">
                        <div style="font-size: 3rem;">${this.getEmotionEmoji(topEmotion.label)}</div>
                        <div>
                            <h2 style="margin: 0; color: var(--primary);">
                                ${topEmotion.label.charAt(0).toUpperCase() + topEmotion.label.slice(1)}
                            </h2>
                            <div style="margin-top: 0.5rem;">
                                <span style="background: white; color: var(--primary); padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">
                                    ${(topEmotion.confidence * 100).toFixed(1)}% Confidence
                                </span>
                                ${data.history_id ? `<span style="margin-left: 0.5rem; background: rgba(255,255,255,0.2); color: var(--gray-dark); padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem;">
                                    📝 #${data.history_id}
                                </span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="background: white; padding: 1.5rem; border-radius: 15px; box-shadow: 0 2px 15px rgba(0,0,0,0.05); margin-bottom: 1.5rem;">
                    <h3 style="margin: 0 0 1rem 0; color: var(--primary);">
                        <i class="fas fa-chart-bar"></i> Emotion Breakdown
                    </h3>
        `;
        
        // Add emotion bars
        Object.entries(emotionScores)
            .sort(([, a], [, b]) => b - a)
            .forEach(([emotion, score]) => {
                const percentage = (score * 100).toFixed(1);
                const color = this.getEmotionColor(emotion);
                
                resultsHTML += `
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; padding: 0.5rem; border-radius: 8px; transition: background 0.2s;" 
                         onmouseover="this.style.background='var(--gray-light)'" 
                         onmouseout="this.style.background='transparent'">
                        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 100px;">
                            <span style="font-size: 1.2rem;">${this.getEmotionEmoji(emotion)}</span>
                            <span style="font-weight: 500;">${emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
                            ${emotion === topEmotion.label ? '<span style="background: var(--primary); color: white; font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 10px; margin-left: 0.5rem;">🎯 Top</span>' : ''}
                        </div>
                        <div style="flex: 1; height: 10px; background: #e0e0e0; border-radius: 5px; overflow: hidden;">
                            <div style="height: 100%; width: ${percentage}%; background-color: ${color}; transition: width 0.8s ease;"></div>
                        </div>
                        <div style="min-width: 50px; text-align: right; font-weight: 600; color: var(--primary);">
                            ${percentage}%
                        </div>
                    </div>
                `;
            });
        
        resultsHTML += `
                </div>
                
                <!-- Original Text -->
                <div style="background: white; padding: 1.5rem; border-radius: 15px; box-shadow: 0 2px 15px rgba(0,0,0,0.05);">
                    <h3 style="margin: 0 0 1rem 0; color: var(--primary);">
                        <i class="fas fa-file-alt"></i> Original Text
                    </h3>
                    <div style="background: var(--gray-light); padding: 1.5rem; border-radius: 10px; line-height: 1.6; color: var(--gray-dark);">
                        ${this.escapeHtml(data.text)}
                    </div>
                    <div style="display: flex; gap: 1.5rem; margin-top: 1rem; font-size: 0.9rem; color: var(--gray);">
                        <span><i class="fas fa-font"></i> ${data.text.length} characters</span>
                        <span><i class="fas fa-icons"></i> ${data.emojis_found?.length || 0} emojis</span>
                        <span><i class="fas fa-clock"></i> ${new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button class="btn btn-secondary" onclick="emojiAnalyzer.analyzeText()">
                        <i class="fas fa-redo"></i> Re-analyze
                    </button>
                    <button class="btn btn-secondary" onclick="emojiAnalyzer.clearText()">
                        <i class="fas fa-eraser"></i> Clear & Start Over
                    </button>
                    <a href="/history" class="btn btn-secondary">
                        <i class="fas fa-history"></i> View History
                    </a>
                </div>
            </div>
        `;
        
        this.resultsContainer.innerHTML = resultsHTML;
        
        // Scroll to results
        setTimeout(() => {
            this.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        console.log("✅ Results displayed successfully!");
    }

    showError(message) {
        console.error("❌ Showing error:", message);
        
        if (!this.resultsContainer) return;
        
        this.resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: linear-gradient(135deg, #fee, #fdd); border-radius: 15px; animation: fadeIn 0.5s ease;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">😞</div>
                <h3 style="color: #dc3545; margin-bottom: 1rem;">Analysis Error</h3>
                <p style="color: #666; margin-bottom: 2rem;">${message}</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-primary" onclick="emojiAnalyzer.analyzeText()">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                    <button class="btn btn-secondary" onclick="emojiAnalyzer.clearText()">
                        <i class="fas fa-eraser"></i> Clear Text
                    </button>
                </div>
            </div>
        `;
    }

    showNotification(message, type = 'info') {
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#6366f1'
        };
        
        const color = colors[type] || colors.info;
        
        // Remove existing notification
        const existing = document.querySelector('.quick-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'quick-notification';
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                ${this.getNotificationIcon(type)}
                <span>${message}</span>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-weight: 500;
            max-width: 300px;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': '💡'
        };
        return icons[type] || '💡';
    }

    clearText() {
        if (this.textInput) {
            this.textInput.value = '';
            this.textInput.style.height = 'auto';
            this.showEmptyState();
            this.showNotification('Text cleared!', 'info');
        }
    }

    showEmptyState() {
        if (!this.resultsContainer) return;
        
        this.resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--gray);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">😊</div>
                <h3>Ready to Analyze!</h3>
                <p>Enter some text and click "Analyze Emotions" to see the results here.</p>
            </div>
        `;
    }

    getEmotionColor(emotion) {
        const colors = {
            'joy': '#FFD700',
            'sadness': '#4169E1',
            'anger': '#FF4500',
            'fear': '#8A2BE2',
            'surprise': '#FF69B4',
            'love': '#FF1493',
            'neutral': '#808080'
        };
        return colors[emotion] || '#808080';
    }

    getEmotionEmoji(emotion) {
        const emojis = {
            'joy': '😄',
            'sadness': '😢',
            'anger': '😡',
            'fear': '😨',
            'surprise': '😲',
            'love': '❤️',
            'neutral': '😐'
        };
        return emojis[emotion] || '😐';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("📄 DOM fully loaded, initializing EmojiAnalyzer...");
    window.emojiAnalyzer = new EmojiAnalyzer();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease;
        }
        
        .loading {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 2rem;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .loading .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid var(--gray-light);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    console.log("✅ EmojiAnalyzer initialized and ready!");
});

// Global function for quick emoji insertion
function insertEmoji(emoji) {
    if (window.emojiAnalyzer) {
        // Create a simple function to insert emoji
        const textInput = document.getElementById('textInput');
        if (textInput) {
            const start = textInput.selectionStart;
            const end = textInput.selectionEnd;
            const text = textInput.value;
            
            textInput.value = text.substring(0, start) + emoji + text.substring(end);
            textInput.focus();
            textInput.selectionStart = textInput.selectionEnd = start + emoji.length;
        }
    }
}

// Global function for sample loading
function loadSample(index) {
    if (window.emojiAnalyzer && window.emojiAnalyzer.sampleTexts) {
        const textInput = document.getElementById('textInput');
        if (textInput && index >= 0 && index < window.emojiAnalyzer.sampleTexts.length) {
            textInput.value = window.emojiAnalyzer.sampleTexts[index];
            textInput.style.height = 'auto';
            textInput.style.height = (textInput.scrollHeight) + 'px';
            
            // Auto-analyze after a short delay
            setTimeout(() => {
                if (window.emojiAnalyzer.analyzeText) {
                    window.emojiAnalyzer.analyzeText();
                }
            }, 500);
        }
    }
}