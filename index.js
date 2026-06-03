require("dotenv").config();
const { App } = require("@slack/bolt");
const axios = require("axios"); // Added for API requests

// Token safety checks (keeps track of your credential health)
console.log("Checking Bot Token:", process.env.SLACK_BOT_TOKEN ? "Present (Starts with xoxb)" : "MISSING");
console.log("Checking App Token:", process.env.SLACK_APP_TOKEN ? "Present (Starts with xoxe-xapp)" : "MISSING");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

// 1. Ping Command
app.command("/dsb-ping", async ({ command, ack, respond }) => {
    const start = Date.now();
    await ack();
    const latency = Date.now() - start;
    await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

// 2. Help Command
app.command("/dsb-help", async ({ ack, respond }) => {
    await ack();
    await respond({
        text: `Available Commands:
/dsb-ping - Check bot latency
/dsb-help - List all available commands
/dsb-catfact - Get a random cat fact
/dsb-joke - Get a random joke`
    });
});

// 3. Cat Fact Command (API-backed)
app.command("/dsb-catfact", async ({ ack, respond }) => {
    await ack();

    try {
        const response = await axios.get("https://catfact.ninja/fact");
        await respond({ text: `🐱 *Cat Fact:*\n${response.data.fact}` });
    } catch (err) {
        console.error("Catfact Error:", err);
        await respond({ text: "⚠️ Failed to fetch a cat fact." });
    }
});

// 4. Joke Command (API-backed)
app.command("/dsb-joke", async ({ ack, respond }) => {
    await ack();

    try {
        const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
        await respond({
            text: `😂 *Here is a joke:*\n_${response.data.setup}_\n\n*${response.data.punchline}*`
        });
    } catch (err) {
        console.error("Joke Error:", err);
        await respond({ text: "⚠️ Failed to fetch a joke." });
    }
});

// Start the app
(async () => {
    await app.start();
    console.log("⚡️ Bot is running in Socket Mode with API commands!");
})();