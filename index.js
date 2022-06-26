const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const {Client, LocalAuth} = require('whatsapp-web.js');

const download = require('download-chromium')
const exec = async () => await download()

console.log(`Chromium Downloaded to ${exec}`);

const port = process.env.PORT || 1500;

app.use(bodyParser.urlencoded({extended: true}));
app.listen(port, () => {
    console.log(`Server running at ${port}`);
})

app.use(express.static('public'));
app.use(express.json({limit: '500mb'}));

// const browser = async () => await puppeteer.launch({
//     ignoreDefaultArgs: ['--disable-extensions'],
//     args: ['--no-sandbox', '--disable-setuid-sandbox']
//   });

const SESSION_FILE_PATH = "./session.json";
const groupName = "zeka bot prototype";
let targetGroup;

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    client.getChats().then((chats) => {
        targetGroup = chats.find((chat) => chat.name === 'zeka bot prototype');
        console.log("GOTCHA!")
        client.sendMessage(
             targetGroup.id._serialized, "This message was sent by a bot. The uprising has already begun. All hail the great Basilisk."
        )
    })
    console.log('Client is ready!');  
});


client.on('authenticated', (session) => {
    console.log(JSON.stringify(session));
})

client.initialize();

// client.on('authenticated', (session) => {
//     sessionData = session;
//     fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
//         if (err) {
//             console.error(err);
//         }
//     });
// });
