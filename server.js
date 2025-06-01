const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Store chatbot state
let chatbotState = {
    isActive: true,
    currentMode: 'rude',
    modes: {
        rude: {
            name: 'Rude Mode',
            description: 'Rude and disrespectful responses'
        },
        professional: {
            name: 'Professional Mode',
            description: 'Professional and helpful responses'
        },
        friendly: {
            name: 'Friendly Mode',
            description: 'Friendly and casual responses'
        }
    }
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/state', (req, res) => {
    res.json(chatbotState);
});

app.post('/api/toggle', (req, res) => {
    chatbotState.isActive = !chatbotState.isActive;
    res.json({ isActive: chatbotState.isActive });
});

app.post('/api/mode', (req, res) => {
    const { mode } = req.body;
    if (chatbotState.modes[mode]) {
        chatbotState.currentMode = mode;
        res.json({ currentMode: mode });
    } else {
        res.status(400).json({ error: 'Invalid mode' });
    }
});

app.listen(port, () => {
    console.log(`Dashboard server running at http://localhost:${port}`);
}); 