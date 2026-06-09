require("dotenv").config();
const { App } = require("@slack/bolt");
const axios = require("axios");

// Pls help me..

console.log("Checking Bot Token:", process.env.SLACK_BOT_TOKEN ? "Present (Starts with xoxb)" : "MISSING");
console.log("Checking App Token:", process.env.SLACK_APP_TOKEN ? "Present (Starts with xoxe-xapp)" : "MISSING");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

app.command("/zrr-ping", async ({ command, ack, respond }) => {
    await ack();
    // Fixed this quicker than light
    const startTime = Date.now();

    try {
        await respond({
            text: "Checking latency...",
            response_type: 'ephemeral'
        });

        const latency = Date.now() - startTime;

        await respond({
            text: `Pong!\n*Latency:* ${latency}ms`,
            replace_original: true
        });

    } catch (error) {
        console.error("Error running ping command:", error);
    }
});

app.command("/zrr-help", async ({ ack, respond }) => {
    await ack();
    await respond({
        text: `Available Commands:
/zrr-ping - Check bot latency
/zrr-help - List all available commands
/zrr-catfact - Get a random cat fact
/zrr-joke - Get a random joke`
    });
});

app.command("/zrr-catfact", async ({ ack, respond }) => {
    await ack();

    try {
        const response = await axios.get("https://catfact.ninja/fact");
        await respond({ text: `*Cat Fact:*\n${response.data.fact}` });
    } catch (err) {
        console.error("Error:", err);
        await respond({ text: "didnt find a cat fact" });
    }
});

app.command("/zrr-joke", async ({ ack, respond }) => {
    await ack();

    try {
        const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
        await respond({
            text: `*Here is a really funy joke i think:*\n_${response.data.setup}_\n\n*${response.data.punchline}*`
        });
    } catch (err) {
        console.error("Error:", err);
        await respond({ text: "didnt find a joke" });
    }
});

(async () => {
    await app.start();
    console.log("it works!");
})();
