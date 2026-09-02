const http = require('http');
const bedrock = require('bedrock-protocol');

const HOST = 'FGDFFE2.aternos.me';
const PORT = 27807;
const USERNAME = 'AFK_Guardian';
const HTTP_PORT = process.env.PORT || 3000;

console.log('====================================================');
console.log('       ATERNOS 24/7 BEDROCK AFK BOT GUARDIAN        ');
console.log('====================================================');
console.log(`Target Server: ${HOST}:${PORT}`);
console.log(`Bot Username:  ${USERNAME}`);
console.log(`HTTP Port:     ${HTTP_PORT}`);
console.log('====================================================\n');

let isConnected = false;
let lastStatus = 'Starting...';

// 1. Web Health Server (Keeps Cloud Hosting Like Render / Koyeb Awake)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Aternos 24/7 AFK Guardian</title>
            <style>
                body { font-family: sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                .card { background: #1e293b; padding: 2rem 3rem; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); text-align: center; border: 1px solid #334155; }
                .badge { display: inline-block; padding: 0.5rem 1rem; border-radius: 9999px; font-weight: bold; background: ${isConnected ? '#10b981' : '#f59e0b'}; color: #fff; margin: 1rem 0; }
                h1 { margin: 0 0 1rem; color: #38bdf8; }
                p { color: #94a3b8; font-size: 1.1rem; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🛡️ Aternos 24/7 AFK Guardian</h1>
                <div class="badge">${isConnected ? '● BOT ONLINE IN SERVER' : '○ RECONNECTING...'}</div>
                <p>Guarding: <b>${HOST}:${PORT}</b></p>
                <p>Status: ${lastStatus}</p>
                <p style="font-size: 0.85rem; color: #64748b;">Pinged at: ${new Date().toLocaleString()}</p>
            </div>
        </body>
        </html>
    `);
});

server.listen(HTTP_PORT, () => {
    console.log(`[HTTP] Cloud Health Server listening on port ${HTTP_PORT}`);
});

// 2. Minecraft Bedrock Bot Connection Loop
function startBot() {
    console.log(`[${new Date().toLocaleTimeString()}] Attempting to connect to ${HOST}:${PORT}...`);
    lastStatus = 'Connecting...';

    let client;
    try {
        client = bedrock.createClient({
            host: HOST,
            port: PORT,
            username: USERNAME,
            offline: true,
            skipPing: false,
            connectTimeout: 20000
        });
    } catch (err) {
        console.error(`[ERROR] Failed to initialize client: ${err.message}`);
        lastStatus = `Error: ${err.message}`;
        reconnect();
        return;
    }

    client.on('join', () => {
        isConnected = true;
        lastStatus = 'Joined and Guarding Server';
        console.log(`\n>>> [ONLINE] ${USERNAME} has joined the server! <<<`);
        console.log(`>>> Server is now guarded and will STAY ONLINE 24/7! <<<\n`);
    });

    client.on('text', (packet) => {
        if (packet.message) {
            console.log(`[CHAT] ${packet.source_name || 'Server'}: ${packet.message}`);
        }
    });

    client.on('kick', (reason) => {
        isConnected = false;
        lastStatus = `Kicked: ${JSON.stringify(reason)}`;
        console.warn(`[KICKED] Bot was kicked from server. Reason: ${JSON.stringify(reason)}`);
        reconnect();
    });

    client.on('close', () => {
        if (isConnected) {
            isConnected = false;
            lastStatus = 'Connection closed';
            console.warn(`[DISCONNECT] Connection lost.`);
        }
        reconnect();
    });

    client.on('error', (err) => {
        isConnected = false;
        lastStatus = `Network Error: ${err.message}`;
        console.error(`[NETWORK ERROR] ${err.message}`);
        reconnect();
    });
}

let reconnecting = false;
function reconnect() {
    if (reconnecting) return;
    reconnecting = true;
    console.log(`[RETRY] Reconnecting in 10 seconds...`);
    setTimeout(() => {
        reconnecting = false;
        startBot();
    }, 10000);
}

// Start bot
startBot();
