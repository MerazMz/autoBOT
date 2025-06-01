document.addEventListener('DOMContentLoaded', () => {
    const botToggle = document.getElementById('botToggle');
    const statusText = document.getElementById('statusText');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const modeDescription = document.getElementById('modeDescription');
    const messageCount = document.getElementById('messageCount');
    const activeTime = document.getElementById('activeTime');

    let startTime = new Date();
    let messageCounter = 0;

    // Update active time
    setInterval(() => {
        const now = new Date();
        const diff = now - startTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        activeTime.textContent = `${hours}h ${minutes}m`;
    }, 60000);

    // Fetch initial state
    fetchState();

    // Toggle bot status
    botToggle.addEventListener('change', async () => {
        try {
            const response = await fetch('/api/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            updateStatus(data.isActive);
        } catch (error) {
            console.error('Error toggling bot:', error);
        }
    });

    // Mode selection
    modeButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const mode = button.dataset.mode;
            try {
                const response = await fetch('/api/mode', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ mode })
                });
                const data = await response.json();
                if (data.currentMode) {
                    updateMode(mode);
                }
            } catch (error) {
                console.error('Error changing mode:', error);
            }
        });
    });

    // Fetch current state
    async function fetchState() {
        try {
            const response = await fetch('/api/state');
            const state = await response.json();
            updateStatus(state.isActive);
            updateMode(state.currentMode);
        } catch (error) {
            console.error('Error fetching state:', error);
        }
    }

    // Update status display
    function updateStatus(isActive) {
        botToggle.checked = isActive;
        statusText.textContent = isActive ? 'Active' : 'Inactive';
        statusText.style.color = isActive ? '#2196F3' : '#666';
    }

    // Update mode display
    function updateMode(mode) {
        modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        const modeInfo = {
            rude: 'Rude and disrespectful responses',
            genz: 'Responds like a GenZ with modern slang',
            savage: 'Responds with savage comebacks and roasts',
            lazy: 'Responds with minimal effort and lazy typing',
            typo: 'Intentionally makes typing mistakes',
            emoji: 'Uses lots of emojis in responses',
            ascii: 'Uses ASCII art in responses'
        };

        modeDescription.textContent = modeInfo[mode] || '';
    }

    // Simulate message count updates (replace with real data in production)
    setInterval(() => {
        messageCounter += Math.floor(Math.random() * 3);
        messageCount.textContent = messageCounter;
    }, 5000);
}); 