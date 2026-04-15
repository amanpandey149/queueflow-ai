document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const inputField = document.getElementById('assistant-input');
    const sendBtn = document.getElementById('send-btn');

    // Predefined AI knowledge with variations
    const knowledge = {
        fastest: [
            "Based on live data, Gate 2 is the fastest with only a 5-minute wait.",
            "I recommend Gate 2! It has the shortest queue right now (5 mins).",
            "Head over to Gate 2 for the quickest entry. Wait time is just 5 minutes."
        ],
        leastCrowd: [
            "Gate 2 has the least crowd at the moment.",
            "You'll find the smallest crowd at Gate 2.",
            "Gate 2 is nearly free! I suggest heading there."
        ],
        waitTimes: [
            "Here are the current wait times: Gate 1 (15m), Gate 2 (5m), Gate 3 (10m).",
            "Live update: Gate 1 is 15 mins, Gate 2 is 5 mins, and Gate 3 is 10 mins.",
            "Gate 1: High (15m). Gate 2: Low (5m). Gate 3: Medium (10m)."
        ],
        gate1: [
            "Gate 1 is currently experiencing high traffic (15 min wait).",
            "Avoid Gate 1 if you're in a hurry; it's quite crowded right now."
        ],
        gate3: [
            "Gate 3 has moderate traffic. Wait time is around 10 minutes.",
            "You'll wait about 10 minutes at Gate 3."
        ],
        default: [
            "I'm an AI assistant. I can help you find the best gate, check wait times, or locate the least crowded areas.",
            "How can I help you today? Ask me about gate wait times or the fastest entry point."
        ]
    };

    function getRandomReply(category) {
        const replies = knowledge[category] || knowledge.default;
        return replies[Math.floor(Math.random() * replies.length)];
    }

    // Function to add a chat message
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        
        if (text === 'typing') {
            msgDiv.classList.add('typing-indicator');
            // Adding 3 spans for the 3 bouncing dots
            msgDiv.innerHTML = '<span></span><span></span><span></span>';
            msgDiv.id = 'typing-indicator';
        } else {
            msgDiv.textContent = text;
        }

        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Function to process user input and generate a predefined reply
    function processInput(question) {
        if (!question.trim()) return;

        // Add user message
        addMessage(question, 'user');
        inputField.value = '';

        // Show thinking animation
        addMessage('typing', 'system');

        // Simulate AI thinking time (1.5s - 2s)
        const thinkTime = Math.floor(Math.random() * 500) + 1500;

        setTimeout(() => {
            removeTypingIndicator();
            const lowerQ = question.toLowerCase();
            let replyCategory = 'default';
            
            if (lowerQ.includes('wait time') || lowerQ.includes('all gate') || lowerQ.includes('status')) {
                replyCategory = 'waitTimes';
            } else if (lowerQ.includes('fastest') || lowerQ.includes('quick') || lowerQ.includes('best') || lowerQ.includes('fast')) {
                replyCategory = 'fastest';
            } else if (lowerQ.includes('less crowd') || lowerQ.includes('least crowd') || lowerQ.includes('empty')) {
                replyCategory = 'leastCrowd';
            } else if (lowerQ.includes('gate 1')) {
                replyCategory = 'gate1';
            } else if (lowerQ.includes('gate 3')) {
                replyCategory = 'gate3';
            } else if (lowerQ.includes('gate 2')) {
                replyCategory = 'leastCrowd';
            }

            addMessage(getRandomReply(replyCategory), 'system');
        }, thinkTime);
    }

    // Export function to global scope so pill buttons can call it
    window.askQuestion = function(text) {
        processInput(text);
    };

    // Event listeners
    sendBtn.addEventListener('click', () => {
        processInput(inputField.value);
    });

    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processInput(inputField.value);
        }
    });

    // Replace the default welcome message if needed (currently hardcoded in HTML)

    // --- Dynamic Data Simulation Logic ---
    const simulateBtn = document.getElementById('simulate-btn');

    if (simulateBtn) {
        simulateBtn.addEventListener('click', () => {
            if (simulateBtn.disabled) return;
            
            simulateBtn.disabled = true;
            simulateBtn.style.opacity = '0.7';
            simulateBtn.style.cursor = 'wait';
            simulateBtn.textContent = 'Updating crowd data...';

            setTimeout(() => {
                updateDashboardData();
                simulateBtn.style.opacity = '1';
                simulateBtn.style.cursor = 'pointer';
                simulateBtn.textContent = '⏳ Simulate Crowd Update';
                simulateBtn.disabled = false;
                
                // Update time
                const now = new Date();
                const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                document.getElementById('last-updated').textContent = `Last Updated: ${timeString}`;
            }, 1000); // 1 second smooth mock delay
        });
    }

    function updateDashboardData() {
        const gates = [
            { id: 1, elementId: 'gate-1', wait: getRandomInt(5, 20) },
            { id: 2, elementId: 'gate-2', wait: getRandomInt(3, 15) },
            { id: 3, elementId: 'gate-3', wait: getRandomInt(5, 18) }
        ];

        let bestGate = gates[0];
        
        gates.forEach(gate => {
            if (gate.wait < bestGate.wait) bestGate = gate;
            updateGateCard(gate);
        });

        // Add highlight back to the mathematically best option
        document.getElementById(`gate-${bestGate.id}`).classList.add('optimal');

        // Recommended gate text update
        document.getElementById('recommended-gate-text').textContent = `🚀 Recommended Gate: Gate ${bestGate.id}`;
        
        // Save up to X logic: (highest wait - lowest wait)
        const maxWait = Math.max(...gates.map(g => g.wait));
        const saved = maxWait - bestGate.wait;
        document.getElementById('recommended-subtext').textContent = `Save up to ${saved} minutes`;

        // Update system status based on high wait
        const statusEl = document.getElementById('system-status');
        if (maxWait > 12) {
            statusEl.innerHTML = '🟡 Busy';
        } else {
            statusEl.innerHTML = '🟢 Live';
        }

        updateAlerts(gates);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function updateGateCard(gate) {
        const card = document.getElementById(gate.elementId);
        const waitEl = card.querySelector('.wait-time');
        const labelEl = card.querySelector('.wait-label');
        const dotEl = card.querySelector('.status-indicator');

        // Apply smooth transition opacity trick
        waitEl.style.opacity = '0';
        
        setTimeout(() => {
            waitEl.textContent = `${gate.wait} min`;

            waitEl.classList.remove('wait-low', 'wait-medium', 'wait-high');
            dotEl.classList.remove('status-low', 'status-medium', 'status-high');
            card.classList.remove('optimal');

            let status = '';
            let statusName = '';

            if (gate.wait < 7) {
                status = 'low'; statusName = 'Low';
            } else if (gate.wait <= 12) {
                status = 'medium'; statusName = 'Medium';
            } else {
                status = 'high'; statusName = 'High';
            }

            labelEl.textContent = `Wait Time (${statusName})`;
            waitEl.classList.add(`wait-${status}`);
            dotEl.classList.add(`status-${status}`);
            
            waitEl.style.transition = 'opacity 0.3s ease';
            waitEl.style.opacity = '1';
        }, 150);
    }

    function updateAlerts(gates) {
        const container = document.getElementById('alerts-container');
        container.style.opacity = '0';
        
        setTimeout(() => {
            container.innerHTML = ''; 

            gates.forEach(gate => {
                const item = document.createElement('div');
                item.classList.add('alert-item');
                
                const dot = document.createElement('span');
                dot.classList.add('alert-dot');
                
                let text = '';
                if(gate.wait < 7) {
                    dot.classList.add('green');
                    text = `Gate ${gate.id} is almost free`;
                } else if (gate.wait <= 12) {
                    dot.classList.add('yellow');
                    text = `Gate ${gate.id} has moderate traffic`;
                } else {
                    dot.classList.add('red');
                    text = `Gate ${gate.id} is crowded`;
                }

                const p = document.createElement('p');
                p.textContent = text;
                
                item.appendChild(dot);
                item.appendChild(p);
                container.appendChild(item);
            });
            
            container.style.transition = 'opacity 0.3s ease';
            container.style.opacity = '1';
        }, 150);
    }
});
