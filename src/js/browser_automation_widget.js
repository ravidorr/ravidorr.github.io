/**
 * Browser Automation Widget for ravidorr.github.io
 * 
 * This widget adds an interactive command prompt to your site that allows
 * visitors to control browser automation through natural language commands.
 */

(function() {
    'use strict';

    // Configuration - Update this to point to your server
    const API_ENDPOINT = 'http://localhost:8001/execute-command';
    // For production, change to your deployed server URL, e.g.:
    // const API_ENDPOINT = 'https://your-server.com/execute-command';

    // Widget styles
    const styles = `
        .browser-automation-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 400px;
            max-width: 90vw;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 10000;
            transition: all 0.3s ease;
        }

        .baw-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 12px 12px 0 0;
            cursor: move;
            user-select: none;
        }

        .baw-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .baw-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: background 0.2s;
        }

        .baw-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .baw-content {
            padding: 20px;
        }

        .baw-description {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
        }

        .baw-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .baw-input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e1e8ed;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s;
            font-family: inherit;
            resize: vertical;
            min-height: 60px;
        }

        .baw-input:focus {
            outline: none;
            border-color: #667eea;
        }

        .baw-input::placeholder {
            color: #999;
        }

        .baw-submit {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .baw-submit:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .baw-submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .baw-status {
            margin-top: 15px;
            padding: 12px;
            border-radius: 8px;
            font-size: 14px;
            display: none;
        }

        .baw-status.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .baw-status.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .baw-status.loading {
            background: #cce5ff;
            color: #004085;
            border: 1px solid #b8daff;
            display: block;
        }

        .baw-examples {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e1e8ed;
        }

        .baw-examples-title {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .baw-example {
            font-size: 12px;
            color: #667eea;
            cursor: pointer;
            margin-bottom: 4px;
            transition: color 0.2s;
        }

        .baw-example:hover {
            color: #764ba2;
            text-decoration: underline;
        }

        .baw-spinner {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: baw-spin 0.8s linear infinite;
        }

        @keyframes baw-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .baw-minimized {
            width: auto;
        }

        .baw-minimized .baw-content {
            display: none;
        }

        .baw-toggle {
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: background 0.2s;
        }

        .baw-toggle:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;

    // Widget HTML template
    const widgetHTML = `
        <div class="browser-automation-widget" id="browser-automation-widget">
            <div class="baw-header" id="baw-header">
                <h3 class="baw-title">
                    <span>🤖 Browser Automation</span>
                    <div style="display: flex; gap: 5px;">
                        <button class="baw-toggle" id="baw-toggle" title="Minimize">_</button>
                        <button class="baw-close" id="baw-close" title="Close">×</button>
                    </div>
                </h3>
            </div>
            <div class="baw-content">
                <p class="baw-description">
                    Type a command to control this website. I'll navigate and interact with elements for you!
                </p>
                <form class="baw-form" id="baw-form">
                    <textarea 
                        class="baw-input" 
                        id="baw-input" 
                        placeholder="e.g., 'Go to the Empty State page and click the Main Action button'"
                        rows="3"
                    ></textarea>
                    <button type="submit" class="baw-submit" id="baw-submit">
                        <span id="baw-submit-text">Execute Command</span>
                        <span class="baw-spinner" id="baw-spinner" style="display: none;"></span>
                    </button>
                </form>
                <div class="baw-status" id="baw-status"></div>
                <div class="baw-examples">
                    <div class="baw-examples-title">Example commands:</div>
                    <div class="baw-example" data-command="Navigate to the Dashboard">Navigate to the Dashboard</div>
                    <div class="baw-example" data-command="Go to the Empty State page and click the Main Action button">Go to Empty State and click Main Action</div>
                    <div class="baw-example" data-command="Click on the List View tab">Click on the List View tab</div>
                    <div class="baw-example" data-command="Find and click on Event One">Find and click on Event One</div>
                </div>
            </div>
        </div>
    `;

    // Session management
    let sessionId = localStorage.getItem('baw-session-id') || null;

    // Create and inject styles
    function injectStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    // Create and inject widget
    function createWidget() {
        const widgetContainer = document.createElement('div');
        widgetContainer.innerHTML = widgetHTML;
        document.body.appendChild(widgetContainer.firstElementChild);
    }

    // Make widget draggable
    function makeWidgetDraggable() {
        const widget = document.getElementById('browser-automation-widget');
        const header = document.getElementById('baw-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.classList.contains('baw-close') || e.target.classList.contains('baw-toggle')) {
                return;
            }
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            widget.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }

        function dragEnd() {
            isDragging = false;
        }
    }

    // Execute command
    async function executeCommand(command) {
        const submitButton = document.getElementById('baw-submit');
        const submitText = document.getElementById('baw-submit-text');
        const spinner = document.getElementById('baw-spinner');
        const statusDiv = document.getElementById('baw-status');
        const input = document.getElementById('baw-input');

        // Show loading state
        submitButton.disabled = true;
        submitText.textContent = 'Executing...';
        spinner.style.display = 'inline-block';
        statusDiv.className = 'baw-status loading';
        statusDiv.textContent = 'Processing your command...';
        statusDiv.style.display = 'block';

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: command,
                    session_id: sessionId,
                    base_url: window.location.href
                })
            });

            const data = await response.json();

            if (data.success) {
                // Store session ID for follow-up commands
                sessionId = data.session_id;
                localStorage.setItem('baw-session-id', sessionId);

                // Show success
                statusDiv.className = 'baw-status success';
                statusDiv.innerHTML = `
                    <strong>✅ Success!</strong><br>
                    ${data.message}<br>
                    <small>Completed in ${data.execution_time?.toFixed(2) || '0'}s</small>
                `;
                
                // Clear input for next command
                input.value = '';
            } else {
                throw new Error(data.error || 'Command execution failed');
            }
        } catch (error) {
            // Show error
            statusDiv.className = 'baw-status error';
            statusDiv.innerHTML = `
                <strong>❌ Error</strong><br>
                ${error.message}<br>
                <small>Make sure the automation server is running</small>
            `;
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitText.textContent = 'Execute Command';
            spinner.style.display = 'none';
        }
    }

    // Initialize widget
    function init() {
        injectStyles();
        createWidget();
        makeWidgetDraggable();

        // Event listeners
        const form = document.getElementById('baw-form');
        const closeButton = document.getElementById('baw-close');
        const toggleButton = document.getElementById('baw-toggle');
        const widget = document.getElementById('browser-automation-widget');
        const examples = document.querySelectorAll('.baw-example');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('baw-input');
            const command = input.value.trim();
            if (command) {
                await executeCommand(command);
            }
        });

        closeButton.addEventListener('click', () => {
            widget.remove();
        });

        toggleButton.addEventListener('click', () => {
            widget.classList.toggle('baw-minimized');
            toggleButton.textContent = widget.classList.contains('baw-minimized') ? '□' : '_';
        });

        // Example click handlers
        examples.forEach(example => {
            example.addEventListener('click', () => {
                const input = document.getElementById('baw-input');
                input.value = example.dataset.command;
                input.focus();
            });
        });

        // Show widget
        setTimeout(() => {
            widget.style.opacity = '1';
        }, 100);
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
