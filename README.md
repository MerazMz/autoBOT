# Meraj's AI Assistant WhatsApp Bot

A WhatsApp chatbot with multiple personality modes and a web dashboard for control.

## Features

- Multiple response modes:
  - Rude Mode
  - GenZ Mode
  - Savage Mode
  - Lazy Mode
  - Typo Mode
  - Emoji Mode
  - ASCII Mode
- Web dashboard for control
- Hinglish support
- Group message filtering

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```
4. Start the bot:
   ```bash
   npm start
   ```
5. Scan the QR code with WhatsApp to login

## Deployment on Railway

1. Create a Railway account at https://railway.app
2. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```
3. Login to Railway:
   ```bash
   railway login
   ```
4. Initialize your project:
   ```bash
   railway init
   ```
5. Add your environment variables in Railway dashboard
6. Deploy:
   ```bash
   railway up
   ```

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key
- `PORT`: Port for the web dashboard (default: 3000)

## Dashboard

Access the dashboard at `http://localhost:3000` (local) or your Railway URL (deployed)

## License

MIT 