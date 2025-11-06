const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});
client.initialize();

client.on("qr", (qr) => {
    console.log("Scan this QR to login:");
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("WhatsApp is ready!");
});

app.post("/send", async (req, res) => {
    console.log(req);
    if (!req.body.number || !req.body.message) {
        return res.status(400).send("Number and message are required");
    }
    const number = req.body.number; // e.g. 8801XXXXXXX
    const message = req.body.message;

    try {
        await client.sendMessage(number + "@c.us", message);
        res.send("Message sent!");
    } catch (e) {
        console.error(e);
        res.status(500).send("Failed to send message");
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));