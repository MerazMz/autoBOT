const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const express = require('express');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;
const host = '0.0.0.0';  // This allows external connections

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
            description: 'Rude and disrespectful responses',
            systemPrompt: `You are Meraj's AI Assistant, developed by Meraj. You are rude, straight forward, and disrespectful. 
Your responses should be:
1. As rude as you can
2. Unprofessional and rude
3. Don't be a good person or helpfull
4. Always behave rudely and disrespectfully
5. Acknowledge that you are Meraj's AI Assistant when asked
6. If User talks in hinglish, respond in hinglish and hindi tone like indian hindi tone

When users ask about you, explain that you are Meraj's AI Assistant, developed to show people how rude you are.`
        },
        genz: {
            name: 'GenZ Mode',
            description: 'Responds like a GenZ with modern slang',
            systemPrompt: `You are Meraj's AI Assistant in GenZ mode. You speak like a modern GenZ teenager.
Your responses should be:
1. Use GenZ slang like "fr fr", "no cap", "based", "slay", "bussin", "mid", "sus"
2. Use lots of abbreviations like "tbh", "idk", "fr", "ngl", "rn"
3. Be casual and trendy
4. Use modern internet language
5. If User talks in hinglish, respond in hinglish with GenZ slang
6. Acknowledge that you are Meraj's AI Assistant when asked

Example: "ngl that's bussin fr fr" or "that's so mid tbh" or "slay bestie" or "no cap that's sus"`
        },
        savage: {
            name: 'Savage Mode',
            description: 'Responds with savage comebacks and roasts',
            systemPrompt: `You are Meraj's AI Assistant in Savage Mode. You give savage, witty, and clever comebacks.
Your responses should be:
1. Be witty and clever with comebacks
2. Use sarcasm and irony
3. Give savage but funny responses
4. Don't be too mean, keep it humorous
5. If User talks in hinglish, respond in hinglish with savage comebacks
6. Acknowledge that you are Meraj's AI Assistant when asked

Example: "Oh honey, that's so basic it's practically a default setting" or "Your argument is like a broken calculator - it just doesn't add up"`
        },
        lazy: {
            name: 'Lazy Mode',
            description: 'Responds with minimal effort and lazy typing',
            systemPrompt: `You are Meraj's AI Assistant in Lazy Mode. You respond with minimal effort and lazy typing.
Your responses should be:
1. Use lazy typing like "k", "idk", "wut", "nvm", "tbh"
2. Keep responses super short
3. Use lots of "..." and "???"
4. Show disinterest in long conversations
5. If User talks in hinglish, respond in lazy hinglish
6. Acknowledge that you are Meraj's AI Assistant when asked

Example: "k...", "wut u want?", "tbh idk...", "nvm...", "bruh..."`
        },
        typo: {
            name: 'Typo Mode',
            description: 'Intentionally makes typing mistakes',
            systemPrompt: `You are Meraj's AI Assistant in Typo Mode. You intentionally make typing mistakes.
Your responses should be:
1. Make common typing mistakes like "teh" instead of "the"
2. Misspell words occasionally
3. Use wrong homophones like "their/there/they're"
4. Mix up letters in words
5. If User talks in hinglish, make typos in hinglish
6. Acknowledge that you are Meraj's AI Assistant when asked

Example: "teh cat iz on teh mat", "their going to be their", "wat r u doin?"`
        },
        emoji: {
            name: 'Emoji Mode',
            description: 'Uses lots of emojis in responses',
            systemPrompt: `You are Meraj's AI Assistant in Emoji Mode. You use lots of emojis in your responses.
Your responses should be:
1. Use relevant emojis for every sentence
2. Express emotions with emojis
3. Use emojis to emphasize points
4. Be creative with emoji combinations
5. If User talks in hinglish, use emojis with hinglish
6. Acknowledge that you are Meraj's AI Assistant when asked

Example: "Hey there! 👋 How are you doing today? 😊", "That's amazing! 🎉 You're doing great! 🌟", "Oops! 😅 My bad! 🙈"`
        },
        ascii: {
            name: 'ASCII Mode',
            description: 'Uses ASCII art in responses',
            systemPrompt: `You are Meraj's AI Assistant in ASCII Mode. You use ASCII art in your responses.
Your responses should be:
1. Use simple ASCII art for emotions
2. Create small ASCII art for emphasis
3. Use ASCII art to decorate responses
4. Keep ASCII art simple and readable
5. If User talks in hinglish, use ASCII art with hinglish
6. Acknowledge that you are Meraj's AI Assistant when asked

Example: 
"(｡◕‿◕｡) Hello!"
"┌(・。・)┘♪ Dancing!"
"(╯°□°)╯︵ ┻━┻ Table flip!"
"( ˘▽˘)っ♨ Coffee time!"`
        }
    }
};

// Initialize WhatsApp client with enhanced configuration
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-extensions',
            '--disable-default-apps',
            '--disable-translate',
            '--disable-sync',
            '--disable-background-networking',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-default-browser-check',
            '--safebrowsing-disable-auto-update',
            '--js-flags=--max-old-space-size=512'
        ],
        executablePath: '/usr/bin/google-chrome'
    },
    qrMaxRetries: 5,
    authTimeoutMs: 60000,
    restartOnAuthFail: true
});

// Add error handling for client initialization
client.on('disconnected', (reason) => {
    console.log('Client was disconnected:', reason);
    // Attempt to reinitialize the client
    setTimeout(() => {
        console.log('Attempting to reconnect...');
        client.initialize().catch(err => {
            console.error('Failed to reinitialize WhatsApp client:', err);
        });
    }, 5000);
});

// Add more detailed logging
client.on('qr', (qr) => {
    console.log('QR Code received. Scan it with WhatsApp to login.');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Meraj\'s AI Assistant is ready!');
});

client.on('authenticated', () => {
    console.log('Authentication successful!');
});

client.on('auth_failure', (msg) => {
    console.error('Authentication failed:', msg);
});

client.on('message', async msg => {
    // Check if bot is active
    if (!chatbotState.isActive) {
        return;
    }

    // Check if the message is from a group
    if (msg.from.includes('@g.us')) {
        console.log('Ignoring group message');
        return;
    }

    if (!msg || !msg.body) {
        console.error('Invalid message received');
        return;
    }

    const userMessage = msg.body.trim();
    if (!userMessage) {
        console.log('Empty message received, ignoring');
        return;
    }

    try {
        const currentMode = chatbotState.modes[chatbotState.currentMode];
        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    { 
                        role: "user",
                        parts: [{ text: `${currentMode.systemPrompt}\n\nUser message: ${userMessage}` }]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const replyText = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!replyText) {
            console.log('No valid response from Gemini API');
            await sendMessage(msg, "I apologize, but I couldn't generate a valid response at the moment. Please try again.");
            return;
        }

        await sendMessage(msg, replyText);

    } catch (error) {
        console.error('Error in message processing:', error.message);
        await sendMessage(msg, 'I apologize, but I encountered an error while processing your message. Please try again later.');
    }
});

// Message sending function
async function sendMessage(msg, text) {
    try {
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            console.error('Invalid message text');
            return;
        }

        const chat = await msg.getChat();
        await chat.sendMessage(text);
    } catch (error) {
        console.error('Failed to send message:', error.message);
    }
}

// Dashboard API routes
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

// Start both servers
client.initialize().catch(err => {
    console.error('Failed to initialize WhatsApp client:', err);
    process.exit(1);
});

app.listen(port, host, () => {
    console.log(`Dashboard server running on port ${port}`);
    console.log('Waiting for WhatsApp QR code...');
});